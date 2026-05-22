import { useI18n } from '../hooks/useI18n';

export default function FeaturesSection() {
  const { t } = useI18n();

  const features = [
    { id: 1, title: 'Track progress', desc: 'Monitor courses and tasks' },
    { id: 2, title: 'Schedule', desc: 'Keep upcoming events organized' },
    { id: 3, title: 'Collaborate', desc: 'Discuss with peers' }
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((f) => (
          <div key={f.id} className="feature-card card">
            <h4>{f.title}</h4>
            <p className="muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
