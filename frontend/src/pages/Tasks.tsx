import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../hooks/useI18n';

type TaskItem = {
  id: number;
  title: string;
  due_date: string | null;
  status: string;
  course_id: number | null;
};

export default function Tasks() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải nhiệm vụ');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Tiêu đề nhiệm vụ là bắt buộc');
      return;
    }
    try {
      await api.post('/tasks', { title, due_date: dueDate || null, course_id: null });
      setTitle('');
      setDueDate('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo nhiệm vụ');
    }
  };

  const toggleStatus = async (task: TaskItem) => {
    try {
      await api.patch(`/tasks/${task.id}`, { status: task.status === 'done' ? 'pending' : 'done' });
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật nhiệm vụ');
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="card widget">
        <div className="section-header">
          <div>
            <h2>{t('tasksTitle')}</h2>
            <p>{t('addTask')}</p>
          </div>
        </div>
        <form onSubmit={handleCreate} className="form-grid">
          <label>
            {t('taskTitle')}
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('taskTitle')} />
          </label>
          <label>
            {t('dueDate')}
            <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
          </label>
          <button type="submit" className="btn btn-primary full">
            {t('createTask')}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>
      <section className="card widget">
        <h2>{t('tasksTitle')}</h2>
        {tasks.length === 0 ? (
          <p>{t('noData')}</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : t('noData')} • {task.status}
                  </div>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => toggleStatus(task)}>
                  {t('markDone')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
