// Centralized Error Handling Middleware
// Safely handles operational AppErrors and preserves compatibility with legacy controllers
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // If headers are already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle known operational errors (from AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle generic / programming errors
  console.error("ERROR 💥", err);
  
  // Return generic error structure compatible with previous frontend expectations
  return res.status(err.statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
