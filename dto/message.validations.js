const Joi = require('joi');

const messageValidationSchema = Joi.object({
  message: Joi.string().required(),
  sender: Joi.string().required(),
  isRead: Joi.boolean(),
  eventId: Joi.string(),
});
  

module.exports = messageValidationSchema;