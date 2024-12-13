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
import pagesEN from './locales/en/pages.json';

// French translations
import commonFR from './locales/fr/common.json';
import authFR from './locales/fr/auth.json';
import landingFR from './locales/fr/landing.json';
import homeFR from './locales/fr/home.json';
import historyFR from './locales/fr/history.json';
import settingsFR from './locales/fr/settings.json';
import footerFR from './locales/fr/footer.json';
import legalFR from './locales/fr/legal.json';
import pagesFR from './locales/fr/pages.json';

const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    landing: landingEN,
    home: homeEN,
    history: historyEN,
    settings: settingsEN,
    footer: footerFR,
    legal: legalEN,
    pages: pagesEN
  },
  fr: {
    common: commonFR,
    auth: authFR,
    landing: landingFR,
    home: homeFR,
    history: historyFR,
    settings: settingsFR,
    footer: footerFR,
    legal: legalFR,
    pages: pagesFR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    ns: ['common', 'auth', 'landing', 'home', 'history', 'settings', 'footer', 'legal', 'pages'],
    defaultNS: 'common',
    fallbackNS: 'common',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;