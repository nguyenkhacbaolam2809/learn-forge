import { useI18n } from '../hooks/useI18n';

export default function CTASection() {
  const { t } = useI18n();

  return (
    <section className="cta-section card">
      <div className="cta-inner">
        <div>
          <h3>Start learning smarter</h3>
          <p className="muted">{t('dashboardSubtitle')}</p>
        </div>
        <div>
          <button className="btn btn-primary">Get started</button>
        </div>
      </div>
    </section>
  );
}
