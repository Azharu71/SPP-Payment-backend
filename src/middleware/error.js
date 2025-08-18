const { ResponseError } = require("../handler/error-handler");

const errorMidleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  if (err instanceof ResponseError) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res
      .status(500)
      .json({
        message: err.message,
      })
      .end();
  }
};
module.exports = { errorMidleware };
