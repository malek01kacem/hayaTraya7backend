const Joi = require("joi");

const signUpValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  //preferences: Joi.string().required(),
  userLocation: Joi.string().optional(),
  isNotificationActive: Joi.boolean().default(true)
});

const signInValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().required()
});

module.exports = {
  signUpValidationSchema,
  signInValidationSchema
};
