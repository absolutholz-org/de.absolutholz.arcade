import { resources } from '../config/i18n.js';
import { DEFAULT_LANGUAGE } from '../constants/languages.js';
import type { SupportedLanguageCode } from '../types/i18n.types.js';
import { isSupportedLanguage } from './detection.js';

/**
 * Structured fallback catalog providing canonical fallback display titles for all known arcade games.
 * Used when a language dictionary is missing or unresolved, avoiding ad-hoc string manipulation.
 */
export const DEFAULT_GAME_TITLES: Readonly<Record<string, string>> = Object.freeze({
	sudoku: 'Sudoku',
	minesweeper: 'Minesweeper',
	nonogram: 'Nonogram',
	queens: 'Queens',
	bridges: 'Bridges',
	tracks: 'Tracks',
	tents: 'Tents & Trees',
	anagram: 'Anagram Scramble',
	watersort: 'Water Sort',
	untangle: 'Untangle',
	net: 'Net',
	'color-flood': 'Color Flood',
});

/**
 * Type-safe, centralized resolver for game display titles.
 * Resolves cleanly against the game's i18n namespace for the specified (or default) language,
 * falling back to the English dictionary and then the structured fallback catalog.
 */
export function getGameTitle(gameId: string, lang?: SupportedLanguageCode): string {
	const activeLang = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
	const langRes = resources[activeLang] ?? resources.en;
	const gameNs = gameId as keyof typeof langRes;
	const gameEntry = langRes[gameNs];

	if (
		gameEntry &&
		typeof gameEntry === 'object' &&
		'title' in gameEntry &&
		typeof gameEntry.title === 'string' &&
		gameEntry.title.length > 0
	) {
		return gameEntry.title;
	}

	const enRes = resources.en[gameNs];
	if (
		enRes &&
		typeof enRes === 'object' &&
		'title' in enRes &&
		typeof enRes.title === 'string' &&
		enRes.title.length > 0
	) {
		return enRes.title;
	}

	return DEFAULT_GAME_TITLES[gameId] ?? gameId;
}

/**
 * Type-safe, centralized resolver for game short descriptions.
 * Resolves against the game's i18n namespace description for the specified (or default) language.
 */
export function getGameDescription(gameId: string, lang?: SupportedLanguageCode): string {
	const activeLang = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
	const langRes = resources[activeLang] ?? resources.en;
	const gameNs = gameId as keyof typeof langRes;
	const gameEntry = langRes[gameNs];

	if (
		gameEntry &&
		typeof gameEntry === 'object' &&
		'description' in gameEntry &&
		typeof gameEntry.description === 'string' &&
		gameEntry.description.length > 0
	) {
		return gameEntry.description;
	}

	const enRes = resources.en[gameNs];
	if (
		enRes &&
		typeof enRes === 'object' &&
		'description' in enRes &&
		typeof enRes.description === 'string' &&
		enRes.description.length > 0
	) {
		return enRes.description;
	}

	return '';
}
