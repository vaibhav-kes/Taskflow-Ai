import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineClipboardList, HiOutlineUsers, HiOutlineChartBar, HiOutlineCog, HiOutlineLogout, HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi';
import { logout } from '../redux/authSlice';

const navItems = [
  { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
  { to: '/projects', icon: HiOutlineFolder, label: 'Projects' },
  { to: '/tasks', icon: HiOutlineClipboardList, label: 'Tasks' },
  { to: '/team', icon: HiOutlineUsers, label: 'Team' },
  { to: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { to: '/ai-insights', icon: HiOutlineSparkles, label: 'AI Insights' },
];

const bottomItems = [
  { to: '/profile', icon: HiOutlineUser, label: 'Profile' },
  { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
    }`;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <motion.aside
        initial={false}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-200 dark:border-surface-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-black text-sm">TF</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-surface-900 dark:text-white">TaskFlow</h1>
            <p className="text-[10px] font-semibold text-primary-500 tracking-wider uppercase">AI</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 mb-2 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Menu</p>
          {navItems.map((item) => {
            if (item.to === '/team' && user?.role !== 'admin') return null;
            return (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-surface-200 dark:border-surface-800 space-y-1">
          {bottomItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all">
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
