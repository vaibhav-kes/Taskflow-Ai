import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi';
import { Card, Button, Skeleton } from '../components/ui';
import { aiAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function AIInsightsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const { data } = await aiAPI.getTaskSummary();
      setSummary(data.data);
    } catch (err) { toast.error('Failed to generate AI summary'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">AI Insights</h1><p className="text-surface-500 mt-1">AI-powered analysis of your tasks</p></div>

      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
          <HiOutlineSparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Task Summary</h2>
        <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md mx-auto">Get an AI-generated summary and recommendations for all your tasks.</p>
        <Button onClick={fetchSummary} loading={loading} size="lg">
          <HiOutlineSparkles className="w-5 h-5" /> {loading ? 'Analyzing...' : 'Generate Summary'}
        </Button>
      </Card>

      {summary && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-bold text-surface-900 dark:text-white">AI Analysis</h3>
              <span className="text-xs text-surface-400">({summary.taskCount} tasks analyzed)</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-surface-700 dark:text-surface-300 leading-relaxed">{summary.summary}</div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
