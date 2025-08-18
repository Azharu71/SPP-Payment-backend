const { ResponseError } = require("../handler/error-handler");

const errorMidleware = async (err, req, res, next) => {
  if (!err) {
    return;
    next();
  }
  if (err instanceof ResponseError) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res
      .status(err.status)
      .json({
        message: err.message,
      })
      .end();
  }
};
module.exports = { errorMidleware };
