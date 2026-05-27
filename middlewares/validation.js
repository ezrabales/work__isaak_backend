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

module.exports.validatorGetByInvoice = celebrate({
  params: Joi.object().keys({
    invoiceNumber: Joi.string().required(),
  }),
});

module.exports.validatorCreatePicture = celebrate({
  body: Joi.object().keys({
    src: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    invoiceNumber: Joi.string().required(),
  }),
});
