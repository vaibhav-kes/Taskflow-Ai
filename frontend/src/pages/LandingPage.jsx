import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineSparkles, HiArrowRight } from 'react-icons/hi';

const features = [
  { icon: HiOutlineClipboardList, title: 'Smart Task Management', desc: 'Create, assign, and track tasks with Kanban boards, priorities, and deadlines.' },
  { icon: HiOutlineUserGroup, title: 'Team Collaboration', desc: 'Manage teams, assign roles, and collaborate seamlessly on projects.' },
  { icon: HiOutlineChartBar, title: 'Analytics Dashboard', desc: 'Real-time insights into productivity, progress, and project health.' },
  { icon: HiOutlineSparkles, title: 'AI-Powered Insights', desc: 'Get intelligent summaries and recommendations powered by AI.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-black text-xs">TF</span>
            </div>
            <span className="font-bold text-lg">TaskFlow <span className="text-primary-400">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-lg shadow-primary-500/25">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold mb-8">
              <HiOutlineSparkles className="w-4 h-4" /> Powered by AI
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-surface-200 to-surface-400 bg-clip-text text-transparent">
              Manage Projects.<br />Deliver Results.
            </h1>
            <p className="text-lg lg:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              TaskFlow AI is the modern project management platform that helps teams organize work, track progress, and collaborate — all enhanced with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="group flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-2xl font-semibold text-base shadow-2xl shadow-primary-500/30 transition-all">
                Start for Free <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 border border-white/10 hover:border-white/20 rounded-2xl font-semibold text-base text-surface-300 hover:text-white transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything you need to ship faster</h2>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">Powerful features designed for modern teams.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-white/5 hover:border-primary-500/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-surface-500">
        © {new Date().getFullYear()} TaskFlow AI. All rights reserved.
      </footer>
    </div>
  );
}
