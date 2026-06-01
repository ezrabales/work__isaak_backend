const express = require("express");

const router = express.Router();
const { logIn, createUser } = require("../controllers/users");
const {
  validatorLogIn,
  validatorCreateUser,
} = require("../middlewares/validation");

router.post("/signin", validatorLogIn, logIn);
router.post("/signup", validatorCreateUser, createUser);

router.use("/users", require("./users"));
router.use("/pictures", require("./pictures"));
router.use("/jobs", require("./jobs"));
router.use("/parts", require("./parts"));
router.use("/email", require("./emails"));
router.use("/invoice", require("./invoice"));

module.exports = router;
