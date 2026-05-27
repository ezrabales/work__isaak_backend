const express = require("express");
const { auth } = require("../middlewares/auth");

const router = express.Router();

const {
  getCurrentUser,
  updateCurrentUserRate,
  getCurrentUserRate,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUserRate);
router.get("/rate", auth, getCurrentUserRate);

module.exports = router;
