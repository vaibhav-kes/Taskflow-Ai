const express = require('express');
const router = express.Router();
const { getDashboardStats, getUserProductivity, getProjectAnalytics } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 */
router.get('/stats', verifyToken, getDashboardStats);

/**
 * @swagger
 * /dashboard/productivity:
 *   get:
 *     summary: Get user productivity metrics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Productivity data retrieved
 */
router.get('/productivity', verifyToken, getUserProductivity);

/**
 * @swagger
 * /dashboard/project-analytics:
 *   get:
 *     summary: Get per-project analytics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Project analytics retrieved
 */
router.get('/project-analytics', verifyToken, getProjectAnalytics);

module.exports = router;
