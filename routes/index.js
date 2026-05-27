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
router.use("/picture", require("./picture"));
router.use("/jobs", require("./jobs"));

router.get("/test", (req, res) => {
  res.send("working");
});

module.exports = router;
