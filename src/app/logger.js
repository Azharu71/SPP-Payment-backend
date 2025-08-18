const morgan = require("morgan");
const logger = morgan("dev"); // 'dev' format memberikan output berwarna untuk pengembangan

module.exports = logger;
