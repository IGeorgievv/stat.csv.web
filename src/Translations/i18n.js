import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
 
import { TRANSLATIONS_EN } from './en';
import { TRANSLATIONS_BG } from './bg';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: TRANSLATIONS_EN
      },
      bg: {
        translation: TRANSLATIONS_BG
      }
    }
  });

i18n.languages = ['en', 'bg'];
i18n.changeLanguage('bg');

export default i18n;