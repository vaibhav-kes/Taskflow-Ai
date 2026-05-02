const express = require('express');
const router = express.Router();
const { getTaskSummary, getProjectInsights } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /ai/task-summary:
 *   get:
 *     summary: Get AI-generated summary of your tasks
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI task summary generated
 */
router.get('/task-summary', verifyToken, getTaskSummary);

/**
 * @swagger
 * /ai/project-insights/{projectId}:
 *   get:
 *     summary: Get AI-generated insights for a project
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI project insights generated
 */
router.get('/project-insights/:projectId', verifyToken, getProjectInsights);

module.exports = router;
