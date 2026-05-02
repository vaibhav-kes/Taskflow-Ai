import { useState, useEffect } from 'react';
import { Card, Avatar, Badge, Skeleton, EmptyState } from '../components/ui';
import { userAPI } from '../services/api';

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAll().then(({ data }) => setUsers(data.data.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Team Members</h1><p className="text-surface-500 mt-1">{users.length} members</p></div>
      {users.length === 0 ? <EmptyState icon="👥" title="No team members" description="No users found." /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <Card key={u._id} className="p-5 flex items-center gap-4">
              <Avatar name={u.name} src={u.avatar} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-surface-900 dark:text-white truncate">{u.name}</h3>
                <p className="text-xs text-surface-500 truncate">{u.email}</p>
                <Badge variant={u.role === 'admin' ? 'primary' : 'default'} className="mt-1">{u.role}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
