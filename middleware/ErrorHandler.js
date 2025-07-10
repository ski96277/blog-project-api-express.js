class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  console.log("[Global Error file] error is = " + err.stack);
  console.log("[Global Error file] error message is = " + err.message);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusSuccess: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }
  //handle mongoose validation errors
  else if (err.name === "ValidationError") {
    return res.status(400).json({
      statusSuccess: false,
      statusCode: 400,
      message: err.message || "Validation error",
    });
  } else {
    return res.status(500).json({
      statusSuccess: false,
      statusCode: 500,
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { ApiError, asyncHandler, globalErrorHandler };
