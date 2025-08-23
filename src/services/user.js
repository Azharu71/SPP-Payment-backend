const db = require("../app/db");
const { ResponseError } = require("../handler/error-handler");
const {
  userValidation,
  loginValidation,
  getPembayaran,
} = require("../validation/user");
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

  //kirim token yang berlaku 1 jam jika berhasil login
  const userPayload = nisnRows[0];
  const payload = {
    nisn: userPayload.nisn,
    nama: userPayload.nama,
    level: "siswa",
  };
  console.log(payload);
  
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });

  return {
    token: token,
    message: `Halo ${userPayload.nama}`,
  };
};

const userGet = async (nisn) => {
  //joi validation

  const selectuser =
    "SELECT siswa.nisn, siswa.nis, siswa.nama, siswa.id_kelas, siswa.alamat, siswa.no_telp, siswa.id_spp, kelas.nama_kelas, kelas.kompetensi_keahlian FROM siswa INNER JOIN kelas ON kelas.id_kelas = siswa.id_kelas WHERE siswa.nisn = ? ";
  const [userRows] = await db.query(selectuser, [nisn]);

  // Hentikan eksekusi jika nisn atau nis salah
  if (userRows.length == 0) {
    throw new ResponseError(404, "User is not found");
  }

  // console.log("Hasil Mentah dari Database:", userRows);
  //kirim data user jika berhasil login
  return userRows[0];
};

const userPembayaran = async (req) => {
  //joi validation
  const isValid= loginValidation.validate(req);
  if (!isValid) {
    throw new ResponseError(400, error.message);
  }
  // console.log(req);
  
  //query sql
  const selectUser = `SELECT s.nisn, s.nama, s.no_telp, p.tgl_bayar, p.jumlah_bayar, spp.nominal, spp.tahun, pt.nama_petugas FROM pembayaran p INNER JOIN siswa s ON p.nisn = s.nisn INNER JOIN spp ON p.id_spp = spp.id_spp INNER JOIN petugas pt ON p.id_petugas = pt.id_petugas WHERE s.nisn = ? ORDER BY p.tgl_bayar ASC `;

  const [userRows] = await db.query(selectUser, req);
  // console.log(userRows);

  // Hentikan eksekusi jika nisn atau nis salah
  if (userRows.length == 0) {
    throw new ResponseError(404, "User Payment not found");
  }
  // // s.nisn, s.nama, s.no_telp, p.tgl_bayar, p.jumlah_bayar, spp.nominal, spp.tahun

  let semuaHistori = {};
  userRows.forEach((data) => {
    const tahun = data.tahun;
    if (!semuaHistori[tahun]) {
      semuaHistori[tahun] = {
        tahun_spp: tahun,
        nominal_spp: data.nominal,

        total: 0,
        pembayaran: [],
      };
    }
    semuaHistori[tahun].pembayaran.push({
      tanggal_bayar: data.tgl_bayar,
      jumlah_bayar: data.jumlah_bayar,
      petugas: data.nama_petugas,
    });

    //Perhitungan status bayar
    semuaHistori[tahun].total += data.jumlah_bayar;
  });
  // console.log(semuaHistori);

  const historiBayar = Object.values(semuaHistori).map((sppTahun) => {
    const kurang = sppTahun.nominal_spp - sppTahun.total;
    // console.log(kurang);

    return {
      status_bayar: kurang <= 0 ? "Lunas" : "Belum Lunas",
      kurang: kurang <= 0 ? 0 : kurang,
      tahun_spp: sppTahun.tahun_spp,
      petugas: sppTahun.petugas,
      nominal_spp: sppTahun.nominal_spp,
      pembayaran: sppTahun.pembayaran,
    };
  });

  // //cleanup data

  const dataPembayaran = {
    nisn: userRows[0].nisn,
    nama: userRows[0].nama,
    telepon: userRows[0].no_telp,
    histori_bayar: historiBayar,
  };
  // console.log(dataPembayaran);

  // //kirim data user jika berhasil login
  return dataPembayaran;
};

const userLogout = async (nisn) => {
  const selectuser = "SELECT * FROM siswa WHERE nisn = ? ";
  const [userRows] = await db.query(selectuser, [nisn]);
  if (userRows.length == 0) {
    throw new ResponseError(404, "User is not found");
  }

  return {
    message: "uhh oke",
  };
};
module.exports = {
  userRegister,
  userLogin,
  userGet,
  userLogout,
  userPembayaran,
};
