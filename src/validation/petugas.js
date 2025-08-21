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
  username: Joi.string().required(),
  password: Joi.string().optional(),
  nama_petugas: Joi.string().optional(),
  level: Joi.string().optional(),
});

const petugasDelete = Joi.object({
  username: Joi.string().required(),
});

const updateSiswa = Joi.object({
  nisn: Joi.number().required(),
  nis: Joi.number().optional(),
  nama: Joi.string().max(100).optional(),
  id_kelas: Joi.number().optional(),
  alamat: Joi.string().max(100).optional(),
  no_telp: Joi.number().optional(),
  id_spp: Joi.number().optional(),
});
const deleteSiswa = Joi.object({
  nisn: Joi.number().required(),
});
module.exports = {
  petugasValidation,
  petugasRegister,
  petugasUpdate,
  petugasDelete,
  updateSiswa,
  deleteSiswa
};
