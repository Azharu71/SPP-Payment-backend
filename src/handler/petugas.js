const userService = require("../services/user");
const petugasService = require("../services/petugas");

const login = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Login request body is invalid",
      });
    }
    if (req.body.nisn) {
      const result = await userService.userLogin(req.body);
      res.status(200).json({
        message: "Login Success",
        data: result,
      });
      console.log(req.body);
    } else if (req.body.username) {
      const result = await petugasService.petugasLogin(req.body);
      res.status(200).json({
        message: "Login Success",
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
