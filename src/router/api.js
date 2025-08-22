const express = require("express");
const user = require("../handler/user");
const authMiddleware = require("../middleware/auth-middleware");
const route = express.Router();
const authorize = require("../middleware/admin-middleware");
const petugas = require("../handler/petugas");
//hanya yang mempunyai token yang dapat mengakses

//route siswa
route.get("/api/users/current", authMiddleware, user.getUser);
route.get("/api/users/current/pembayaran", authMiddleware, user.getPembayaran);
route.delete("/api/users/logout", authMiddleware, user.logout);

//route admin
route.post(
  "/api/admin/register",
  authMiddleware,
  authorize(["admin"]),
  petugas.register
);

route.get(
  "/api/admin/petugas",
  authMiddleware,
  authorize(["admin"]),
  petugas.get
);

route.patch(
  "/api/admin/update",
  authMiddleware,
  authorize(["admin"]),
  petugas.update
);

route.delete(
  "/api/admin/petugas/delete",
  authMiddleware,
  authorize(["admin"]),
  petugas.deletePetugas
);

//dashboard admin
route.get("/api/admin", authMiddleware, authorize(["admin"]), (req, res) => {
  res.status(200).json({
    data: req.body,
  });
});

//dashboard petugas
route.get(
  "/api/petugas",
  authMiddleware,
  authorize(["petugas", "admin"]),
  (req, res) => {
    res.send("Halo petugas");
  }
);

//router petugas dan admin
route.delete(
  "/api/petugas/logout",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.logout
);

route.patch(
  "/api/petugas/siswa/update",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.updateSiswa
);
route.delete(
  "/api/petugas/siswa/delete",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.deleteSiswa
);
route.get(
  "/api/petugas/siswa",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.getSiswa
);

route.post(
  "/api/petugas/kelas/tambah",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.tambahKelas
);
route.get(
  "/api/petugas/kelas",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.getKelas
);
route.patch(
  "/api/petugas/kelas/update",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.updateKelas
);
route.delete(
  "/api/petugas/kelas/delete",
  authMiddleware,
  authorize(["admin", "petugas"]),
  petugas.deleteKelas
);

//router lainnya disini

module.exports = { route };
