//file untuk test

const jwt = require("jsonwebtoken");
const payload = {
  nisn: 321,
  nama: "Harurun",
  level: "siswa",
};

const token = jwt.sign(payload, "rahasianyadirahasiakan", { expiresIn: "1h" });
console.log(token);
