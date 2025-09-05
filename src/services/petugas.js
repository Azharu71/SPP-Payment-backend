const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const jwt = require("jsonwebtoken");
const petugasValidation = require("../validation/petugas");
const bcrypt = require("bcryptjs");

//petugas
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

const getPetugas = async (user) => {
  const getPetugas = "SELECT username, nama_petugas, level FROM petugas";
  const [petugasRows] = await db.query(getPetugas);
  // Hentikan eksekusi tidak ada data
  if (petugasRows.length == 0) {
    throw new ResponseError(404, "Petugas is not found");
  }
  const data = {
    message: `Halo ${user.username}`,
    daftar_petugas: petugasRows,
  };

  return data;
};

const updatePetugas = async (req) => {
  //joi validation
  const { error, value: petugas } = petugasValidation.petugas.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
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
  if (petugas.nama_petugas) {
    newData.nama_petugas = petugas.nama_petugas;
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
    const [query] = await db.query(updatePetugas, values);
    if (query.changedRows === 0) {
      throw new ResponseError(404, "No provided data to update");
    } else {
      return {
        message: "Updated successfully",
        updated: Object.keys(newData),
      };
    }
  } catch (e) {
    throw e;
  }
};

const deletePetugas = async (req, user) => {
  // console.log(req);
  const { error, value: petugas } = petugasValidation.petugas.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  if (petugas.username === user.username) {
    throw new ResponseError(403, "Can't delete your own accoount");
  }

  const getPetugas = `SELECT * FROM petugas WHERE username = ?`;
  const [isPetugas] = await db.query(getPetugas, petugas.username);

  // Hentikan eksekusi tidak ada data
  if (isPetugas.length === 0) {
    throw new ResponseError(
      404,
      `There is no petugas with username: ${petugas.username}`
    );
  }

  const deletePetugas = "DELETE FROM petugas WHERE username = ?";
  try {
    await db.query(deletePetugas, petugas.username);
  } catch (e) {
    throw e;
  }

  return { message: "Petugas Deleted" };
};

const petugasLogout = async (user) => {
  const selectuser = "SELECT * FROM petugas WHERE username = ? ";
  const [userRows] = await db.query(selectuser, [user.username]);
  if (userRows.length == 0) {
    throw new ResponseError(404, "User is not found");
  }

  return {
    message: "uhh oke",
  };
};

//logic untuk update data siswa dll
const updateSiswa = async (req) => {
  //joi validation
  const { error, value: dataSiswa } = petugasValidation.siswa.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  // validasi apakah username yang ingin di update ada atau tidak
  const nisnCheckSql = "SELECT nisn FROM siswa WHERE nisn = ?";
  const [nisnRows] = await db.query(nisnCheckSql, dataSiswa.nisn);
  if (nisnRows.length === 0) {
    throw new ResponseError(400, "There is no siswa with that username");
  }

  const newData = {};
  if (dataSiswa.nis) {
    newData.nis = dataSiswa.nis;
  }
  if (dataSiswa.nama) {
    newData.nama = dataSiswa.nama;
  }
  if (dataSiswa.id_kelas) {
    newData.id_kelas = dataSiswa.id_kelas;
  }
  if (dataSiswa.alamat) {
    newData.alamat = dataSiswa.alamat;
  }
  if (dataSiswa.no_telp) {
    newData.no_telp = dataSiswa.no_telp;
  }
  if (dataSiswa.id_spp) {
    newData.id_spp = dataSiswa.id_spp;
  }

  //cek jika tidak ada data yang diupdate
  if (Object.keys(newData).length === 0) {
    return { message: "No new data provided to update." };
  }

  const setClauses = Object.keys(newData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(newData), dataSiswa.nisn];

  const updateSiswa = `UPDATE siswa SET ${setClauses} WHERE nisn = ?`;

  try {
    const [query] = await db.query(updateSiswa, values);
    if (query.changedRows === 0) {
      throw new ResponseError(404, "No provided data to update");
    } else {
      return {
        message: "Updated successfully",
        updated: Object.keys(newData),
      };
    }
  } catch (e) {
    throw e;
  }
};

const deleteSiswa = async (req) => {
  // console.log(req);
  const { error, value: dataSiswa } = petugasValidation.siswa.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const getSiswa = `SELECT * FROM siswa WHERE nisn = ?`;
  const [isSiswa] = await db.query(getSiswa, dataSiswa.nisn);

  // Hentikan eksekusi tidak ada data
  if (isSiswa.length === 0) {
    throw new ResponseError(
      404,
      `There is no siswa with nisn: ${dataSiswa.nisn}`
    );
  }

  const deleteSiswa = "DELETE FROM siswa WHERE nisn = ?";
  try {
    await db.query(deleteSiswa, dataSiswa.nisn);
  } catch (e) {
    throw e;
  }

  return { message: "Siswa Deleted" };
};

const getSiswa = async () => {
  //joi validation

  const selectuser =
    "SELECT siswa.nisn, siswa.nis, siswa.nama, siswa.id_kelas, siswa.alamat, siswa.no_telp, siswa.id_spp, kelas.nama_kelas, kelas.kompetensi_keahlian FROM siswa INNER JOIN kelas ON kelas.id_kelas = siswa.id_kelas";
  const [userRows] = await db.query(selectuser);
  // console.log(userRows);

  // Hentikan eksekusi jika nisn atau nis salah
  if (userRows.length == 0) {
    throw new ResponseError(404, "User is not found");
  }

  // console.log("Hasil Mentah dari Database:", userRows);
  //kirim data user jika berhasil login
  return { siswa: userRows };
};

//kelas
const tambahKelas = async (req) => {
  // joi validation
  const { error, value: kelas } = petugasValidation.tambahKelas.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const insertKelas =
    "INSERT INTO kelas (nama_kelas, kompetensi_keahlian) VALUES (?,?)";
  const values = [kelas.nama_kelas, kelas.kompetensi_keahlian];

  try {
    db.query(insertKelas, values);
    return {
      kelas: kelas.nama_kelas,
      kompetensi_keahlian: kelas.kompetensi_keahlian,
    };
  } catch (error) {
    throw e;
  }
};

const getKelas = async () => {
  //joi validation

  const selectKelas = "SELECT * FROM kelas";
  const [kelasRows] = await db.query(selectKelas);
  // console.log(kelasRows);

  // Hentikan eksekusi jika kelas tidak ada
  if (kelasRows.length == 0) {
    throw new ResponseError(404, "kelas is not found");
  }

  // console.log("Hasil Mentah dari Database:", kelasRows);
  //kirim data kelas jika berhasil login
  return { Kelas: kelasRows };
};

const updateKelas = async (kelas) => {
  //joi validation
  const { error, value: dataKelas } = petugasValidation.kelas.validate(kelas);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const selectKelas = "SELECT id_kelas FROM kelas WHERE id_kelas = ?";
  const [kelasRows] = await db.query(selectKelas, dataKelas.id_kelas);

  if (kelasRows.length === 0) {
    throw new ResponseError(400, "There is no kelas with that id");
  }

  const newData = {};
  if (dataKelas.nama_kelas) {
    newData.nama_kelas = dataKelas.nama_kelas;
  }
  if (dataKelas.kompetensi_keahlian) {
    newData.kompetensi_keahlian = dataKelas.kompetensi_keahlian;
  }

  //cek jika tidak ada data yang diupdate
  if (Object.keys(newData).length === 0) {
    return { message: "No new data provided to update." };
  }

  const setClauses = Object.keys(newData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(newData), dataKelas.id_kelas];

  const updateKelas = `UPDATE kelas SET ${setClauses} WHERE id_kelas = ?`;

  try {
    const [query] = await db.query(updateKelas, values);
    if (query.changedRows === 0) {
      throw new ResponseError(404, "No provided data to update");
    } else {
      return {
        message: "Updated successfully",
        updated: Object.keys(newData),
      };
    }
  } catch (e) {
    throw e;
  }
};

const deleteKelas = async (req) => {
  // console.log(req);
  const { error, value: dataKelas } = petugasValidation.kelas.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const getKelas = `SELECT * FROM kelas WHERE id_kelas = ?`;
  const [isKelas] = await db.query(getKelas, dataKelas.id_kelas);

  // Hentikan eksekusi tidak ada data
  if (isKelas.length === 0) {
    throw new ResponseError(
      404,
      `There is no Kelas with id: ${dataKelas.id_kelas}`
    );
  }

  const deleteKelas = "DELETE FROM kelas WHERE id_kelas = ?";
  try {
    await db.query(deleteKelas, dataKelas.id_kelas);
  } catch (e) {
    throw e;
  }

  return { message: "Kelas Deleted" };
};

//logic for spp
const tambahSpp = async (req) => {
  // joi validation
  const { error, value: spp } = petugasValidation.tambahSpp.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const insertSpp = "INSERT INTO spp (tahun, nominal) VALUES (?,?)";
  const values = [spp.tahun, spp.nominal];

  try {
    db.query(insertSpp, values);
    return {
      tahun: spp.tahun,
      nominal: spp.nominal,
    };
  } catch (error) {
    throw e;
  }
};

const getSpp = async () => {
  const selectSpp = "SELECT * FROM spp";
  const [sppRows] = await db.query(selectSpp);

  if (sppRows.length == 0) {
    throw new ResponseError(404, "SPP data is not found");
  }

  return { spp: sppRows };
};

const updateSpp = async (req) => {
  const { error, value: spp } = petugasValidation.spp.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const selectSpp = "SELECT id_spp FROM spp WHERE id_spp = ?";
  const [sppRows] = await db.query(selectSpp, spp.id_spp);

  if (sppRows.length === 0) {
    throw new ResponseError(400, "There is no SPP with that ID");
  }

  const newData = {};
  if (spp.tahun) {
    newData.tahun = spp.tahun;
  }
  if (spp.nominal) {
    newData.nominal = spp.nominal;
  }

  if (Object.keys(newData).length === 0) {
    return { message: "No new data provided to update." };
  }

  const setClauses = Object.keys(newData)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(newData), spp.id_spp];

  const updateSpp = `UPDATE spp SET ${setClauses} WHERE id_spp = ?`;

  try {
    const [query] = await db.query(updateSpp, values);
    if (query.changedRows === 0) {
      throw new ResponseError(404, "No provided data to update");
    } else {
      return {
        message: "Updated successfully",
        updated: Object.keys(newData),
      };
    }
  } catch (e) {
    throw e;
  }
};

const deleteSpp = async (req) => {
  const { error, value: spp } = petugasValidation.spp.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const getSpp = `SELECT * FROM spp WHERE id_spp = ?`;
  const [isSpp] = await db.query(getSpp, spp.id_spp);

  if (isSpp.length === 0) {
    throw new ResponseError(404, `There is no SPP with id: ${spp.id_spp}`);
  }

  const deleteSpp = "DELETE FROM spp WHERE id_spp = ?";
  try {
    await db.query(deleteSpp, spp.id_spp);
  } catch (e) {
    throw e;
  }

  return { message: "SPP Deleted" };
};

//logic for pembayaran
const tambahPembayaran = async (req) => {
  const { error, value: pembayaran } =
    petugasValidation.tambahPembayaran.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }
  const insertPembayaran =
    "INSERT INTO pembayaran (id_petugas, id_spp, nisn, tgl_bayar, jumlah_bayar) VALUES (?,?,?,?,?)";
  const values = [
    pembayaran.id_petugas,
    pembayaran.id_spp,
    pembayaran.nisn,
    pembayaran.tgl_bayar,
    pembayaran.jumlah_bayar,
  ];

  try {
    await db.query(insertPembayaran, values);
    return {
      message: "Pembayaran added successfully",
      data: pembayaran,
    };
  } catch (e) {
    throw e;
  }
};

const deletePembayaran = async (req) => {
  const { error, value: pembayaran } =
    petugasValidation.pembayaran.validate(req);
  if (error) {
    throw new ResponseError(400, error.message);
  }

  const getPembayaran = `SELECT * FROM pembayaran WHERE id_pembayaran = ?`;
  const [isPembayaran] = await db.query(
    getPembayaran,
    pembayaran.id_pembayaran
  );

  if (isPembayaran.length === 0) {
    throw new ResponseError(
      404,
      `There is no Pembayaran with id: ${pembayaran.id_pembayaran}`
    );
  }

  const deletePembayaran = "DELETE FROM pembayaran WHERE id_pembayaran = ?";
  try {
    await db.query(deletePembayaran, pembayaran.id_pembayaran);
  } catch (e) {
    throw e;
  }

  return { message: "Pembayaran Deleted" };
};

const getPembayaran = async () => {
  const selectPembayaran = `
    SELECT s.nisn, s.nama, s.no_telp, p.tgl_bayar, p.jumlah_bayar, spp.nominal, spp.tahun, pt.nama_petugas FROM pembayaran p INNER JOIN siswa s ON p.nisn = s.nisn INNER JOIN spp ON p.id_spp = spp.id_spp INNER JOIN petugas pt ON p.id_petugas = pt.id_petugas`;

  const [pembayaranRows] = await db.query(selectPembayaran);

  if (pembayaranRows.length === 0) {
    throw new ResponseError(404, "Pembayaran not found");
  }

  return {
    message: "Pembayaran data retrieved successfully",
    data: pembayaranRows,
  };
};

module.exports = {
  petugasLogin,
  getPetugas,
  petugasRegister,
  updatePetugas,
  deletePetugas,
  petugasLogout,
  updateSiswa,
  deleteSiswa,
  getSiswa,
  getKelas,
  updateKelas,
  deleteKelas,
  tambahKelas,
  tambahSpp,
  getSpp,
  updateSpp,
  deleteSpp,
  tambahPembayaran,
  deletePembayaran,
  getPembayaran,
};
