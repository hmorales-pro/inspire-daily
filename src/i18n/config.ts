import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import landingEN from './locales/en/landing.json';
import homeEN from './locales/en/home.json';
import historyEN from './locales/en/history.json';
import settingsEN from './locales/en/settings.json';
import footerEN from './locales/en/footer.json';
import legalEN from './locales/en/legal.json';

// French translations
import commonFR from './locales/fr/common.json';
import authFR from './locales/fr/auth.json';
import landingFR from './locales/fr/landing.json';
import homeFR from './locales/fr/home.json';
import historyFR from './locales/fr/history.json';
import settingsFR from './locales/fr/settings.json';
import footerFR from './locales/fr/footer.json';
import legalFR from './locales/fr/legal.json';

const resources = {
  en: {
    translation: {
      ...commonEN,
      ...authEN,
      ...landingEN,
      ...homeEN,
      ...historyEN,
      ...settingsEN,
      ...footerEN,
      ...legalEN
    }
  },
  fr: {
    translation: {
      ...commonFR,
      ...authFR,
      ...landingFR,
      ...homeFR,
      ...historyFR,
      ...settingsFR,
      ...footerFR,
      ...legalFR
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'translation',
    fallbackNS: 'translation',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;