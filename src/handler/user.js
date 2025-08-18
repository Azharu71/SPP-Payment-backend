const userServicer = require("../services/user");
const { ResponseError } = require("./error-handler");

const register = async (req, res, next) => {
  try {
    const result = await userServicer.userRegister(req.body);
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { register };
