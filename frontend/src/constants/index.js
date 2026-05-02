export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TASK_STATUS = { TODO: 'todo', IN_PROGRESS: 'in-progress', COMPLETED: 'completed' };
export const TASK_PRIORITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };
export const PROJECT_STATUS = { PLANNING: 'planning', ACTIVE: 'active', COMPLETED: 'completed', ON_HOLD: 'on-hold' };
export const USER_ROLES = { ADMIN: 'admin', MEMBER: 'member' };

export const STATUS_COLORS = {
  'todo': { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-200', dot: 'bg-slate-400' },
  'in-progress': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
  'completed': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400' },
};

export const PRIORITY_COLORS = {
  'low': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'medium': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  'high': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

export const PROJECT_STATUS_COLORS = {
  'planning': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  'active': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  'completed': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'on-hold': { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-200' },
};
