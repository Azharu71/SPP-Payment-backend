const express = require("express");
const Ping = require("../handler/ping");
const user = require("../handler/user");
const route = express.Router();

// route.get("/login",);

route.post("/api/users", user.register);
route.get("/ping", Ping.ping);
route.use("", (req, res, next) => {
  res.send("Nothing here");
  next();
});

module.exports = { route };
