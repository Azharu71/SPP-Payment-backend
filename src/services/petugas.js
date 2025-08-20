const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const jwt = require("jsonwebtoken");
const { petugasValidation } = require("../validation/petugas");
const bcrypt = require("bcryptjs");

const petugasLogin = async (req) => {
  //Joi validation
  const { error, value: petugas } = petugasValidation.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const loginValidate = "SELECT * FROM petugas WHERE username = ? ";
  const [dataRows] = await db.query(loginValidate, [petugas.username]);

  // Hentikan eksekusi jika username salah
  if (dataRows.length == 0) {
    throw new ResponseError(400, "Username or Password Wrong");
  }

  //Hentikan eksekusi jika password salah
  const petugasPayload = dataRows[0];
  const isPassword = await bcrypt.compare(
    petugas.password,
    petugasPayload.password
  );
  console.log(petugas.password);
  console.log(petugasPayload.password);
  console.log(isPassword);

  if (!isPassword) {
    throw new ResponseError(400, "Username or Password Wrong");
  }

  //kirim token yang berlaku 1 jam jika berhasil login
  const payload = {
    username: petugasPayload.username,
    level: petugasPayload.level,
  };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

  return {
    token: token,
    message: `Halo ${petugasPayload.username}`,
  };
};

module.exports = { petugasLogin };
