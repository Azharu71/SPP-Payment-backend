const Joi = require("joi");

//validasi input data dengan joi

const petugasValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { petugasValidation };
