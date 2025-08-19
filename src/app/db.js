const mysql = require("mysql2/promise");
const logger = require("./logger");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  bigNumberStrings: false,
});

const tryConnection = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.info("Successfully connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error.code);
    process.exit(1);
  }
};

tryConnection();

module.exports = db;
