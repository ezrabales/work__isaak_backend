const emailjs = require("@emailjs/nodejs");
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});
const User = require("../models/user");

const escapeHTML = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

module.exports.sendEmailToEzra = async (req, res, next) => {
  try {
    const { message } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const fromEmail = user.email;
    const toEmail = "bales.ezra@gmail.com";

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        email_content: `
      <h2>New Message from Plumbing Tech</h2>
      <p><strong>From:</strong> ${fromEmail}</p>
      <hr>
      <p>${escapeHTML(message)}</p>
    `,
        subject: `New message from Plumbing Tech`,
        toEmail: toEmail,
        fromEmail: fromEmail,
      },
    );

    res.status(200).send({
      message: "Email sent successfully",
    });
  } catch (err) {
    next(err);
  }
};
