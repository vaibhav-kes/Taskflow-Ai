import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Skeleton } from '../components/ui';
import { dashboardAPI } from '../services/api';

export default function AnalyticsPage() {
  const [productivity, setProductivity] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getProductivity(), dashboardAPI.getProjectAnalytics()])
      .then(([prod, ana]) => { setProductivity(prod.data.data); setAnalytics(ana.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-80" /><Skeleton className="h-80" /></div>;

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Analytics</h1><p className="text-surface-500 mt-1">Performance insights</p></div>

      {/* Daily trend */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Daily Completion Trend</h2>
        {productivity?.dailyTrend?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivity.dailyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        ) : <p className="text-surface-400 text-center py-16">No completion data yet</p>}
      </Card>

      {/* Top performers */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Top Performers</h2>
        {productivity?.productivity?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivity.productivity}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={11} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} /><Bar dataKey="completedTasks" fill="#22c55e" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        ) : <p className="text-surface-400 text-center py-16">No productivity data yet</p>}
      </Card>

      {/* Project progress */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Project Progress</h2>
        <div className="space-y-4">
          {analytics?.analytics?.length > 0 ? analytics.analytics.map((p) => (
            <div key={p.projectId} className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold text-surface-900 dark:text-white">{p.title}</span><span className="text-sm font-bold text-primary-600">{p.progress}%</span></div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-surface-400"><span>✅ {p.tasks.completed}</span><span>🔄 {p.tasks.inProgress}</span><span>📋 {p.tasks.todo}</span><span className="text-red-400">⚠️ {p.tasks.overdue}</span></div>
            </div>
          )) : <p className="text-surface-400 text-center py-8">No project data yet</p>}
        </div>
      </Card>
    </div>
  );
}
