import type { GameDefinition, GameId } from './types.js';

/**
 * Central registry mapping every supported GameId to its metadata and visual assets.
 * TypeScript guarantees that any GameId added to the union must be fully specified here.
 */
export const GAME_REGISTRY: Readonly<Record<GameId, GameDefinition>> = {
	sudoku: {
		id: 'sudoku',
		name: 'Sudoku',
		route: '/sudoku',
		assets: {
			icon: '🔢',
		},
		i18nNamespace: 'sudoku',
	},
	minesweeper: {
		id: 'minesweeper',
		name: 'Minesweeper',
		route: '/minesweeper',
		assets: {
			icon: '💣',
		},
		i18nNamespace: 'minesweeper',
	},
	nonogram: {
		id: 'nonogram',
		name: 'Nonogram',
		route: '/nonogram',
		assets: {
			icon: '🎨',
		},
		i18nNamespace: 'nonogram',
	},
	queens: {
		id: 'queens',
		name: 'Queens',
		route: '/queens',
		assets: {
			icon: '👑',
		},
		i18nNamespace: 'queens',
	},
	bridges: {
		id: 'bridges',
		name: 'Bridges',
		route: '/bridges',
		assets: {
			icon: '🌉',
		},
		i18nNamespace: 'bridges',
	},
	tracks: {
		id: 'tracks',
		name: 'Tracks',
		route: '/tracks',
		assets: {
			icon: '🚂',
		},
		i18nNamespace: 'tracks',
	},
	tents: {
		id: 'tents',
		name: 'Tents & Trees',
		route: '/tents',
		assets: {
			icon: '⛺',
		},
		i18nNamespace: 'tents',
	},
	anagram: {
		id: 'anagram',
		name: 'Anagram Scramble',
		route: '/anagram',
		assets: {
			icon: '🔤',
		},
		i18nNamespace: 'anagram',
	},
	watersort: {
		id: 'watersort',
		name: 'Water Sort',
		route: '/watersort',
		assets: {
			icon: '🧪',
		},
		i18nNamespace: 'watersort',
	},
	untangle: {
		id: 'untangle',
		name: 'Untangle',
		route: '/untangle',
		assets: {
			icon: '🕸️',
		},
		i18nNamespace: 'untangle',
	},
	net: {
		id: 'net',
		name: 'Net',
		route: '/net',
		assets: {
			icon: '🌐',
		},
		i18nNamespace: 'net',
	},
};

/**
 * Array of all registered games in canonical display order.
 */
export const ALL_GAMES: readonly GameDefinition[] = Object.freeze(Object.values(GAME_REGISTRY));

/**
 * Array of all game IDs.
 */
export const GAME_IDS: readonly GameId[] = Object.freeze(Object.keys(GAME_REGISTRY) as GameId[]);

/**
 * Retrieves the metadata definition for a given GameId.
 */
export function getGame(id: GameId): GameDefinition {
	return (GAME_REGISTRY as Record<GameId, GameDefinition>)[id];
}
