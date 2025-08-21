// src/middleware/authorize-middleware.js

const authorize = (allowedLevels) => {
  return (req, res, next) => {
    // Pastikan authMiddleware sudah berjalan sebelumnya
    
    const userLevel = req.user ? req.user.level : null;
    // console.log(allowedLevels);
    // console.log(userLevel);

    if (userLevel && allowedLevels.includes(userLevel)) {
      next(); // Izinkan akses jika level pengguna ada di dalam daftar yang diizinkan
    } else {
      res
        .status(403)
        .json({
          message: "Forbidden: You do not have the required access level",
        })
        .end();
    }
  };
};

module.exports = authorize;
