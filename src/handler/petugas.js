const userService = require("../services/user");
const petugasService = require("../services/petugas");

const login = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Login request body is invalid",
      });
    }
    if (req.body.nisn) {
      const result = await userService.userLogin(req.body);
      res.status(200).json({
        message: "Login Success",
        data: result,
      });
      // console.log(req.body);
    } else if (req.body.username) {
      const result = await petugasService.petugasLogin(req.body);
      res.status(200).json({
        message: "Login Success",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await petugasService.petugasRegister(req.body);
    res.status(200).json({
      message: "Petugas Created successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await petugasService.updatePetugas(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await petugasService.getPetugas(req.user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deletePetugas = async (req, res, next) => {
  try {
    const result = await petugasService.deletePetugas(req.body, req.user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await petugasService.petugasLogout(req.user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

//modifikasi siswa
const updateSiswa = async (req, res, next) => {
  try {
    const result = await petugasService.updateSiswa(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteSiswa = async (req, res, next) => {
  try {
    const result = await petugasService.deleteSiswa(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getSiswa = async (req, res, next) => {
  try {
    const result = await petugasService.getSiswa();
    // console.log(result);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

//kelas
const tambahKelas = async (req, res, next) => {
  try {
    const result = await petugasService.tambahKelas(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getKelas = async (req, res, next) => {
  try {
    const result = await petugasService.getKelas();
    // console.log(result);

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateKelas = async (req, res, next) => {
  try {
    const result = await petugasService.updateKelas(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteKelas = async (req, res, next) => {
  try {
    const result = await petugasService.deleteKelas(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

//logic for spp
const tambahSpp = async (req, res, next) => {
  try {
    const result = await petugasService.tambahSpp(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getSpp = async (req, res, next) => {
  try {
    const result = await petugasService.getSpp();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateSpp = async (req, res, next) => {
  try {
    const result = await petugasService.updateSpp(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deleteSpp = async (req, res, next) => {
  try {
    const result = await petugasService.deleteSpp(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

// logic for pembayaran
const tambahPembayaran = async (req, res, next) => {
  try {
    const result = await petugasService.tambahPembayaran(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const deletePembayaran = async (req, res, next) => {
  try {
    const result = await petugasService.deletePembayaran(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getPembayaran = async (req, res, next) => {
  try {
    const result = await petugasService.getPembayaran();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  login,
  register,
  update,
  get,
  deletePetugas,
  logout,
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
