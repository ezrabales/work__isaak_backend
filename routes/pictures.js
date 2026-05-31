const router = require("express").Router();
const {
  createPicture,
  getPictures,
  deletePicture,
} = require("../controllers/pictures");
const { auth } = require("../middlewares/auth");
const {
  validatorCreatePicture,
  validatorGetPicByInvoice,
  validatorDeletePicture,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreatePicture, createPicture);
router.get("/:invoiceNumber", auth, validatorGetPicByInvoice, getPictures);
router.delete("/:picId", auth, validatorDeletePicture, deletePicture);

module.exports = router;
