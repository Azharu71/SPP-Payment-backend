//file dasar/ root program ini

// const db = require("./app/db");
const { web } = require("./app/web");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
  console.info(`Server running on port http://localhost:${PORT}`);
});
