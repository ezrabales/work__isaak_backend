const router = require("express").Router();
const { createPicture, getPictures } = require("../controllers/pictures");
const { auth } = require("../middlewares/auth");
const {
  validatorCreatePicture,
  validatorGetByInvoice,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreatePicture, createPicture);
router.get("/:invoiceNumber", auth, validatorGetByInvoice, getPictures);

module.exports = router;
