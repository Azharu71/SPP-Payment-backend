const express = require("express");
const Ping = require("../test/ping");
const user = require("../handler/user");
const auth = require("../handler/petugas");
const route = express.Router();

//semuanya bisa mengakses
route.post("/api/login", auth.login);
route.post("/api/register", user.register);
route.get("/ping", Ping.ping);

module.exports = { route };
