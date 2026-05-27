const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "must be valid Email",
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  rate: {
    type: Number,
    default: 75,
  },
});

module.exports = mongoose.model("User", userSchema);
