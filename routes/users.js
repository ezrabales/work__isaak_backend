const express = require("express");
const { auth } = require("../middlewares/auth");

const router = express.Router();

const {
  getCurrentUser,
  updateCurrentUserRate,
  getCurrentUserRate,
  updateCurrentUser,
  updateCurrentUserPassword,
} = require("../controllers/users");
const {
  validarorUpdateCurrentUser,
  validarorUpdateCurrentUserPassword,
} = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validarorUpdateCurrentUser, updateCurrentUser);
router.get("/rate", auth, getCurrentUserRate);
router.patch("/rate", auth, updateCurrentUserRate);
router.patch(
  "/me/password",
  auth,
  validarorUpdateCurrentUserPassword,
  updateCurrentUserPassword,
);

module.exports = router;
