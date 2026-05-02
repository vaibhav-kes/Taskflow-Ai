const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow AI API',
      version: '1.0.0',
      description:
        'Production-ready REST API for TaskFlow AI — a project and task management SaaS platform.',
      contact: {
        name: 'TaskFlow AI Support',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Base URL',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'member'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            createdBy: { type: 'string' },
            teamMembers: { type: 'array', items: { type: 'string' } },
            deadline: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['planning', 'active', 'completed', 'on-hold'],
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            assignedTo: { type: 'string' },
            createdBy: { type: 'string' },
            projectId: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'completed'],
            },
            dueDate: { type: 'string', format: 'date-time' },
            comments: { type: 'array' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
