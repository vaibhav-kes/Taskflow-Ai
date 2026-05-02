const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Verify JWT token from Authorization header or cookies
 * Attaches the authenticated user to req.user
 */
const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback to cookies
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError('Not authorized, no token provided', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError('User not found with this token', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired', 401);
    }
    throw error;
  }
});

/**
 * Restrict access to admin users only
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw new ApiError('Access denied. Admin privileges required.', 403);
};

/**
 * Restrict access to members only (or admin)
 */
const isMember = (req, res, next) => {
  if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) {
    return next();
  }
  throw new ApiError('Access denied. Membership required.', 403);
};

module.exports = { verifyToken, isAdmin, isMember };
