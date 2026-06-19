const router = require("express").Router();
const {
  createPart,
  getParts,
  deletePart,
  updatePart,
} = require("../controllers/parts");
const { auth } = require("../middlewares/auth");
const {
  validatorCreatePart,
  validatorUpdatePart,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreatePart, createPart);
router.get("/", auth, getParts);
router.patch("/:partId", auth, validatorUpdatePart, updatePart);
router.delete("/:partId", auth, deletePart);

module.exports = router;
