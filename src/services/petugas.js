const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const jwt = require("jsonwebtoken");
const petugasValidation = require("../validation/petugas");
const bcrypt = require("bcryptjs");

const petugasLogin = async (req) => {
  //Joi validation
  const { error, value: petugas } =
    petugasValidation.petugasValidation.validate(req);
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
  // console.log(petugas.password);
  // console.log(petugasPayload.password);
  // console.log(isPassword);

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
    message: `Halo ${petugasPayload.nama_petugas}`,
  };
};

const petugasRegister = async (req) => {
  // joi validation
  const { error, value: petugas } =
    petugasValidation.petugasRegister.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }
  // console.log(petugas);

  // validasi apakah username sudah ada atau tidak
  const usernameCheckSql = "SELECT * FROM petugas WHERE username = ?";
  const [usernameRows] = await db.query(usernameCheckSql, [petugas.username]);
  if (usernameRows.length > 0) {
    throw new ResponseError(400, "Username Already Exist");
  }

  //lanjutkan insert ke database jika tidak ada
  const insertPetugas =
    "INSERT INTO petugas (username, password, nama_petugas, level) VALUES (?,?,?,?)";
  const password = await bcrypt.hash(petugas.password, 10); //hash password
  const values = [petugas.username, password, petugas.nama, petugas.level];

  try {
    db.query(insertPetugas, values);
    return {
      username: petugas.username,
      level: petugas.level,
    };
  } catch (error) {
    throw e;
  }
};

const getPetugas = async (req) => {
  const getPetugas = "SELECT username, nama_petugas, level FROM petugas";
  const [petugasRows] = await db.query(getPetugas);

  // Hentikan eksekusi tidak ada data
  if (petugasRows.length == 0) {
    throw new ResponseError(404, "Petugas is not found");
  }
  return petugasRows;
};

const updatePetugas = async (req) => {
  //joi validation
  const { error, value: petugas } =
    petugasValidation.petugasUpdate.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  if (!petugas.username) {
    throw new ResponseError(
      400,
      "Username is required to identify the user to update."
    );
  }

  // validasi apakah username yang ingin di update ada atau tidak
  const usernameCheckSql = "SELECT * FROM petugas WHERE username = ?";
  const [usernameRows] = await db.query(usernameCheckSql, [petugas.username]);
  if (usernameRows.length === 0) {
    throw new ResponseError(400, "There is no petugas with that username");
  }

  const newData = {};
  if (petugas.password) {
    newData.password = await bcrypt.hash(petugas.password, 10); //hash password
  }
  if (petugas.nama) {
    newData.nama = petugas.nama;
  }
  if (petugas.level) {
    newData.level = petugas.level;
  }

  //cek jika tidak ada data yang diupdate
  if (Object.keys(newData).length === 0) {
    return { message: "No new data provided to update." };
  }

  const setClauses = Object.keys(newData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(newData), petugas.username];

  const updatePetugas = `UPDATE petugas SET ${setClauses} WHERE username = ?`;

  try {
    const query = await db.query(updatePetugas, values);
    // console.log(query);
    if (query[0].affectedRows === 0) {
      throw new ResponseError(404, "Update failed");
    } else {
      return {
        message: "Updated successfully",
        updated: Object.keys(petugas),
      };
    }
  } catch (e) {
    throw e;
  }
};

const deletePetugas = async (req) => {
  // console.log(req);
  const { error, value: petugas } =
    petugasValidation.petugasDelete.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const getPetugas = `SELECT * FROM petugas WHERE username = ?`;
  const [isPetugas] = await db.query(getPetugas, petugas.username);

  if (isPetugas.length === 0) {
    throw new ResponseError(
      404,
      `Can't delete petugas with username ${petugas.username}`
    );
  }

  const deletePetugas = "DELETE FROM petugas WHERE username = ?";
  const [petugasRows] = await db.query(deletePetugas, petugas.username);

  // Hentikan eksekusi tidak ada data
  if (petugasRows.affectedRows == 0) {
    throw new ResponseError(404, "Petugas is not found");
  }

  return { message: "Petugas Deleted" };
};
module.exports = {
  petugasLogin,
  getPetugas,
  petugasRegister,
  updatePetugas,
  deletePetugas,
};
