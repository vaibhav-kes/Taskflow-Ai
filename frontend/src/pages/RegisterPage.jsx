import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { registerUser, clearError } from '../redux/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><span className="text-white font-black text-sm">TF</span></div>
            <span className="font-bold text-xl text-white">TaskFlow <span className="text-primary-200">AI</span></span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">Start managing<br />projects smarter</h2>
          <p className="text-primary-200 text-lg max-w-md">Create your free account and unlock AI-powered project management for your team.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
          <p className="text-surface-400 mb-8">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-300">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-400">
            Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
