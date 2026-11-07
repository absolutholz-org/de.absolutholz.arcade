import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import { deAnagram } from '../locales/de/anagram.js';
import { deBridges } from '../locales/de/bridges.js';
import { deColorFlood } from '../locales/de/color-flood.js';
import { deCommon } from '../locales/de/common.js';
import { deDiceBingo } from '../locales/de/dice-bingo.js';
import { deLiquidSort } from '../locales/de/liquid-sort.js';
import { deMedals } from '../locales/de/medals.js';
import { deMinesweeper } from '../locales/de/minesweeper.js';
import { deNet } from '../locales/de/net.js';
import { deNonogram } from '../locales/de/nonogram.js';
import { dePentominoes } from '../locales/de/pentominoes.js';
import { deStarBattle } from '../locales/de/star-battle.js';
import { deSudoku } from '../locales/de/sudoku.js';
import { deTaxonomy } from '../locales/de/taxonomy.js';
import { deTents } from '../locales/de/tents.js';
import { deTracks } from '../locales/de/tracks.js';
import { deUntangle } from '../locales/de/untangle.js';
import { enAnagram } from '../locales/en/anagram.js';
import { enBridges } from '../locales/en/bridges.js';
import { enColorFlood } from '../locales/en/color-flood.js';
import { enCommon } from '../locales/en/common.js';
import { enDiceBingo } from '../locales/en/dice-bingo.js';
import { enLiquidSort } from '../locales/en/liquid-sort.js';
import { enMedals } from '../locales/en/medals.js';
import { enMinesweeper } from '../locales/en/minesweeper.js';
import { enNet } from '../locales/en/net.js';
import { enNonogram } from '../locales/en/nonogram.js';
import { enPentominoes } from '../locales/en/pentominoes.js';
import { enStarBattle } from '../locales/en/star-battle.js';
import { enSudoku } from '../locales/en/sudoku.js';
import { enTaxonomy } from '../locales/en/taxonomy.js';
import { enTents } from '../locales/en/tents.js';
import { enTracks } from '../locales/en/tracks.js';
import { enUntangle } from '../locales/en/untangle.js';
import { frAnagram } from '../locales/fr/anagram.js';
import { frBridges } from '../locales/fr/bridges.js';
import { frColorFlood } from '../locales/fr/color-flood.js';
import { frCommon } from '../locales/fr/common.js';
import { frDiceBingo } from '../locales/fr/dice-bingo.js';
import { frLiquidSort } from '../locales/fr/liquid-sort.js';
import { frMedals } from '../locales/fr/medals.js';
import { frMinesweeper } from '../locales/fr/minesweeper.js';
import { frNet } from '../locales/fr/net.js';
import { frNonogram } from '../locales/fr/nonogram.js';
import { frPentominoes } from '../locales/fr/pentominoes.js';
import { frStarBattle } from '../locales/fr/star-battle.js';
import { frSudoku } from '../locales/fr/sudoku.js';
import { frTaxonomy } from '../locales/fr/taxonomy.js';
import { frTents } from '../locales/fr/tents.js';
import { frTracks } from '../locales/fr/tracks.js';
import { frUntangle } from '../locales/fr/untangle.js';
import { ptAnagram } from '../locales/pt/anagram.js';
import { ptBridges } from '../locales/pt/bridges.js';
import { ptColorFlood } from '../locales/pt/color-flood.js';
import { ptCommon } from '../locales/pt/common.js';
import { ptDiceBingo } from '../locales/pt/dice-bingo.js';
import { ptLiquidSort } from '../locales/pt/liquid-sort.js';
import { ptMedals } from '../locales/pt/medals.js';
import { ptMinesweeper } from '../locales/pt/minesweeper.js';
import { ptNet } from '../locales/pt/net.js';
import { ptNonogram } from '../locales/pt/nonogram.js';
import { ptPentominoes } from '../locales/pt/pentominoes.js';
import { ptStarBattle } from '../locales/pt/star-battle.js';
import { ptSudoku } from '../locales/pt/sudoku.js';
import { ptTaxonomy } from '../locales/pt/taxonomy.js';
import { ptTents } from '../locales/pt/tents.js';
import { ptTracks } from '../locales/pt/tracks.js';
import { ptUntangle } from '../locales/pt/untangle.js';
import type { TranslationResources } from '../types/i18n.types.js';
import { resolveInitialLanguage } from '../utils/detection.js';

export const resources: TranslationResources = {
	en: {
		common: enCommon,
		sudoku: enSudoku,
		minesweeper: enMinesweeper,
		nonogram: enNonogram,
		'star-battle': enStarBattle,
		bridges: enBridges,
		tracks: enTracks,
		'liquid-sort': enLiquidSort,
		tents: enTents,
		anagram: enAnagram,
		untangle: enUntangle,
		net: enNet,
		'color-flood': enColorFlood,
		'dice-bingo': enDiceBingo,
		pentominoes: enPentominoes,
		medals: enMedals,
		taxonomy: enTaxonomy,
	},
	de: {
		common: deCommon,
		sudoku: deSudoku,
		minesweeper: deMinesweeper,
		nonogram: deNonogram,
		'star-battle': deStarBattle,
		bridges: deBridges,
		tracks: deTracks,
		'liquid-sort': deLiquidSort,
		tents: deTents,
		anagram: deAnagram,
		untangle: deUntangle,
		net: deNet,
		'color-flood': deColorFlood,
		'dice-bingo': deDiceBingo,
		pentominoes: dePentominoes,
		medals: deMedals,
		taxonomy: deTaxonomy,
	},
	fr: {
		common: frCommon,
		sudoku: frSudoku,
		minesweeper: frMinesweeper,
		nonogram: frNonogram,
		'star-battle': frStarBattle,
		bridges: frBridges,
		tracks: frTracks,
		'liquid-sort': frLiquidSort,
		tents: frTents,
		anagram: frAnagram,
		untangle: frUntangle,
		net: frNet,
		'color-flood': frColorFlood,
		'dice-bingo': frDiceBingo,
		pentominoes: frPentominoes,
		medals: frMedals,
		taxonomy: frTaxonomy,
	},
	pt: {
		common: ptCommon,
		sudoku: ptSudoku,
		minesweeper: ptMinesweeper,
		nonogram: ptNonogram,
		'star-battle': ptStarBattle,
		bridges: ptBridges,
		tracks: ptTracks,
		'liquid-sort': ptLiquidSort,
		tents: ptTents,
		anagram: ptAnagram,
		untangle: ptUntangle,
		net: ptNet,
		'color-flood': ptColorFlood,
		'dice-bingo': ptDiceBingo,
		pentominoes: ptPentominoes,
		medals: ptMedals,
		taxonomy: ptTaxonomy,
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
		'star-battle',
		'bridges',
		'tracks',
		'liquid-sort',
		'tents',
		'anagram',
		'untangle',
		'net',
		'color-flood',
		'dice-bingo',
		'pentominoes',
		'medals',
		'taxonomy',
	],
	interpolation: {
		escapeValue: false,
	},
});
