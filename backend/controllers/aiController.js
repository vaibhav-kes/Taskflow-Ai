const Task = require('../models/Task');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { generateTaskSummary, generateProjectInsights } = require('../services/aiService');

/**
 * @desc    Get AI summary of all user's tasks
 * @route   GET /api/ai/task-summary
 * @access  Private
 */
const getTaskSummary = asyncHandler(async (req, res) => {
  // Get user's projects
  const projectQuery = req.user.role === 'admin'
    ? {}
    : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };

  const userProjects = await Project.find(projectQuery).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const taskQuery = req.user.role === 'admin' ? {} : { projectId: { $in: projectIds } };

  const tasks = await Task.find(taskQuery)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title')
    .sort({ priority: -1, dueDate: 1 })
    .limit(50); // Limit for AI context window

  if (tasks.length === 0) {
    return successResponse(res, { summary: 'No tasks found to summarize.' }, 'No tasks available');
  }

  const summary = await generateTaskSummary(tasks);

  successResponse(res, { summary, taskCount: tasks.length }, 'AI task summary generated');
});

/**
 * @desc    Get AI insights for a specific project
 * @route   GET /api/ai/project-insights/:projectId
 * @access  Private
 */
const getProjectInsights = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate('teamMembers', 'name email');

  if (!project) throw new ApiError('Project not found', 404);

  // Check access
  const isTeamMember = project.createdBy.equals(req.user._id) ||
    project.teamMembers.some((m) => m._id.equals(req.user._id));
  if (!isTeamMember && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to view this project', 403);
  }

  const tasks = await Task.find({ projectId: project._id })
    .populate('assignedTo', 'name email');

  const insights = await generateProjectInsights(project, tasks);

  successResponse(res, { insights, projectTitle: project.title }, 'AI project insights generated');
});

module.exports = { getTaskSummary, getProjectInsights };
