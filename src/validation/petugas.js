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

const petugas = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().optional(),
  nama_petugas: Joi.string().optional(),
  level: Joi.string().optional(),
});

const siswa = Joi.object({
  nisn: Joi.number().required(),
  nis: Joi.number().optional(),
  nama: Joi.string().max(100).optional(),
  id_kelas: Joi.number().optional(),
  alamat: Joi.string().max(100).optional(),
  no_telp: Joi.number().optional(),
  id_spp: Joi.number().optional(),
});
const tambahKelas = Joi.object({
  nama_kelas: Joi.string().required(),
  kompetensi_keahlian: Joi.string().required(),
});

const kelas = Joi.object({
  id_kelas: Joi.number().required(),
  nama_kelas: Joi.string().optional(),
  kompetensi_keahlian: Joi.string().optional(),
});
const spp = Joi.object({
  id_spp: Joi.number().required(),
  tahun: Joi.number().optional(),
  nominal: Joi.number().optional(),
});
const tambahSpp = Joi.object({
  tahun: Joi.number().required(),
  nominal: Joi.number().required(),
});

const tambahPembayaran = Joi.object({
  id_petugas: Joi.number().required(),
  id_spp: Joi.number().required(),
  nisn: Joi.number().required(),
  tgl_bayar: Joi.date().required(),
  jumlah_bayar: Joi.number().required(),
});

const pembayaran = Joi.object({
  id_pembayaran: Joi.number().required(),
  id_petugas: Joi.number().optional(),
  id_spp: Joi.number().optional(),
  nisn: Joi.number().optional(),
  tgl_bayar: Joi.date().optional(),
  jumlah_bayar: Joi.number().optional(),
});


module.exports = {
  petugasValidation,
  petugasRegister,
  petugas,
  siswa,
  kelas,
  tambahKelas,
  spp,
  tambahSpp,
  tambahPembayaran,
  pembayaran,
};
