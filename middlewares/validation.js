const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validatorCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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

module.exports.validatorGetPicByInvoice = celebrate({
  params: Joi.object().keys({
    invoiceNumber: Joi.string().required(),
  }),
});

module.exports.validatorCreatePicture = celebrate({
  body: Joi.object().keys({
    src: Joi.string().required(),
    description: Joi.string().optional(),
    invoiceNumber: Joi.string().required(),
  }),
});

module.exports.validatorGetJobsByInvoice = celebrate({
  params: Joi.object().keys({
    owner: Joi.string(),
  }),
});

module.exports.validatorCreateJob = celebrate({
  body: Joi.object().keys({
    invoiceNumber: Joi.string().optional(),
    location: Joi.string().required(),
    notes: Joi.string().optional(),
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
