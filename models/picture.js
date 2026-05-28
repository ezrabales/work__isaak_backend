const mongoose = require("mongoose");
const validator = require("validator");

const pictureSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  assetId: {
    type: String,
  },
  invoiceNumber: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Picture", pictureSchema);
