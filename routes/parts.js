const router = require("express").Router();
const { createPart, getParts, deletePart } = require("../controllers/parts");
const { auth } = require("../middlewares/auth");
const { validatorCreatePart } = require("../middlewares/validation");

router.post("/", auth, validatorCreatePart, createPart);
router.get("/", auth, getParts);
router.delete("/:partId", auth, deletePart);

module.exports = router;
