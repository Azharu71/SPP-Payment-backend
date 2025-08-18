const express = require("express");
const user = require("../handler/user");
const authMiddleware = require("../middleware/auth-middleware");
const route = express.Router();

//hanya yang mempunyai token yang dapat mengakses

route.use(authMiddleware);

//route siswa
route.get("/api/users/current", user.getUser);
route.delete("/api/users/logout", user.logout);

//route petugas

//route admin
module.exports = { route };
