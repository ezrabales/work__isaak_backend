const router = require("express").Router();
const { sendEmailToEzra } = require("../controllers/emails");
const { auth } = require("../middlewares/auth");
const { validatorSendEmail } = require("../middlewares/validation");

router.post("/ezra", auth, validatorSendEmail, sendEmailToEzra);

module.exports = router;
