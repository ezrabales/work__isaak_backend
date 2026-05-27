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
    invoiceNumber: Joi.string().required(),
  }),
});

// jobs
module.exports.validatorCreateJob = celebrate({
  body: Joi.object().keys({
    invoiceNumber: Joi.string().optional(),
    location: Joi.string().required(),
    notes: Joi.string().optional().allow(""),
    paymentStatus: Joi.string()
      .valid(
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      )
      .default("Not Charged"),
    invoiceInfo: Joi.string().optional(),
  }),
});

module.exports.validatorUpdateJob = celebrate({
  params: Joi.object().keys({
    jobId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    location: Joi.string().required(),
    notes: Joi.string().optional().allow(""),
    paymentStatus: Joi.string()
      .valid(
        "Not Charged",
        "Awaiting Payment",
        "Partially Paid",
        "Paid in Full",
      )
      .default("Not Charged"),
    dateStarted: Joi.date().required(),
    dateEnded: Joi.date().optional().allow(""),
  }),
});

// parts
module.exports.validatorCreatePart = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    cost: Joi.number().required(),
  }),
});
