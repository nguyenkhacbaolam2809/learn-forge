import { useI18n } from '../hooks/useI18n';

interface Props {
  progress: number;
  courses: { id: number; title: string; progress: number }[];
}

function ProgressOverview({ progress, courses }: Props) {
  const { t } = useI18n();

  return (
    <section className="card widget">
      <div className="widget-header">
        <h2>{t('coursesTitle')}</h2>
        <span className="eyebrow">{progress}% {t('completed')}</span>
      </div>
      <div className="progress-summary">
        <div className="progress-circle">{progress}%</div>
        <p>{t('progressSummary')}</p>
      </div>
      <div className="course-list">
        {courses.length === 0 ? (
          <p>{t('noCourses')}</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="progress-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{course.title}</strong>
                <span>{course.progress}%</span>
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ProgressOverview;
