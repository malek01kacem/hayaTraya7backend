const Joi = require("joi");

const fieldValidationSchema = Joi.object({
  fieldName: Joi.string().required(),
  owner: Joi.string().required(), // You might want to adjust this based on the actual type
  contactPhone: Joi.string().required(),
  maxPlayers: Joi.number().required(), // Assuming it's a number
  mapLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
  address: Joi.string().required(),
});

module.exports = fieldValidationSchema;
