# TaskFlow AI

TaskFlow AI is a modern, full-stack SaaS project and task management platform. It leverages AI to generate project summaries, provides real-time updates using Redux, and features a beautiful, responsive dark-mode UI. 

This repository is configured to be fully production-ready and easily deployable to Vercel (Frontend) and Railway (Backend).

---

## 🟢 Live Demo & API Links

- **Live Application (Frontend)**: [https://frontend-alpha-eight-23.vercel.app](https://frontend-alpha-eight-23.vercel.app)
- **Production API (Backend)**: [https://taskflow-ai-production-0110.up.railway.app](https://taskflow-ai-production-0110.up.railway.app)

---

## 🌟 Features

- **Project Management**: Create, edit, and organize projects.
- **Kanban Task Board**: Manage tasks dynamically with status progression (To Do, In Progress, Completed).
- **AI Task Summaries**: Utilize Groq's Llama 3 API to generate intelligent insights and summaries of your tasks.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `member` roles.
- **Analytics Dashboard**: Interactive charts showing completion rates, productivity, and project health.
- **Dark Mode First UI**: A premium UI inspired by Linear, built with Tailwind CSS v4 and Framer Motion.
- **Secure Authentication**: JWT-based authentication, password hashing, and token persistence.

---

## 🛠️ Tech Stack

**Frontend**:
- React.js 19 + Vite
- Tailwind CSS v4 (Custom UI Components)
- Redux Toolkit (State Management)
- Axios (API Client)
- React Router DOM (Routing)
- Framer Motion (Animations)
- Recharts (Analytics Data Visualization)

**Backend**:
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js
- Groq AI SDK
- Security: Helmet, hpp, express-rate-limit

---

## 🚀 Local Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/taskflow-ai.git
cd taskflow-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🌍 Production Deployment

### 1. MongoDB Atlas Setup
1. Create a cluster on [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Database Access** and create a user with a secure password.
3. Go to **Network Access** and whitelist `0.0.0.0/0` (Allow access from anywhere).
4. Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/taskflow`).

### 2. Backend Deployment (Railway)
1. Push this repository to GitHub.
2. Sign in to [Railway](https://railway.app/).
3. Create a **New Project** -> Deploy from GitHub repo.
4. Select the `/backend` directory.
5. In the **Variables** tab, add:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_super_secret_key
   CLIENT_URL=https://your-vercel-app-url.vercel.app
   GROQ_API_KEY=your_groq_api_key
   ```
6. Railway will automatically detect `package.json` and start the server using `npm start`.

### 3. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New Project** and import your GitHub repository.
3. Set the **Framework Preset** to Vite.
4. Set the **Root Directory** to `frontend`.
5. In **Environment Variables**, add:
   ```env
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
6. Click **Deploy**. Vercel will use the `vercel.json` provided in the codebase to seamlessly handle React Router navigation.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create an account
- `POST /api/auth/login` - Authenticate & get JWT
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - List all accessible projects
- `POST /api/projects` - Create a project (Admin)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task status

### AI Insights
- `GET /api/ai/summary` - Generate AI summary of task

---

## 🔒 Security Measures Implemented
- **Parameter Pollution**: `hpp` prevents array parameter attacks.
- **Rate Limiting**: Brute-force protection on the auth routes.
- **HTTP Headers**: Secured dynamically using `helmet`.
- **CORS configuration**: Strict origin checking enabled for the frontend client URL.
