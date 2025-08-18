// const bcrypt = require("bcryptjs");
const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const { userValidation } = require("../validation/user");

const userRegister = async (req) => {
  const { error, value: user } = userValidation.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  // validasi apakah nisn sudah ada atau tidak

  const nisnCheckSql = "SELECT * FROM siswa WHERE nisn = ?";
  const [nisnRows] = await db.query(nisnCheckSql, [user.nisn]);

  // Hentikan eksekusi jika nisn sudah ada
  if (nisnRows.length > 0) {
    throw new ResponseError(400, "Nisn Already Exist");
  }

  //lanjutkan insert ke database jika tidak ada

  const sql = `
    INSERT INTO siswa (nisn, nis, nama, id_kelas, alamat, no_telp, id_spp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user.nisn,
    user.nis,
    user.nama,
    user.id_kelas,
    user.alamat,
    user.no_telp,
    user.id_spp,
  ];
  try {
    return await db.query(sql, values);
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      throw new ResponseError(400, "Nisn Duplicated");
    }
    throw e; // Lemparkan error lain jika ada
  }
};

const userLogin = async (req) => {
  //Joi validation
  const { error, value: user } = userValidation.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  // validasi apakah nisn sudah ada atau tidak

  const loginValidate =
    "SELECT * FROM siswa WHERE (nisn, nama) = VALUES (?, ?) ";
  const [nisnRows] = await db.query(loginValidate, [user.nisn, user.nama]);

  // Hentikan eksekusi jika nisn atau nis salah
  if (nisnRows.length == 0) {
    throw new ResponseError(400, "Nama or Nisn Wrong");
  }
};
module.exports = { userRegister, userLogin };
