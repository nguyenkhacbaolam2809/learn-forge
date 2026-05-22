import { ScheduleItem } from '../types';
import { useI18n } from '../hooks/useI18n';

interface Props {
  items: ScheduleItem[];
}

function ScheduleWidget({ items }: Props) {
  const { t } = useI18n();

  return (
    <section className="card widget">
      <h2>{t('scheduleTitle')}</h2>
      {items.length === 0 ? (
        <p>{t('noSchedule')}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.dueDate ? new Date(item.dueDate).toLocaleString() : t('noDateLabel')}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ScheduleWidget;
