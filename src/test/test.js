//file untuk test
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const payload = {
  nisn: 321,
  nama: "Harurun",
  level: "siswa",
};

const token = jwt.sign(payload, "rahasianyadirahasiakan", { expiresIn: "1h" });

bcrypt.hash("admin", 10, (err, hash) => {
  console.log(hash);
});

bcrypt.compare(
  "admin",
  "$2b$10$4SXRaqT4lEIGa7lioYU19eY6P38MR77nECmgs9RqH7I5YjqhiQzSK",
  (err, match) => {
    console.log(match);
  }
);
