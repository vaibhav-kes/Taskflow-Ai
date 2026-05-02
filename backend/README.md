# TaskFlow AI — Backend API

Production-ready REST API for **TaskFlow AI**, a project and task management SaaS platform built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication** — JWT-based auth with access + refresh tokens, password hashing (bcrypt), httpOnly cookies
- **Role-Based Access Control** — Admin and Member roles with middleware enforcement
- **Project Management** — Full CRUD with team member management
- **Task Management** — Full CRUD with comments, assignment, priority, and status tracking
- **Dashboard Analytics** — Task stats, user productivity, project progress
- **File Uploads** — Cloudinary integration for avatar uploads (optional)
- **Email Notifications** — Nodemailer for welcome emails and task assignments (optional)
- **Activity Logging** — Track user actions across the platform
- **API Documentation** — Swagger UI at `/api/docs`
- **Security** — Helmet, CORS, rate limiting, input validation, MongoDB injection prevention

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, express-rate-limit, CORS |

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

### Configuration

Edit the `.env` file with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

### Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Private | Logout |
| GET | `/api/auth/profile` | Private | Get profile |
| POST | `/api/auth/refresh-token` | Public | Refresh access token |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Private | Get user's projects |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Private | Get project by ID |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add team member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove team member |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Private | Get tasks (filtered) |
| POST | `/api/tasks` | Private | Create task |
| GET | `/api/tasks/:id` | Private | Get task by ID |
| PUT | `/api/tasks/:id` | Private | Update task |
| DELETE | `/api/tasks/:id` | Private | Delete task |
| POST | `/api/tasks/:id/comments` | Private | Add comment |
| GET | `/api/tasks/project/:projectId` | Private | Get project tasks |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/stats` | Private | Dashboard statistics |
| GET | `/api/dashboard/productivity` | Private | User productivity |
| GET | `/api/dashboard/project-analytics` | Private | Project analytics |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| PUT | `/api/users/profile` | Private | Update profile |
| PUT | `/api/users/change-password` | Private | Change password |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger API docs |

## Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── cloudinary.js       # Cloudinary config
│   └── swagger.js          # Swagger/OpenAPI config
├── controllers/
│   ├── authController.js   # Auth logic
│   ├── projectController.js
│   ├── taskController.js
│   ├── dashboardController.js
│   └── userController.js
├── middleware/
│   ├── asyncHandler.js     # Async error wrapper
│   ├── auth.js             # JWT verification & RBAC
│   ├── errorHandler.js     # Global error handler
│   ├── rateLimiter.js      # Rate limiting
│   └── upload.js           # Multer file upload
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   └── ActivityLog.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── dashboardRoutes.js
│   └── userRoutes.js
├── services/
│   ├── emailService.js     # Nodemailer
│   ├── cloudinaryService.js
│   └── activityService.js
├── utils/
│   ├── ApiError.js         # Custom error class
│   ├── apiResponse.js      # Response helpers
│   └── generateToken.js    # JWT generation
├── validators/
│   ├── authValidator.js
│   ├── projectValidator.js
│   └── taskValidator.js
├── uploads/                # Local upload directory
├── server.js               # Entry point
├── .env.example
├── .gitignore
└── package.json
```

## Deployment (Railway)

1. Push your code to GitHub
2. Connect the repository to [Railway](https://railway.app)
3. Set environment variables in Railway dashboard
4. Railway will auto-detect the `start` script and deploy

Required environment variables for Railway:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CLIENT_URL` (your frontend URL)

## License

ISC
