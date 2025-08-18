const express = require("express");
const web = express();
const { route } = require("../router/public");
const { errorMidleware } = require("../middleware/error");
web.use(express.json());

module.exports = { web };

web.use(route);
web.use(errorMidleware);
