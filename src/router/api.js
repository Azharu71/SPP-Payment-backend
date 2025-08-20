const express = require("express");
const user = require("../handler/user");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const route = express.Router();
const authorize = require("../middleware/admin-middleware");
//hanya yang mempunyai token yang dapat mengakses

//route siswa
route.get("/api/users/current", authMiddleware, user.getUser);
route.get("/api/users/current/pembayaran", authMiddleware, user.getPembayaran);
route.delete("/api/users/logout", authMiddleware, user.logout);

//route admin
route.get("/api/admin", authMiddleware, authorize(["admin"]), (req, res) => {
  res.send("Halos");
});
//router lainnya disini

//route petugas
route.get(
  "/api/petugas",
  authMiddleware,
  authorize(["petugas", "admin"]),
  (req, res) => {
    res.send("Halo oetugas");
  }
);
//router lainnya disini

module.exports = { route };
