import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import { deCommon } from '../locales/de/common.js';
import { enCommon } from '../locales/en/common.js';
import { frCommon } from '../locales/fr/common.js';
import { ptCommon } from '../locales/pt/common.js';
import type { TranslationResources } from '../types/i18n.types.js';
import { resolveInitialLanguage } from '../utils/detection.js';

export const resources: TranslationResources = {
	en: { common: enCommon },
	de: { common: deCommon },
	fr: { common: frCommon },
	pt: { common: ptCommon },
};

export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
	resources,
	lng: resolveInitialLanguage(),
	fallbackLng: false,
	supportedLngs: SUPPORTED_LANGUAGES.map((item) => item.code),
	defaultNS: 'common',
	ns: ['common'],
	interpolation: {
		escapeValue: false,
	},
});
