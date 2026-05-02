/**
 * Custom API Error class
 * Extends Error with statusCode and isOperational flag
 * for clean error handling in the global error middleware.
 */
class ApiError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
