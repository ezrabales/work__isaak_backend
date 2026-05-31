const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },
    name: { type: String },
    location: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    email: {
      type: String,
      validate: {
        validator(v) {
          return !v || validator.isEmail(v);
        },
        message: "must be valid Email",
      },
    },
    phone: {
      type: String,
      validate: {
        validator(v) {
          return !v || validator.isMobilePhone(v, "any");
        },
        message: "must be valid phone number",
      },
    },
    description: { type: String },
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
    amountOwed: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    dateStarted: {
      type: String,
      default: () => {
        const now = new Date();

        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      },
    },
    dateEnded: {
      type: String,
      default: null,
    },
    paymentTerms: {
      type: String,
      default: null,
    },
    dateDue: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
