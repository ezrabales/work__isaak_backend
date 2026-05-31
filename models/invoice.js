const mongoose = require("mongoose");
const validator = require("validator");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customerName: {
    type: String,
  },
  customerEmail: {
    type: String,
    validate: {
      validator(v) {
        return !v || validator.isEmail(v);
      },
      message: "must be valid Email",
    },
    required: true,
  },
  customerPhone: {
    type: String,
    validate: {
      validator(v) {
        return !v || validator.isMobilePhone(v, "any");
      },
      message: "must be valid phone number",
    },
  },
  date: {
    type: Date,
    required: true,
  },
  craftsmanName: {
    type: String,
  },
  craftsmanEmail: {
    type: String,
    validate: {
      validator(v) {
        return !v || validator.isEmail(v);
      },
      message: "must be valid Email",
    },
    required: true,
  },
  craftsmanPhone: {
    type: String,
    validate: {
      validator(v) {
        return !v || validator.isMobilePhone(v, "any");
      },
      message: "must be valid phone number",
    },
  },
  jobDescription: {
    type: String,
  },
  jobLocation: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: String,
    required: true,
  },
  dateDue: {
    type: String,
    required: true,
  },
  parts: {
    type: Array,
  },
  service: {
    type: Object,
  },
  additions: {
    type: Array,
  },
  grandTotal: {
    type: Number,
  },
  footer: {
    type: Object,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
