const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, addTeamMember, removeTeamMember,
} = require('../controllers/projectController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { createProjectValidator, updateProjectValidator } = require('../validators/projectValidator');

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planning, active, completed, on-hold]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get('/', verifyToken, getProjects);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project (Admin only)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       403:
 *         description: Admin access required
 */
router.post('/', verifyToken, isAdmin, createProjectValidator, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', verifyToken, getProjectById);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project (Admin or creator)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put('/:id', verifyToken, isAdmin, updateProjectValidator, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project (Admin only)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete('/:id', verifyToken, isAdmin, deleteProject);

/**
 * @swagger
 * /projects/{id}/members:
 *   post:
 *     summary: Add a team member (Admin only)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team member added
 */
router.post('/:id/members', verifyToken, isAdmin, addTeamMember);

/**
 * @swagger
 * /projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a team member (Admin only)
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team member removed
 */
router.delete('/:id/members/:userId', verifyToken, isAdmin, removeTeamMember);

module.exports = router;
