
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      throw createError.Unauthorized("Token is not present");
    } else {
      const isVerify = await jwt.verify(token, "secret_key_2024");
      req.user = isVerify;
      next();
    }
  } catch (error) {
    next(error);
  }
};
