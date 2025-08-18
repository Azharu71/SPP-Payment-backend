const express = require("express");
const web = express();
const { route: publicRoute } = require("../router/public");
const { route: apiRoute } = require("../router/api");
const { errorMidleware } = require("../middleware/error");

web.use(express.json());

web.use(publicRoute);
web.use(apiRoute);
web.use(errorMidleware);

//default route jika tidak ada
web.use("", (req, res) => {
  res.status(404).send("Nothing here");
});
module.exports = { web };
