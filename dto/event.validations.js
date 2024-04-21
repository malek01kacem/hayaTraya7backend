const Joi = require("joi");

const eventValidationSchema = Joi.object({

  eventType: Joi.string().required().valid("TENNIS","PAINTBALL","CARTING"),
  field: Joi.string().required(),
  gender: Joi.string().required(),
  chat: Joi.array().items(Joi.string()),
  isExpired: Joi.boolean().default(false),
  eventDate: Joi.date().required(),
  startTime: Joi.string().required(),
  description: Joi.string().required(),
  endTime: Joi.string().required(),
  creator: Joi.string().required(),
  participants: Joi.array().items(Joi.string()),
  eventInfo: Joi.object({
    eventType: Joi.string().required(),
    level: Joi.string().required(),
    totalPlayers: Joi.number().required(),
    isPrivate: Joi.boolean().default(false)
  })
});

module.exports = eventValidationSchema;
