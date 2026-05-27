const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  toggleLike,
} = require("../controllers/items");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateItem,
  validatorGetById,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", auth, validatorCreateItem, createItem);
router.delete("/:itemId", auth, validatorGetById, deleteItem);
router.put("/:itemId/likes", auth, validatorGetById, toggleLike);
router.delete("/:itemId/likes", auth, validatorGetById, toggleLike);

module.exports = router;
