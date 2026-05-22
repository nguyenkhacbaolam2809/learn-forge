import { ScheduleItem } from '../types';
import { useI18n } from '../hooks/useI18n';

interface Props {
  items: ScheduleItem[];
}

function TaskList({ items }: Props) {
  const { t } = useI18n();

  return (
    <section className="card widget">
      <h2>{t('pendingTasksTitle')}</h2>
      {items.length === 0 ? (
        <p>{t('noData')}</p>
      ) : (
        <ul>
          {items.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.status === 'done' ? t('completed') : t('notCompleted')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;
