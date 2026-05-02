const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logActivity } = require('../services/activityService');
const { sendTaskAssignmentEmail } = require('../services/emailService');

const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(errors.array().map((e) => e.msg).join('. '), 400);
  }

  const { title, description, projectId, assignedTo, priority, status, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError('Project not found', 404);

  const isTeamMember = project.createdBy.equals(req.user._id) ||
    project.teamMembers.some((m) => m.equals(req.user._id));
  if (!isTeamMember && req.user.role !== 'admin') {
    throw new ApiError('You must be a team member to create tasks in this project', 403);
  }

  if (assignedTo) {
    const isAssigneeTeamMember = project.teamMembers.some((m) => m.equals(assignedTo));
    if (!isAssigneeTeamMember && !project.createdBy.equals(assignedTo)) {
      throw new ApiError('Assignee must be a team member of the project', 400);
    }
  }

  const task = await Task.create({
    title, description, projectId, assignedTo, priority, status, dueDate,
    createdBy: req.user._id,
  });

  await task.populate('assignedTo', 'name email avatar');
  await task.populate('createdBy', 'name email avatar');
  await task.populate('projectId', 'title');

  await logActivity(req.user._id, 'created task', 'task', task._id, `Created task: ${title}`);

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (assignee) sendTaskAssignmentEmail(assignee.email, assignee.name, task);
  }

  successResponse(res, { task }, 'Task created successfully', 201);
});

const getTasks = asyncHandler(async (req, res) => {
  const { projectId, status, priority, assignedTo, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  if (req.user.role !== 'admin') {
    const userProjects = await Project.find({
      $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }],
    }).select('_id');
    query.projectId = { $in: userProjects.map((p) => p._id) };
  }

  if (projectId) query.projectId = projectId;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) query.title = { $regex: search, $options: 'i' };

  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('projectId', 'title')
      .sort(sortObj).skip(skip).limit(parseInt(limit)),
    Task.countDocuments(query),
  ]);

  successResponse(res, {
    tasks,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  }, 'Tasks retrieved successfully');
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('projectId', 'title')
    .populate('comments.user', 'name email avatar');

  if (!task) throw new ApiError('Task not found', 404);

  const project = await Project.findById(task.projectId);
  if (project) {
    const isTeamMember = project.createdBy.equals(req.user._id) ||
      project.teamMembers.some((m) => m.equals(req.user._id));
    if (!isTeamMember && req.user.role !== 'admin') {
      throw new ApiError('You are not authorized to view this task', 403);
    }
  }

  successResponse(res, { task }, 'Task retrieved successfully');
});

const updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(errors.array().map((e) => e.msg).join('. '), 400);
  }

  let task = await Task.findById(req.params.id);
  if (!task) throw new ApiError('Task not found', 404);

  const isCreator = task.createdBy.equals(req.user._id);
  const isAssignee = task.assignedTo && task.assignedTo.equals(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isCreator && !isAssignee && !isAdmin) {
    throw new ApiError('You are not authorized to update this task', 403);
  }

  // Members (assignees only) can only update status
  if (isAssignee && !isCreator && !isAdmin) {
    const allowedFields = ['status'];
    const invalidFields = Object.keys(req.body).filter((f) => !allowedFields.includes(f));
    if (invalidFields.length > 0) {
      throw new ApiError(`As an assignee, you can only update: ${allowedFields.join(', ')}`, 403);
    }
  }

  const { title, description, assignedTo, priority, status, dueDate } = req.body;

  task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, assignedTo, priority, status, dueDate },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('projectId', 'title');

  await logActivity(req.user._id, 'updated task', 'task', task._id, `Updated task: ${task.title}`);

  successResponse(res, { task }, 'Task updated successfully');
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError('Task not found', 404);

  if (!task.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError('You are not authorized to delete this task', 403);
  }

  await Task.findByIdAndDelete(req.params.id);
  await logActivity(req.user._id, 'deleted task', 'task', task._id, `Deleted task: ${task.title}`);

  successResponse(res, null, 'Task deleted successfully');
});

const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(errors.array().map((e) => e.msg).join('. '), 400);
  }

  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError('Task not found', 404);

  const project = await Project.findById(task.projectId);
  if (project) {
    const isTeamMember = project.createdBy.equals(req.user._id) ||
      project.teamMembers.some((m) => m.equals(req.user._id));
    if (!isTeamMember && req.user.role !== 'admin') {
      throw new ApiError('You must be a team member to comment', 403);
    }
  }

  task.comments.push({ user: req.user._id, text: req.body.text });
  await task.save();

  await task.populate('comments.user', 'name email avatar');
  await task.populate('assignedTo', 'name email avatar');
  await task.populate('createdBy', 'name email avatar');

  await logActivity(req.user._id, 'commented on task', 'task', task._id, `Commented on: ${task.title}`);

  successResponse(res, { task }, 'Comment added successfully');
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError('Project not found', 404);

  const isTeamMember = project.createdBy.equals(req.user._id) ||
    project.teamMembers.some((m) => m.equals(req.user._id));
  if (!isTeamMember && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to view tasks for this project', 403);
  }

  const tasks = await Task.find({ projectId })
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ createdAt: -1 });

  successResponse(res, { tasks, count: tasks.length }, 'Tasks retrieved successfully');
});

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, addComment, getTasksByProject };
