const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { logActivity } = require('../services/activityService');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      errors.array().map((e) => e.msg).join('. '),
      400
    );
  }

  const { title, description, deadline, status, teamMembers } = req.body;

  const project = await Project.create({
    title,
    description,
    deadline,
    status,
    teamMembers: teamMembers || [],
    createdBy: req.user._id,
  });

  // Populate the created project
  await project.populate('createdBy', 'name email avatar');
  await project.populate('teamMembers', 'name email avatar');

  // Log activity
  await logActivity(
    req.user._id,
    'created project',
    'project',
    project._id,
    `Created project: ${title}`
  );

  successResponse(res, { project }, 'Project created successfully', 201);
});

/**
 * @desc    Get all projects (user's projects)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query — users see projects they created or are a member of
  const query = {
    $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }],
  };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const [projects, total] = await Promise.all([
    Project.find(query)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Project.countDocuments(query),
  ]);

  successResponse(res, {
    projects,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  }, 'Projects retrieved successfully');
});

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Private (Team members only)
 */
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email avatar')
    .populate('teamMembers', 'name email avatar');

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  // Check if user is a team member or creator
  const isTeamMember =
    project.createdBy._id.equals(req.user._id) ||
    project.teamMembers.some((member) => member._id.equals(req.user._id));

  if (!isTeamMember && req.user.role !== 'admin') {
    throw new ApiError('You are not authorized to view this project', 403);
  }

  successResponse(res, { project }, 'Project retrieved successfully');
});

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin or project creator)
 */
const updateProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      errors.array().map((e) => e.msg).join('. '),
      400
    );
  }

  let project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  // Only admin or project creator can update
  if (!project.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError('You are not authorized to update this project', 403);
  }

  const { title, description, deadline, status } = req.body;

  project = await Project.findByIdAndUpdate(
    req.params.id,
    { title, description, deadline, status },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name email avatar')
    .populate('teamMembers', 'name email avatar');

  // Log activity
  await logActivity(
    req.user._id,
    'updated project',
    'project',
    project._id,
    `Updated project: ${project.title}`
  );

  successResponse(res, { project }, 'Project updated successfully');
});

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin only)
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ projectId: project._id });

  // Delete the project
  await Project.findByIdAndDelete(req.params.id);

  // Log activity
  await logActivity(
    req.user._id,
    'deleted project',
    'project',
    project._id,
    `Deleted project: ${project.title}`
  );

  successResponse(res, null, 'Project and associated tasks deleted successfully');
});

/**
 * @desc    Add a team member to a project
 * @route   POST /api/projects/:id/members
 * @access  Private (Admin only)
 */
const addTeamMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError('User ID is required', 400);
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  // Check if user is already a member
  if (project.teamMembers.some((member) => member.equals(userId))) {
    throw new ApiError('User is already a team member', 400);
  }

  project.teamMembers.push(userId);
  await project.save();

  await project.populate('createdBy', 'name email avatar');
  await project.populate('teamMembers', 'name email avatar');

  // Log activity
  await logActivity(
    req.user._id,
    'added team member',
    'project',
    project._id,
    `Added member to project: ${project.title}`
  );

  successResponse(res, { project }, 'Team member added successfully');
});

/**
 * @desc    Remove a team member from a project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private (Admin only)
 */
const removeTeamMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError('Project not found', 404);
  }

  // Cannot remove the project creator
  if (project.createdBy.equals(userId)) {
    throw new ApiError('Cannot remove the project creator from the team', 400);
  }

  // Check if user is a member
  if (!project.teamMembers.some((member) => member.equals(userId))) {
    throw new ApiError('User is not a team member', 400);
  }

  project.teamMembers = project.teamMembers.filter(
    (member) => !member.equals(userId)
  );
  await project.save();

  await project.populate('createdBy', 'name email avatar');
  await project.populate('teamMembers', 'name email avatar');

  // Log activity
  await logActivity(
    req.user._id,
    'removed team member',
    'project',
    project._id,
    `Removed member from project: ${project.title}`
  );

  successResponse(res, { project }, 'Team member removed successfully');
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
};
