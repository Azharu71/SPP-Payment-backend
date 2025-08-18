const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({
        message: "Token not set: Unauthorized",
      })
      .end();
  }
  try {
    const user = jwt.verify(token, process.env.SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Token Invalid: Unauthorized",
      })
      .end();
  }
};

module.exports = authMiddleware;
