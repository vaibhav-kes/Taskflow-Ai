import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlinePlus } from 'react-icons/hi';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/taskSlice';
import { fetchProjects } from '../redux/projectSlice';
import { Card, Button, Modal, Input, Textarea, Select, Badge, EmptyState, Skeleton, Avatar } from '../components/ui';
import { STATUS_COLORS, PRIORITY_COLORS, TASK_STATUS } from '../constants';
import { formatDate, isOverdue } from '../utils/helpers';
import toast from 'react-hot-toast';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-400' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-400' },
];

export default function TasksPage() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector((s) => s.tasks);
  const { items: projects } = useSelector((s) => s.projects);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', projectId: '', priority: 'medium', status: 'todo', dueDate: '' });

  useEffect(() => { dispatch(fetchTasks()); dispatch(fetchProjects()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTask(form));
    if (createTask.fulfilled.match(result)) {
      toast.success('Task created!');
      setShowModal(false);
      setForm({ title: '', description: '', projectId: '', priority: 'medium', status: 'todo', dueDate: '' });
    } else toast.error(result.payload || 'Failed');
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await dispatch(updateTask({ id: taskId, data: { status: newStatus } }));
    if (updateTask.fulfilled.match(result)) toast.success(`Moved to ${newStatus}`);
  };

  const handleDeleteTask = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) toast.success('Task deleted');
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96" />)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">Task Board</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Kanban view</p>
        </div>
        <Button onClick={() => setShowModal(true)}><HiOutlinePlus className="w-4 h-4" /> New Task</Button>
      </div>

      {/* Kanban columns */}
      <div className="grid lg:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-bold text-surface-700 dark:text-surface-300">{col.title}</h3>
                <span className="text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="space-y-3 min-h-[200px] p-2 rounded-2xl bg-surface-100/50 dark:bg-surface-800/30">
                {colTasks.length === 0 ? (
                  <p className="text-xs text-surface-400 text-center py-8">No tasks</p>
                ) : colTasks.map((task, i) => (
                  <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white flex-1">{task.title}</h4>
                        <button onClick={() => handleDeleteTask(task._id)} className="text-surface-400 hover:text-red-500 text-xs ml-2">✕</button>
                      </div>
                      {task.description && <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${PRIORITY_COLORS[task.priority]?.bg} ${PRIORITY_COLORS[task.priority]?.text}`}>{task.priority}</Badge>
                        {isOverdue(task.dueDate, task.status) && <Badge variant="danger">Overdue</Badge>}
                      </div>
                      <div className="flex items-center justify-between text-xs text-surface-400">
                        <div className="flex items-center gap-1.5">
                          {task.assignedTo && <Avatar name={task.assignedTo.name} size="sm" />}
                          <span>{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                        {task.dueDate && <span>{formatDate(task.dueDate)}</span>}
                      </div>
                      {/* Status quick-switch */}
                      {task.status !== 'completed' && (
                        <div className="flex gap-1 pt-1">
                          {columns.filter(c => c.id !== task.status).map(c => (
                            <button key={c.id} onClick={() => handleStatusChange(task._id, c.id)}
                              className="text-[10px] px-2 py-1 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              → {c.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task name" required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Select label="Project" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} required>
            <option value="">Select project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </Select>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
