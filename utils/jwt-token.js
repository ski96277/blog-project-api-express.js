const jwt = require("jsonwebtoken");
const { ApiError } = require("../middleware/ErrorHandler");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const createJwtToken = (id, email, role) =>
  jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const decodeToken = (token) => {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    return decode;
  } catch (e) {
    throw new ApiError("Unable to decode Token ", 401);
  }
};

module.exports = { createJwtToken,decodeToken };
