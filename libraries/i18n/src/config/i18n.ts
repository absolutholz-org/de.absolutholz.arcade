import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import { deCommon } from '../locales/de/common.js';
import { deMinesweeper } from '../locales/de/minesweeper.js';
import { deSudoku } from '../locales/de/sudoku.js';
import { enCommon } from '../locales/en/common.js';
import { enMinesweeper } from '../locales/en/minesweeper.js';
import { enSudoku } from '../locales/en/sudoku.js';
import { frCommon } from '../locales/fr/common.js';
import { frMinesweeper } from '../locales/fr/minesweeper.js';
import { frSudoku } from '../locales/fr/sudoku.js';
import { ptCommon } from '../locales/pt/common.js';
import { ptMinesweeper } from '../locales/pt/minesweeper.js';
import { ptSudoku } from '../locales/pt/sudoku.js';
import type { TranslationResources } from '../types/i18n.types.js';
import { resolveInitialLanguage } from '../utils/detection.js';

export const resources: TranslationResources = {
	en: { common: enCommon, sudoku: enSudoku, minesweeper: enMinesweeper },
	de: { common: deCommon, sudoku: deSudoku, minesweeper: deMinesweeper },
	fr: { common: frCommon, sudoku: frSudoku, minesweeper: frMinesweeper },
	pt: { common: ptCommon, sudoku: ptSudoku, minesweeper: ptMinesweeper },
};

export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
	resources,
	lng: resolveInitialLanguage(),
	fallbackLng: false,
	supportedLngs: SUPPORTED_LANGUAGES.map((item) => item.code),
	defaultNS: 'common',
	ns: ['common', 'sudoku', 'minesweeper'],
	interpolation: {
		escapeValue: false,
	},
});
