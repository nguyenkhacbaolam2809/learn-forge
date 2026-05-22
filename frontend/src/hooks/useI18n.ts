import translations from '../i18n';
import { useTheme } from './useTheme';

export function useI18n() {
  const { language } = useTheme();
  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };
  return { t, language };
}
