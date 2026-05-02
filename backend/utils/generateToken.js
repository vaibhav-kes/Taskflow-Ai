const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

/**
 * Generate a long-lived refresh token
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
