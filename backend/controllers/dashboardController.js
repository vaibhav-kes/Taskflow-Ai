const Task = require('../models/Task');
const Project = require('../models/Project');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get user's projects
  const projectQuery = req.user.role === 'admin'
    ? {}
    : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };

  const userProjects = await Project.find(projectQuery).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const taskQuery = req.user.role === 'admin' ? {} : { projectId: { $in: projectIds } };

  const [totalTasks, completedTasks, pendingTasks, overdueTasks, totalProjects] =
    await Promise.all([
      Task.countDocuments(taskQuery),
      Task.countDocuments({ ...taskQuery, status: 'completed' }),
      Task.countDocuments({ ...taskQuery, status: { $in: ['todo', 'in-progress'] } }),
      Task.countDocuments({
        ...taskQuery,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      }),
      Project.countDocuments(projectQuery),
    ]);

  const statusBreakdown = await Task.aggregate([
    { $match: taskQuery },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const priorityBreakdown = await Task.aggregate([
    { $match: taskQuery },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  successResponse(res, {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    totalProjects,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    statusBreakdown,
    priorityBreakdown,
  }, 'Dashboard stats retrieved successfully');
});

/**
 * @desc    Get user productivity metrics
 * @route   GET /api/dashboard/productivity
 * @access  Private
 */
const getUserProductivity = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Tasks completed per user (last 30 days)
  const productivity = await Task.aggregate([
    {
      $match: {
        status: 'completed',
        updatedAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: '$assignedTo',
        completedTasks: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        avatar: '$user.avatar',
        completedTasks: 1,
      },
    },
    { $sort: { completedTasks: -1 } },
  ]);

  // Daily completion trend (last 30 days)
  const dailyTrend = await Task.aggregate([
    {
      $match: {
        status: 'completed',
        updatedAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  successResponse(res, { productivity, dailyTrend }, 'Productivity data retrieved');
});

/**
 * @desc    Get per-project analytics
 * @route   GET /api/dashboard/project-analytics
 * @access  Private
 */
const getProjectAnalytics = asyncHandler(async (req, res) => {
  const projectQuery = req.user.role === 'admin'
    ? {}
    : { $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }] };

  const projects = await Project.find(projectQuery)
    .populate('createdBy', 'name email')
    .lean();

  const analytics = await Promise.all(
    projects.map(async (project) => {
      const [total, completed, inProgress, todo, overdue] = await Promise.all([
        Task.countDocuments({ projectId: project._id }),
        Task.countDocuments({ projectId: project._id, status: 'completed' }),
        Task.countDocuments({ projectId: project._id, status: 'in-progress' }),
        Task.countDocuments({ projectId: project._id, status: 'todo' }),
        Task.countDocuments({
          projectId: project._id,
          status: { $ne: 'completed' },
          dueDate: { $lt: new Date() },
        }),
      ]);

      return {
        projectId: project._id,
        title: project.title,
        status: project.status,
        createdBy: project.createdBy,
        teamSize: project.teamMembers.length,
        deadline: project.deadline,
        tasks: { total, completed, inProgress, todo, overdue },
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  successResponse(res, { analytics }, 'Project analytics retrieved');
});

module.exports = { getDashboardStats, getUserProductivity, getProjectAnalytics };
