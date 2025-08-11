import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import gr from '../locales/gr/translation.json';
import enTerms from '../locales/en/terms-conditions.json';
import grTerms from '../locales/gr/terms-conditions.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
        terms: enTerms
      },
      gr: {
        translation: gr,
        terms: grTerms
      },
    },
    lng: 'gr',
    fallbackLng: 'gr',
    interpolation: { escapeValue: false },
  });

export default i18n;