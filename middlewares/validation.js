const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// users
module.exports.validatorCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    rate: Joi.number().optional().allow(""),
    phone: Joi.number().optional().allow(""),
    name: Joi.string().optional().allow(""),
    footer: Joi.object().optional().allow(""),
  }),
});

module.exports.validatorLogIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// pictures
module.exports.validatorGetPicByInvoice = celebrate({
  params: Joi.object().keys({
    invoiceNumber: Joi.string().required(),
  }),
});

module.exports.validatorCreatePicture = celebrate({
  body: Joi.object().keys({
    src: Joi.string().required(),
    description: Joi.string().optional().allow(""),
    assetId: Joi.string().required(),
    invoiceNumber: Joi.string().required(),
  }),
});

module.exports.validatorDeletePicture = celebrate({
  params: Joi.object().keys({
    picId: Joi.string().required(),
  }),
});

// jobs
module.exports.validatorCreateJob = celebrate({
  body: Joi.object().keys({
    invoiceNumber: Joi.string().optional(),
    location: Joi.string().required(),
    name: Joi.string().optional().allow(""),
    notes: Joi.string().optional().allow(""),
    email: Joi.string().email().empty("").optional(),
    phone: Joi.string().empty("").optional(),
    description: Joi.string().empty("").optional(),
    paymentStatus: Joi.string()
      .valid(
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      )
      .default("Not Charged"),
    amountOwed: Joi.number().optional().allow(""),
    amountaPaid: Joi.number().optional().allow(""),
    invoiceInfo: Joi.string().optional(),
  }),
});

module.exports.validatorUpdateJob = celebrate({
  params: Joi.object().keys({
    jobId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    location: Joi.string().required(),
    name: Joi.string().optional().allow(""),
    notes: Joi.string().optional().allow(""),
    email: Joi.string().email().allow("").optional(),
    phone: Joi.string().empty("").optional(),
    description: Joi.string().empty("").optional(),
    paymentStatus: Joi.string()
      .valid(
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      )
      .default("Not Charged"),
    amountOwed: Joi.number().optional().allow(""),
    amountPaid: Joi.number().optional().allow(""),
    dateStarted: Joi.string().required(),
    dateEnded: Joi.string().optional().allow(""),
    paymentTerms: Joi.string().optional().allow(""),
    dateDue: Joi.string().optional().allow(""),
  }),
});

module.exports.validatorUpdateJobStatus = celebrate({
  params: Joi.object().keys({
    jobId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    paymentStatus: Joi.string()
      .valid(
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      )
      .default("Not Charged"),

    amountPaid: Joi.number().optional().allow(""),
    amountOwed: Joi.number().optional().allow(""),
  }),
});

// parts
module.exports.validatorCreatePart = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cost: Joi.number().required(),
  }),
});

// emails
module.exports.validatorSendEmail = celebrate({
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
});

// invoices
module.exports.validatorSendInvoice = celebrate({
  params: Joi.object().keys({
    jobId: Joi.string(),
  }),
  body: Joi.object().keys({
    invoiceNumber: Joi.string().required(),
    customerName: Joi.string().optional().allow(""),
    customerEmail: Joi.string().email().required(),
    customerPhone: Joi.string().optional().allow(""),
    date: Joi.date().required(),
    craftsmanName: Joi.string().optional().allow(""),
    craftsmanEmail: Joi.string().email().required(),
    craftsmanPhone: Joi.string().optional().allow(""),
    jobDescription: Joi.string().optional().allow(""),
    jobLocation: Joi.string().required(),
    paymentTerms: Joi.string().required(),
    dateDue: Joi.string().required(),
    parts: Joi.array().optional().allow(""),
    service: Joi.object().optional().allow(""),
    additions: Joi.array().optional().allow(""),
    grandTotal: Joi.number().optional().allow(""),
    footer: Joi.object().optional().allow(""),
  }),
});

module.exports.validatorGetInvoice = celebrate({
  params: Joi.object().keys({
    invoiceNumber: Joi.string(),
  }),
});
