const Joi = require("joi");

const userValidation = Joi.object({
  nisn: Joi.number().required(),
  nis: Joi.number().required(),
  nama: Joi.string().max(100).required(),
  id_kelas: Joi.number().required(),
  alamat: Joi.string().max(100).required(),
  no_telp: Joi.number().required(),
  id_spp: Joi.number().required(),
});

module.exports = { userValidation };
