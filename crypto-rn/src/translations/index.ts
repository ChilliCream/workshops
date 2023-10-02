import i18n from 'i18next';
import {I18nextProvider, initReactI18next, useTranslation} from 'react-i18next';

import de from './de.json';

const Languages = {
  DE: 'de',
} as const;

const resources = {
  de,
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: Languages.DE,
  interpolation: {
    escapeValue: false,
  },
});

export {i18n, Languages, I18nextProvider, useTranslation, resources};
