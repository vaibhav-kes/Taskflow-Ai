const { body } = require('express-validator');

/**
 * Validation rules for creating a project
 */
const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('deadline')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .toDate(),

  body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'on-hold'])
    .withMessage('Status must be one of: planning, active, completed, on-hold'),

  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),

  body('teamMembers.*')
    .optional()
    .isMongoId()
    .withMessage('Each team member must be a valid user ID'),
];

/**
 * Validation rules for updating a project
 */
const updateProjectValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('deadline')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Deadline must be a valid date')
    .toDate(),

  body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'on-hold'])
    .withMessage('Status must be one of: planning, active, completed, on-hold'),
];

module.exports = { createProjectValidator, updateProjectValidator };
