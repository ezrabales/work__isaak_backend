const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = new mongoose.Schema({
  invoiceNumber: {
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
  paymentStatus: {
    type: String,
    enum: {
      values: [
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      ],
      message: "{VALUE} is not a valid payment status",
    },
    default: "Not Charged",
  },
  invoiceInfo: {
    type: String,
  },
  dateStarted: {
    type: Date,
    default: Date.now,
  },
  dateEnded: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Job", jobSchema);
