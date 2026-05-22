import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../hooks/useI18n';

type ScheduleItem = {
  id: number;
  title: string;
  due_date: string | null;
  status: string;
  course_id: number | null;
};

export default function Schedule() {
  const { t } = useI18n();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/tasks');
      setItems(
        (res.data.tasks || []).sort((a: ScheduleItem, b: ScheduleItem) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        })
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải lịch học');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card widget">
      <div className="section-header">
        <div>
          <h2>{t('scheduleTitle')}</h2>
          <p>{t('tasksTitle')}</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p>{t('noData')}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.due_date ? new Date(item.due_date).toLocaleString() : t('noData')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
