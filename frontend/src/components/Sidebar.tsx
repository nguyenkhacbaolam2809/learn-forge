import { useI18n } from '../hooks/useI18n';

export default function Sidebar() {
  const { t } = useI18n();

  return (
    <nav className="sidebar card">
      <ul>
        <li className="sidebar-item">{t('coursesTab')}</li>
        <li className="sidebar-item">{t('progressTab')}</li>
        <li className="sidebar-item">{t('tasksTab')}</li>
        <li className="sidebar-item">{t('scheduleTab')}</li>
        <li className="sidebar-item">{t('chatTab')}</li>
      </ul>
    </nav>
  );
}
