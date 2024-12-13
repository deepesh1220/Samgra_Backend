class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.success = false; 
    this.statusCode = statusCode;
    this.message = message || "An error occurred"; 
    Error.captureStackTrace(this, this.constructor);
  }

  // Method to send the error response in a consistent format
  sendErrorResponse(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
    });
  }
}

module.exports = CustomError;
