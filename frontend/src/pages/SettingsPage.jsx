import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { userAPI } from '../services/api';
import { useTheme } from '../hooks/useTheme';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { dark, toggle } = useTheme();
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) { toast.error('Passwords do not match'); return; }
    if (pw.newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    setLoading(true);
    try {
      await userAPI.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed!');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Settings</h1>

      {/* Theme */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-surface-700 dark:text-surface-300">Dark Mode</p><p className="text-xs text-surface-400">Switch between light and dark themes</p></div>
          <button onClick={toggle} className={`relative w-14 h-7 rounded-full transition-colors ${dark ? 'bg-primary-600' : 'bg-surface-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center transition-transform ${dark ? 'translate-x-7' : 'translate-x-0.5'}`}>
              {dark ? <HiOutlineMoon className="w-3.5 h-3.5 text-primary-600" /> : <HiOutlineSun className="w-3.5 h-3.5 text-amber-500" />}
            </div>
          </button>
        </div>
      </Card>

      {/* Password */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input type="password" label="Current Password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
          <Input type="password" label="New Password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
          <Input type="password" label="Confirm New Password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
