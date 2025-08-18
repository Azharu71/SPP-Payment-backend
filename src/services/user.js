// const bcrypt = require("bcryptjs");
const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const { userValidation, loginValidation } = require("../validation/user");
const jwt = require("jsonwebtoken");
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
    await db.query(sql, values);
    return {
      nama: user.nama,
      nisn: user.nisn,
    };
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") {
      throw new ResponseError(400, "Nisn Duplicated");
    }
    throw e;
  }
};

const userLogin = async (req) => {
  //Joi validation
  const { error, value: user } = loginValidation.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const loginValidate = "SELECT * FROM siswa WHERE nisn = ? AND nama = ? ";
  const [nisnRows] = await db.query(loginValidate, [user.nisn, user.nama]);

  // Hentikan eksekusi jika nisn atau nis salah
  if (nisnRows.length == 0) {
    throw new ResponseError(400, "Name or Nisn Wrong");
  }

  //kirim token jika berhasil login
  const userPayload = nisnRows[0];
  const payload = {
    nisn: userPayload.nisn,
    nama: userPayload.nama,
    level: "siswa",
  };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

  return {
    token: token,
    message: `Halo ${userPayload.nama}`,
  };
};

const userGet = async (nisn) => {
  //joi validation

  const selectuser = "SELECT * FROM siswa WHERE nisn = ? ";
  const [userRows] = await db.query(selectuser, [nisn]);

  // Hentikan eksekusi jika nisn atau nis salah
  if (userRows.length == 0) {
    throw new ResponseError(404, "User is not found");
  }

  //kirim data user jika berhasil login
  return userRows;
};
module.exports = { userRegister, userLogin, userGet };
