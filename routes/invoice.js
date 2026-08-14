const router = require("express").Router();
const {
  sendInvoice,
  getInvoice,
  resendInvoice,
} = require("../controllers/invoice");
const { auth } = require("../middlewares/auth");
const { disallowTester } = require("../middlewares/disallowTester");
const {
  validatorSendInvoice,
  validatorGetInvoice,
  validatorResendInvoice,
} = require("../middlewares/validation");

router.post("/:jobId", auth, validatorSendInvoice, sendInvoice);
router.post(
  "/resend/:invoiceNumber",
  auth,
  validatorResendInvoice,
  disallowTester,
  resendInvoice,
);
router.get("/:invoiceNumber", auth, validatorGetInvoice, getInvoice);

module.exports = router;
