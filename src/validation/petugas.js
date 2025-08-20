const Joi = require("joi");

//validasi input data dengan joi

const petugasValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const petugasRegister = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  nama: Joi.string().required(),
  level: Joi.string().required(),
});

const petugasUpdate = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  nama_petugas: Joi.string().optional(),
  level: Joi.string().optional(),
});

const petugasDelete = Joi.object({
  username: Joi.string().required(),
});

module.exports = { petugasValidation, petugasRegister, petugasUpdate, petugasDelete };
