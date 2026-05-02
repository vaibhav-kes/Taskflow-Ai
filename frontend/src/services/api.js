import axios from 'axios';
import { API_URL } from '../constants';

const API = axios.create({ baseURL: API_URL, withCredentials: true });

// Request interceptor — attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response interceptor — handle token refresh and errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
};

// Project API
export const projectAPI = {
  getAll: (params) => API.get('/projects', { params }),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  addMember: (id, userId) => API.post(`/projects/${id}/members`, { userId }),
  removeMember: (id, userId) => API.delete(`/projects/${id}/members/${userId}`),
};

// Task API
export const taskAPI = {
  getAll: (params) => API.get('/tasks', { params }),
  getById: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
  addComment: (id, text) => API.post(`/tasks/${id}/comments`, { text }),
  getByProject: (projectId) => API.get(`/tasks/project/${projectId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getProductivity: () => API.get('/dashboard/productivity'),
  getProjectAnalytics: () => API.get('/dashboard/project-analytics'),
};

// User API
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
};

// AI API
export const aiAPI = {
  getTaskSummary: () => API.get('/ai/task-summary'),
  getProjectInsights: (projectId) => API.get(`/ai/project-insights/${projectId}`),
};

export default API;
