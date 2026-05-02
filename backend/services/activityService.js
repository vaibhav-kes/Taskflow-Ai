const ActivityLog = require('../models/ActivityLog');

/**
 * Log an activity event
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g., 'created project')
 * @param {string} entityType - Type of entity ('project', 'task', 'user')
 * @param {string} entityId - ID of the entity
 * @param {string} details - Additional details about the action
 */
const logActivity = async (userId, action, entityType, entityId, details = '') => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    // Log errors but don't throw — activity logging shouldn't break main flow
    console.error('❌ Activity logging failed:', error.message);
  }
};

/**
 * Get recent activity logs for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of logs to return (default: 20)
 * @returns {Promise<Array>}
 */
const getUserActivity = async (userId, limit = 20) => {
  return ActivityLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email avatar');
};

/**
 * Get recent activity logs for a specific entity
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} limit - Number of logs to return (default: 20)
 * @returns {Promise<Array>}
 */
const getEntityActivity = async (entityType, entityId, limit = 20) => {
  return ActivityLog.find({ entityType, entityId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email avatar');
};

module.exports = { logActivity, getUserActivity, getEntityActivity };
