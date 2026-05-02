import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineFolder, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamation } from 'react-icons/hi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Skeleton } from '../components/ui';
import { dashboardAPI } from '../services/api';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div></div>;

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: HiOutlineFolder, color: 'from-primary-500 to-primary-600' },
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: HiOutlineClipboardList, color: 'from-accent-500 to-accent-600' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: HiOutlineCheckCircle, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: HiOutlineExclamation, color: 'from-red-500 to-red-600' },
  ];

  const statusData = stats?.statusBreakdown?.map(s => ({ name: s._id || 'unknown', value: s.count })) || [];
  const priorityData = stats?.priorityBreakdown?.map(p => ({ name: p._id || 'unknown', value: p.count })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Overview of your workspace</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400">{s.label}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-surface-900 dark:text-white">{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Completion rate */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Completion Rate</h2>
          <span className="text-2xl font-extrabold text-primary-600">{stats?.completionRate || 0}%</span>
        </div>
        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
          <motion.div initial={{ width: 0 }} animate={{ width: `${stats?.completionRate || 0}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500" />
        </div>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Tasks by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-center py-16">No data yet</p>}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Tasks by Priority</h2>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-surface-400 text-center py-16">No data yet</p>}
        </Card>
      </div>
    </div>
  );
}
