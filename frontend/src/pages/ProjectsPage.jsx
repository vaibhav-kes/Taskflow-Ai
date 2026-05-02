import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { fetchProjects, createProject, deleteProject } from '../redux/projectSlice';
import { Card, Button, Modal, Input, Textarea, Select, Badge, EmptyState, Skeleton } from '../components/ui';
import { PROJECT_STATUS_COLORS } from '../constants';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'planning' });

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(form));
    if (createProject.fulfilled.match(result)) {
      toast.success('Project created!');
      setShowModal(false);
      setForm({ title: '', description: '', deadline: '', status: 'planning' });
    } else { toast.error(result.payload || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) toast.success('Project deleted');
    else toast.error(result.payload || 'Failed');
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Projects</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">{projects.length} projects</p>
        </div>
        {user?.role === 'admin' && <Button onClick={() => setShowModal(true)}><HiOutlinePlus className="w-4 h-4" /> New Project</Button>}
      </div>

      {projects.length === 0 ? (
        <EmptyState icon="📁" title="No projects yet" description="Create your first project to get started." action={user?.role === 'admin' && <Button onClick={() => setShowModal(true)}>Create Project</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${PROJECT_STATUS_COLORS[p.status]?.bg} ${PROJECT_STATUS_COLORS[p.status]?.text}`}>{p.status}</Badge>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-400 hover:text-red-500 transition-colors">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-base font-bold text-surface-900 dark:text-white mb-1">{p.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 flex-1 line-clamp-2 mb-4">{p.description || 'No description'}</p>
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>{p.teamMembers?.length || 0} members</span>
                  <span>{p.deadline ? formatDate(p.deadline) : 'No deadline'}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name" required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this project about?" />
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="planning">Planning</option><option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On Hold</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
