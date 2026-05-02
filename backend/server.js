// Ensure Node's crypto module is available globally before any other module
// loads. bcryptjs v3+ and jsonwebtoken rely on globalThis.crypto (Web Crypto
// API). Requiring it here guarantees it is initialised first, regardless of
// the Node.js version or environment quirks.
const crypto = require('crypto');
if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto;
}

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express
const app = express();

// --------------- Security Middleware ---------------
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Param Pollution
app.use(hpp());

// --------------- CORS ---------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --------------- Body Parsing & Compression ---------------
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// --------------- Logging ---------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// --------------- Rate Limiting ---------------
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// --------------- API Routes ---------------
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// --------------- Swagger API Docs ---------------
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TaskFlow AI API Documentation',
}));

// --------------- Health Check ---------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow AI API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// --------------- 404 Handler ---------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --------------- Global Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 TaskFlow AI API Server`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   API Docs    : http://localhost:${PORT}/api/docs`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

startServer();

module.exports = app;
