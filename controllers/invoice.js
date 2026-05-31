const Invoice = require("../models/invoice");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const Job = require("../models/job");

// ─── Layout constants ────────────────────────────────────────────────────────
const MARGIN = 0.5 * 72; // 0.5in in points
const PAGE_WIDTH = 8.5 * 72;
const PAGE_HEIGHT = 11 * 72; // LETTER height in points
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BOTTOM_MARGIN = PAGE_HEIGHT - MARGIN; // y threshold before a new page is needed
const GRAY = "#979797";
const BLACK = "#000000";

// ─── Page-break guard ────────────────────────────────────────────────────────
// Call before drawing anything that needs `needed` points of vertical space.
// Returns the y to start drawing at (MARGIN on a fresh page, or y unchanged).
function ensurePage(doc, y, needed = 20) {
  if (y + needed > BOTTOM_MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

// Draw a horizontal rule across the content area
function hRule(doc, y, color = BLACK) {
  doc
    .moveTo(MARGIN, y)
    .lineTo(MARGIN + CONTENT_WIDTH, y)
    .strokeColor(color)
    .lineWidth(0.5)
    .stroke();
}

// Render a 2-column key/value grid.
// Row height is dynamic — tall enough for however many lines the value wraps to.
// Returns the Y position after the last row.
function drawInfoGrid(doc, pairs, startY, rowGap = 7) {
  const colWidth = CONTENT_WIDTH / 2;
  let y = startY;

  pairs.forEach(({ key, value }) => {
    const displayValue = String(value ?? "");

    // Use a single space for measuring when the value is empty so that
    // heightOfString returns a full line-height instead of 0.
    doc.fontSize(10).font("Helvetica");
    const valueHeight = doc.heightOfString(displayValue || " ", {
      width: colWidth,
    });
    const rowHeight = valueHeight + rowGap;

    y = ensurePage(doc, y, rowHeight);

    doc
      .fontSize(9)
      .fillColor(BLACK)
      .font("Helvetica")
      .text(key + ":", MARGIN, y, { width: colWidth, lineBreak: false });

    doc
      .fontSize(10)
      .fillColor(BLACK)
      .font("Helvetica")
      .text(displayValue, MARGIN + colWidth, y, {
        width: colWidth,
        lineBreak: true,
      });

    y += rowHeight;
  });

  return y;
}

// Draw a table with a header row and body rows.
// Row heights are dynamic — each row is exactly tall enough for its tallest cell.
// Returns Y position after the table.
function drawTable(doc, headers, rows, startY) {
  const colCount = headers.length;
  const colWidth = CONTENT_WIDTH / colCount;
  const HEADER_BG = "#f0f0f0";
  const ROW_PAD = 6;
  const FONT_SIZE = 9;
  const HEADER_HEIGHT = FONT_SIZE + ROW_PAD * 2; // header is always single-line

  let y = startY;

  // ── Measure the natural height of a body row ─────────────────────────────
  // Sets font state, measures every cell, returns the tallest + padding.
  function measureRowHeight(row) {
    doc.fontSize(FONT_SIZE).font("Helvetica");
    const tallest = row.reduce((max, cell) => {
      const h = doc.heightOfString(String(cell ?? ""), { width: colWidth - 8 });
      return Math.max(max, h);
    }, doc.currentLineHeight());
    return tallest + ROW_PAD * 2;
  }

  // ── Helper: draw the header row at the current y ─────────────────────────
  function drawHeader(atY) {
    doc.rect(MARGIN, atY, CONTENT_WIDTH, HEADER_HEIGHT).fill(HEADER_BG);

    headers.forEach((h, i) => {
      doc
        .fontSize(FONT_SIZE)
        .fillColor(BLACK)
        .font("Helvetica-Bold")
        .text(h, MARGIN + colWidth * i + 4, atY + ROW_PAD, {
          width: colWidth - 8,
          lineBreak: false,
        });
    });

    const afterHeader = atY + HEADER_HEIGHT;
    hRule(doc, afterHeader, GRAY);
    return afterHeader;
  }

  // Ensure room for header + at least one row
  y = ensurePage(doc, y, HEADER_HEIGHT * 2);
  y = drawHeader(y);

  // ── Body rows ─────────────────────────────────────────────────────────────
  rows.forEach((row, rowIdx) => {
    const rowHeight = measureRowHeight(row);

    // Page break if needed — redraw header on the new page
    const prevY = y;
    y = ensurePage(doc, y, rowHeight + 4);
    if (y !== prevY) {
      y = drawHeader(y);
    }

    // Alternating row tint
    if (rowIdx % 2 === 1) {
      doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill("#fafafa");
    }

    // Draw each cell — text is now allowed to wrap within the column width
    row.forEach((cell, i) => {
      doc
        .fontSize(FONT_SIZE)
        .fillColor(BLACK)
        .font("Helvetica")
        .text(String(cell ?? ""), MARGIN + colWidth * i + 4, y + ROW_PAD, {
          width: colWidth - 8,
          lineBreak: true, // ← allow wrapping
        });
    });

    y += rowHeight;
    hRule(doc, y, "#e0e0e0");
  });

  return y + 4;
}

// ─── PDF builder ─────────────────────────────────────────────────────────────
// Accepts an invoice document and returns a Promise that resolves to a Buffer.
function buildInvoicePDF(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      autoFirstPage: true,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Format helpers ──────────────────────────────────────────────────────
    const formatPhone = (p = "") =>
      p.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

    const formatDate = (d) => {
      if (!d) return "";

      const date = new Date(d);

      return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
    };

    const formatMoney = (amount = 0, places = 2) =>
      Number(amount).toFixed(places);

    // ═══════════════════════════════════════════════════════════════════════
    // TITLE
    // ═══════════════════════════════════════════════════════════════════════
    let curY = MARGIN;

    curY = ensurePage(doc, curY, 50);
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text("INVOICE", MARGIN, curY);

    curY += 28;
    hRule(doc, curY);
    curY += 14;

    // ═══════════════════════════════════════════════════════════════════════
    // CUSTOMER INFO GRID
    // ═══════════════════════════════════════════════════════════════════════
    const customerPairs = [
      { key: "Customer Name", value: invoice.customerName },
      { key: "Customer Email", value: invoice.customerEmail },
      { key: "Customer Phone", value: formatPhone(invoice.customerPhone) },
      { key: "Invoice Number", value: invoice.invoiceNumber },
      { key: "Date", value: formatDate(invoice.date) },
    ];

    curY = drawInfoGrid(doc, customerPairs, curY);

    // ═══════════════════════════════════════════════════════════════════════
    // CRAFTSMAN INFO GRID
    // ═══════════════════════════════════════════════════════════════════════
    curY = ensurePage(doc, curY, 20);
    curY += 10;
    hRule(doc, curY, GRAY);
    curY += 10;

    const craftsmanPairs = [
      { key: "Craftsman Name", value: invoice.craftsmanName },
      { key: "Craftsman Email", value: invoice.craftsmanEmail },
      { key: "Craftsman Phone", value: formatPhone(invoice.craftsmanPhone) },
      { key: "Job", value: invoice.jobDescription },
      { key: "Job Location", value: invoice.jobLocation },
      { key: "Payment Terms", value: invoice.paymentTerms },
      { key: "Due Date", value: invoice.dateDue },
    ];

    curY = drawInfoGrid(doc, craftsmanPairs, curY);

    curY = ensurePage(doc, curY, 20);
    curY += 10;
    hRule(doc, curY, GRAY);
    curY += 24;

    // ═══════════════════════════════════════════════════════════════════════
    // PARTS TABLE
    // ═══════════════════════════════════════════════════════════════════════
    if (invoice.parts?.length > 0) {
      curY = ensurePage(doc, curY, 60);
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor(BLACK)
        .text("Parts", MARGIN, curY);
      curY += 18;

      const partsBody = invoice.parts.map((part) => {
        const qty = part.quantity || 1;
        const unitPrice = (qty * part.cost + (part.extra || 0)) / qty;
        const lineTotal = qty * part.cost + (part.extra || 0);
        return [
          part.name,
          qty,
          `$${formatMoney(unitPrice, 3)}`,
          `$${formatMoney(lineTotal)}`,
        ];
      });

      curY = drawTable(
        doc,
        ["NAME", "QUANTITY", "UNIT PRICE", "LINE TOTAL"],
        partsBody,
        curY,
      );
      curY += 16;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SERVICE TABLE
    // ═══════════════════════════════════════════════════════════════════════
    if (invoice.service?.hours) {
      curY = ensurePage(doc, curY, 60);
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor(BLACK)
        .text("Service", MARGIN, curY);
      curY += 18;

      curY = drawTable(
        doc,
        ["LABOR", "UNIT PRICE", "LINE TOTAL"],
        [
          [
            `${invoice.service.hours} hours`,
            `$${formatMoney(invoice.service.hrRate, 3)} /hr`,
            `$${invoice.service.totalForHours}`,
          ],
        ],
        curY,
      );
      curY += 16;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADDITIONS TABLE
    // ═══════════════════════════════════════════════════════════════════════
    if (invoice.additions?.length > 0) {
      curY = ensurePage(doc, curY, 60);
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor(BLACK)
        .text("Additional Charges and Discounts", MARGIN, curY);
      curY += 18;

      const addBody = invoice.additions.map((a) => [
        a.reason,
        `$${formatMoney(a.cost)}`,
        `$${formatMoney(a.cost)}`,
      ]);

      curY = drawTable(
        doc,
        ["ADDITION", "UNIT PRICE", "LINE TOTAL"],
        addBody,
        curY,
      );
      curY += 16;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GRAND TOTAL
    // ═══════════════════════════════════════════════════════════════════════
    curY = ensurePage(doc, curY, 40);
    curY += 15;

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor(BLACK)
      .text(`GRAND TOTAL:  $${formatMoney(invoice.grandTotal)}`, MARGIN, curY, {
        width: CONTENT_WIDTH,
        align: "right",
      });

    curY += 26;

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER  — kept together on one page
    // ═══════════════════════════════════════════════════════════════════════
    const f = invoice.footer ?? {};
    console.log(f);
    const contactLine = [
      f.companyName,
      f.address,
      f.phone ? `PHONE: ${f.phone}` : null,
    ]
      .filter(Boolean)
      .join("  |  ");

    const footerLines = [
      { text: f.payableNote ?? "", bold: true },
      { text: f.thankYou ?? "", bold: false },
      { text: contactLine, bold: false },
    ].filter(({ text }) => text); // skip any empty lines

    // Keep all footer lines together on one page
    curY = ensurePage(doc, curY, footerLines.length * 22 + 25);
    curY += 25;

    footerLines.forEach(({ text, bold }) => {
      doc
        .fontSize(9)
        .font(bold ? "Helvetica-Bold" : "Helvetica")
        .fillColor(BLACK)
        .text(text, MARGIN, curY, { width: CONTENT_WIDTH, align: "center" });
      curY += 22;
    });

    // ── Page numbers ────────────────────────────────────────────────────────
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(`${i + 1} of ${range.count}`, MARGIN + CONTENT_WIDTH - 30, 730, {
          width: 30,
          align: "right",
        });
    }

    doc.end();
  });
}

module.exports.sendInvoice = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const invoice = await Invoice.create({
      ...req.body,
      owner: req.user._id,
    });

    const pdfBuffer = await buildInvoicePDF(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${invoice.craftsmanName || invoice.craftsmanEmail}" <${process.env.EMAIL_USER}>`,
      to: invoice.customerEmail,
      replyTo: invoice.craftsmanEmail,
      subject: `$${Number(invoice.grandTotal).toFixed(2)} Invoice from ${invoice.craftsmanName || invoice.craftsmanEmail}`,
      text: `Hello ${invoice.customerName || "there"},

Thank you for your business.

Attached is your invoice (#${invoice.invoiceNumber}) from ${
        invoice.craftsmanName || invoice.craftsmanEmail
      } for $${invoice.grandTotal}.

If you have any questions about the invoice, work completed, or payment details, simply reply to this email.

Thank you — your business is appreciated.

${invoice.craftsmanName || invoice.craftsmanEmail}`,

      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Invoice</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;padding:36px 48px 32px;">
    <tr>
      <td>
        <p style="margin:0 0 6px;font-size:12px;color:#888888;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Invoice from</p>
        <p style="margin:0 0 28px;font-size:22px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;">${invoice.craftsmanName || invoice.craftsmanEmail}</p>
        <p style="margin:0 0 4px;font-size:12px;color:#888888;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Amount due</p>
        <p style="margin:0;font-size:36px;font-weight:bold;color:#ffffff;font-family:Georgia,serif;">$${Number(invoice.grandTotal).toFixed(2)}</p>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 48px 0;">
    <tr>
      <td>
        <p style="margin:0 0 24px;font-size:16px;color:#1a1a1a;line-height:1.7;">Hello ${invoice.customerName || "there"},</p>
        <p style="margin:0 0 24px;font-size:16px;color:#333333;line-height:1.7;">Thank you for your business.</p>

        <p style="margin:0 0 24px;font-size:15px;color:#555555;font-family:Arial,sans-serif;line-height:1.6;">
          Your invoice (<strong style="color:#1a1a1a;">#${invoice.invoiceNumber}</strong>) is attached to this email as a PDF.
        </p>

        <p style="margin:0 0 24px;font-size:16px;color:#333333;line-height:1.7;">
          If you have any questions about the invoice, the work completed, or payment details, simply reply to this email.
        </p>

        <p style="margin:0 0 40px;font-size:16px;color:#1a1a1a;line-height:1.7;">Thank you — your business is appreciated.</p>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:0 48px 40px;">
    <tr>
      <td style="border-top:1px solid #e8e8e8;padding-top:24px;">
        <p style="margin:0 0 2px;font-size:14px;color:#1a1a1a;font-family:Arial,sans-serif;font-weight:bold;">${invoice.craftsmanName}</p>
        <p style="margin:0;font-size:13px;color:#888888;font-family:Arial,sans-serif;">${invoice.craftsmanEmail}</p>
      </td>
    </tr>
  </table>

</body>
</html>`,

      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    try {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const job = await Job.findOneAndUpdate(
        { _id: jobId, owner: req.user._id },
        {
          paymentStatus: "Awaiting Payment",
          amountOwed: invoice.grandTotal,
          dateEnded: localDate,
        },
        { new: true, runValidators: true },
      );
      return res.json({
        job,
      });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getInvoice = async (req, res, next) => {
  const { invoiceNumber } = req.params;
  const owner = req.user._id;

  try {
    const invoice = await Invoice.findOne({ owner, invoiceNumber });
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const pdfBuffer = await buildInvoicePDF(invoice);

    return res.json({
      success: true,
      pdf: pdfBuffer.toString("base64"),
    });
  } catch (err) {
    next(err);
  }
};
