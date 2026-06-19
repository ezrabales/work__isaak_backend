const mongoose = require("mongoose");
const validator = require("validator");

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  partNumber: {
    type: Number,
  },
});

module.exports = mongoose.model("Part", partSchema);
