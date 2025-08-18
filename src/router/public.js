const express = require("express");
const Ping = require("../handler/ping");
const user = require("../handler/user");
const route = express.Router();

//semuanya bisa mengakses
route.post("/api/users/login", user.login);
route.post("/api/users", user.register);
route.get("/ping", Ping.ping);

module.exports = { route };
