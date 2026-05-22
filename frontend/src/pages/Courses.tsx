import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../hooks/useI18n';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
}

export default function Courses() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải khóa học');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Tiêu đề khóa học là bắt buộc');
      return;
    }
    try {
      await api.post('/courses', { title, description });
      setTitle('');
      setDescription('');
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo khóa học');
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="card widget">
        <div className="section-header">
          <div>
            <h2>{t('coursesTitle')}</h2>
            <p>{t('addCourse')}</p>
          </div>
        </div>
        <form onSubmit={handleCreate} className="form-grid">
          <label>
            {t('courseTitle')}
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('courseTitle')} />
          </label>
          <label>
            {t('courseDescription')}
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('courseDescription')} rows={4} />
          </label>
          <button type="submit" className="btn btn-primary full">
            {t('createCourse')}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>
      <section className="card widget">
        <h2>{t('coursesTitle')}</h2>
        {courses.length === 0 ? (
          <p>{t('noData')}</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course.id}>
                <strong>{course.title}</strong>
                <span>{course.progress}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
