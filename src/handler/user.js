const userService = require("../services/user");

const register = async (req, res, next) => {
  try {
    const result = await userService.userRegister(req.body);
    res.status(200).json({
      message: "User Created successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const result = await userService.userLogin(req.body);
    res.status(200).json({
      message: "Login Success",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const result = await userService.userGet(req.user.nisn);
    res.status(200).json({
      message: "User data retrieved",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
module.exports = { register, login, getUser };
