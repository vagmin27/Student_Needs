export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Indicates it's a known error we can send to client

    Error.captureStackTrace(this, this.constructor);
  }
}
