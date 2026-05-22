import { useI18n } from '../hooks/useI18n';

interface Props {
  courseCount: number;
  pendingTasks: number;
  upcomingEvents: number;
}

export default function HeroSection({ courseCount, pendingTasks, upcomingEvents }: Props) {
  const { t } = useI18n();

  return (
    <section className="hero-banner card">
      <div className="hero-copy">
        <p className="eyebrow">{t('welcomeStudent')}</p>
        <h2>{t('prepareLearningPath')}</h2>
        <p>{t('dashboardSubtitle')}</p>
      </div>
      <div className="metric-cards">
        <div className="metric-card">
          <strong>{courseCount}</strong>
          <span>{t('courseCount')}</span>
        </div>
        <div className="metric-card">
          <strong>{pendingTasks}</strong>
          <span>{t('taskCount')}</span>
        </div>
        <div className="metric-card">
          <strong>{upcomingEvents}</strong>
          <span>{t('eventCount')}</span>
        </div>
      </div>
    </section>
  );
}
