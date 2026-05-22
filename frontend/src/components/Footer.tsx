import { useI18n } from '../hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer card">
      <div className="footer-inner">
        <div className="footer-left">
          <strong>Learn Forge</strong>
          <p className="muted">{t('dashboardSubtitle')}</p>
        </div>
        <div className="footer-right muted">© {new Date().getFullYear()} Learn Forge</div>
      </div>
    </footer>
  );
}
