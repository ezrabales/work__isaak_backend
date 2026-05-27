const router = require("express").Router();
const { createPicture, getPictures } = require("../controllers/pictures");
const { auth } = require("../middlewares/auth");
const {
  validatorCreatePicture,
  validatorGetPicByInvoice,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreatePicture, createPicture);
router.get("/:invoiceNumber", auth, validatorGetPicByInvoice, getPictures);

module.exports = router;
