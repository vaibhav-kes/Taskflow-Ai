import { useSelector } from 'react-redux';
import { Card, Avatar, Badge } from '../components/ui';
import { formatDate } from '../utils/helpers';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Profile</h1>
      <Card className="p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar name={user?.name} src={user?.avatar} size="lg" className="w-20 h-20 text-2xl mb-4" />
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">{user?.name}</h2>
          <p className="text-surface-500">{user?.email}</p>
          <Badge variant="primary" className="mt-2">{user?.role}</Badge>
        </div>
        <div className="space-y-4 border-t border-surface-200 dark:border-surface-700 pt-6">
          {[['Full Name', user?.name], ['Email', user?.email], ['Role', user?.role], ['Joined', formatDate(user?.createdAt)]].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2">
              <span className="text-sm text-surface-500 dark:text-surface-400">{label}</span>
              <span className="text-sm font-semibold text-surface-900 dark:text-white capitalize">{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
