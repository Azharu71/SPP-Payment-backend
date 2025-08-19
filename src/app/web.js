const express = require("express");
const web = express();
const { route: publicRoute } = require("../router/public");
const { route: apiRoute } = require("../router/api");
const { errorMidleware } = require("../middleware/error");
const logger = require("./logger");

web.use(express.json());
web.use(logger);
web.use(publicRoute);
web.use(apiRoute);

//default route jika tidak ada
web.use("", (req, res) => {
  res.status(404).send("Nothing here");
});
web.use(errorMidleware);
module.exports = { web };
