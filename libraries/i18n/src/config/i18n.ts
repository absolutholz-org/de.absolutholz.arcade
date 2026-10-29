import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import { deAnagram } from '../locales/de/anagram.js';
import { deBridges } from '../locales/de/bridges.js';
import { deCommon } from '../locales/de/common.js';
import { deMedals } from '../locales/de/medals.js';
import { deMinesweeper } from '../locales/de/minesweeper.js';
import { deNonogram } from '../locales/de/nonogram.js';
import { deQueens } from '../locales/de/queens.js';
import { deSoloNoble } from '../locales/de/solonoble.js';
import { deSudoku } from '../locales/de/sudoku.js';
import { deTents } from '../locales/de/tents.js';
import { deTracks } from '../locales/de/tracks.js';
import { deWatersort } from '../locales/de/watersort.js';
import { enAnagram } from '../locales/en/anagram.js';
import { enBridges } from '../locales/en/bridges.js';
import { enCommon } from '../locales/en/common.js';
import { enMedals } from '../locales/en/medals.js';
import { enMinesweeper } from '../locales/en/minesweeper.js';
import { enNonogram } from '../locales/en/nonogram.js';
import { enQueens } from '../locales/en/queens.js';
import { enSoloNoble } from '../locales/en/solonoble.js';
import { enSudoku } from '../locales/en/sudoku.js';
import { enTents } from '../locales/en/tents.js';
import { enTracks } from '../locales/en/tracks.js';
import { enWatersort } from '../locales/en/watersort.js';
import { frAnagram } from '../locales/fr/anagram.js';
import { frBridges } from '../locales/fr/bridges.js';
import { frCommon } from '../locales/fr/common.js';
import { frMedals } from '../locales/fr/medals.js';
import { frMinesweeper } from '../locales/fr/minesweeper.js';
import { frNonogram } from '../locales/fr/nonogram.js';
import { frQueens } from '../locales/fr/queens.js';
import { frSoloNoble } from '../locales/fr/solonoble.js';
import { frSudoku } from '../locales/fr/sudoku.js';
import { frTents } from '../locales/fr/tents.js';
import { frTracks } from '../locales/fr/tracks.js';
import { frWatersort } from '../locales/fr/watersort.js';
import { ptAnagram } from '../locales/pt/anagram.js';
import { ptBridges } from '../locales/pt/bridges.js';
import { ptCommon } from '../locales/pt/common.js';
import { ptMedals } from '../locales/pt/medals.js';
import { ptMinesweeper } from '../locales/pt/minesweeper.js';
import { ptNonogram } from '../locales/pt/nonogram.js';
import { ptQueens } from '../locales/pt/queens.js';
import { ptSoloNoble } from '../locales/pt/solonoble.js';
import { ptSudoku } from '../locales/pt/sudoku.js';
import { ptTents } from '../locales/pt/tents.js';
import { ptTracks } from '../locales/pt/tracks.js';
import { ptWatersort } from '../locales/pt/watersort.js';
import type { TranslationResources } from '../types/i18n.types.js';
import { resolveInitialLanguage } from '../utils/detection.js';

export const resources: TranslationResources = {
	en: {
		common: enCommon,
		sudoku: enSudoku,
		minesweeper: enMinesweeper,
		nonogram: enNonogram,
		queens: enQueens,
		bridges: enBridges,
		tracks: enTracks,
		watersort: enWatersort,
		solonoble: enSoloNoble,
		tents: enTents,
		anagram: enAnagram,
		medals: enMedals,
	},
	de: {
		common: deCommon,
		sudoku: deSudoku,
		minesweeper: deMinesweeper,
		nonogram: deNonogram,
		queens: deQueens,
		bridges: deBridges,
		tracks: deTracks,
		watersort: deWatersort,
		solonoble: deSoloNoble,
		tents: deTents,
		anagram: deAnagram,
		medals: deMedals,
	},
	fr: {
		common: frCommon,
		sudoku: frSudoku,
		minesweeper: frMinesweeper,
		nonogram: frNonogram,
		queens: frQueens,
		bridges: frBridges,
		tracks: frTracks,
		watersort: frWatersort,
		solonoble: frSoloNoble,
		tents: frTents,
		anagram: frAnagram,
		medals: frMedals,
	},
	pt: {
		common: ptCommon,
		sudoku: ptSudoku,
		minesweeper: ptMinesweeper,
		nonogram: ptNonogram,
		queens: ptQueens,
		bridges: ptBridges,
		tracks: ptTracks,
		watersort: ptWatersort,
		solonoble: ptSoloNoble,
		tents: ptTents,
		anagram: ptAnagram,
		medals: ptMedals,
	},
};

export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
	resources,
	lng: resolveInitialLanguage(),
	fallbackLng: false,
	supportedLngs: SUPPORTED_LANGUAGES.map((item) => item.code),
	defaultNS: 'common',
	ns: [
		'common',
		'sudoku',
		'minesweeper',
		'nonogram',
		'queens',
		'bridges',
		'tracks',
		'watersort',
		'solonoble',
		'tents',
		'anagram',
		'medals',
	],
	interpolation: {
		escapeValue: false,
	},
});
