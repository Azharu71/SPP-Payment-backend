const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const tryConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.info("Successfully connected to the database.");
    db.releaseConnection();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

tryConnection();
// const connection = db.getConnection();
// if (connection) {
//   console.info("Successfully connected to the database.");
//   db.releaseConnection(connection);
// } else {
//   console.info("Failed to connect to the database:", error);
//   process.exit(1);
// }
// try {
//   const connection = db.getConnection();
//   console.info("Successfully connected to the database.");
//   db.releaseConnection(connection);
// } catch (error) {
//   console.info("Failed to connect to the database:", error);
//   process.exit(1);
// }

// db.((err) => {
//   if (err) {
//     console.error("Error connecting to the database: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL database as id " + db.threadId);
// });

module.exports = db;
