const { decodeToken } = require("../utils/jwt-token");
const { ApiError } = require("./ErrorHandler");

const isUserAdminOrSuperAdmin = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new ApiError("Unauthorized: No Token provided", 401);
  }
  const token = authHeaders.split(" ")[1];

  const decode = decodeToken(token);
  console.log("decode token role " + decode.role);

  req.userId = decode.id;

  if (decode.role === "admin" || decode.role === "superadmin") {
    next();
  } else {
    throw new ApiError(
      "You are not autorize to access this create blog feature",
      403
    );
  }
};
module.exports = isUserAdminOrSuperAdmin;
