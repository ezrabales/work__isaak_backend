const router = require("express").Router();
const { sendInvoice, getInvoice } = require("../controllers/invoice");
const { auth } = require("../middlewares/auth");
const {
  validatorSendInvoice,
  validatorGetInvoice,
} = require("../middlewares/validation");

router.post("/:jobId", auth, validatorSendInvoice, sendInvoice);
router.get("/:invoiceNumber", auth, validatorGetInvoice, getInvoice);

module.exports = router;
