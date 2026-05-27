const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = new mongoose.Schema({
  invoiceNumber: {
    required: true,
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // pictures: {
  //   type:?
  // },
  paymentStatus: {
    required: true,
    type: String,
  },
  invoiceInfo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("ClothingItem", jobSchema);
