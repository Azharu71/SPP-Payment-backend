//file dasar/ root program ini

const log = require("./app/logger");
const db = require("./app/db");
const { web } = require("./app/web");

require("dotenv").config();

web.use(log);
const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
  console.info(`Server running on port http://localhost:${PORT}`);
});
