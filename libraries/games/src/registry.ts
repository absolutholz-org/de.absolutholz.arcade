import type { GameId, GameMetadata, ToolDefinition, ToolId } from './types.js';

/**
 * Central registry mapping every supported GameId to its unified metadata, taxonomy, and visual assets.
 * TypeScript guarantees that any GameId added to the union must be fully specified here (ADR 0005 & ADR 0009).
 */
export const GAME_REGISTRY: Readonly<Record<GameId, GameMetadata>> = {
	sudoku: {
		id: 'sudoku',
		route: '/sudoku',
		assets: {
			icon: '🔢',
		},
		i18nNamespace: 'sudoku',
		category: {
			primary: 'logic-deduction',
		},
		tags: {
			mechanics: ['grid-based', 'deduction', 'number-logic'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only', 'dual-mode-toggle', 'direct-typing'],
			pacing: ['speedrun-timer', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['standard-5-10m', 'deep-15m-plus'],
		},
	},
	minesweeper: {
		id: 'minesweeper',
		route: '/minesweeper',
		assets: {
			icon: '💣',
		},
		i18nNamespace: 'minesweeper',
		category: {
			primary: 'logic-deduction',
		},
		tags: {
			mechanics: ['grid-based', 'deduction', 'number-logic', 'hazard-avoidance'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only', 'dual-mode-toggle'],
			pacing: ['speedrun-timer', 'mistake-penalty'],
			modes: ['single-player', 'procedural-endless'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	nonogram: {
		id: 'nonogram',
		route: '/nonogram',
		assets: {
			icon: '🎨',
		},
		i18nNamespace: 'nonogram',
		category: {
			primary: 'logic-deduction',
			secondary: 'spatial-puzzle',
		},
		tags: {
			mechanics: ['grid-based', 'deduction', 'number-logic', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'drag-and-drop', 'tap-only', 'dual-mode-toggle'],
			pacing: ['speedrun-timer', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	queens: {
		id: 'queens',
		route: '/queens',
		assets: {
			icon: '👑',
		},
		i18nNamespace: 'queens',
		category: {
			primary: 'logic-deduction',
		},
		tags: {
			mechanics: ['grid-based', 'deduction', 'color-matching', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'drag-and-drop', 'tap-only', 'dual-mode-toggle'],
			pacing: ['speedrun-timer', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m'],
		},
	},
	bridges: {
		id: 'bridges',
		route: '/bridges',
		assets: {
			icon: '🌉',
		},
		i18nNamespace: 'bridges',
		category: {
			primary: 'logic-deduction',
			secondary: 'spatial-puzzle',
		},
		tags: {
			mechanics: ['deduction', 'pathfinding', 'number-logic', 'graph-topology'],
			inputs: ['touch-optimized', 'keyboard-controls', 'drag-and-drop', 'tap-only'],
			pacing: ['zen-untimed', 'speedrun-timer', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	tracks: {
		id: 'tracks',
		route: '/tracks',
		assets: {
			icon: '🚂',
		},
		i18nNamespace: 'tracks',
		category: {
			primary: 'logic-deduction',
			secondary: 'spatial-puzzle',
		},
		tags: {
			mechanics: ['grid-based', 'pathfinding', 'deduction', 'number-logic'],
			inputs: ['touch-optimized', 'keyboard-controls', 'drag-and-drop', 'tap-only', 'dual-mode-toggle'],
			pacing: ['zen-untimed', 'speedrun-timer', 'mistake-penalty', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	tents: {
		id: 'tents',
		route: '/tents',
		assets: {
			icon: '⛺',
		},
		i18nNamespace: 'tents',
		category: {
			primary: 'logic-deduction',
		},
		tags: {
			mechanics: ['grid-based', 'deduction', 'number-logic', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only'],
			pacing: ['speedrun-timer', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m'],
		},
	},
	anagram: {
		id: 'anagram',
		route: '/anagram',
		assets: {
			icon: '🔤',
		},
		i18nNamespace: 'anagram',
		category: {
			primary: 'word-trivia',
		},
		tags: {
			mechanics: ['word-forming', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only', 'direct-typing'],
			pacing: ['zen-untimed', 'speedrun-timer', 'countdown-arcade'],
			modes: ['single-player', 'procedural-endless'],
			sessionLength: ['snack-under-3m', 'standard-5-10m'],
		},
	},
	watersort: {
		id: 'watersort',
		route: '/watersort',
		assets: {
			icon: '🧪',
		},
		i18nNamespace: 'watersort',
		category: {
			primary: 'casual-sorting',
			secondary: 'logic-deduction',
		},
		tags: {
			mechanics: ['sorting', 'color-matching', 'deduction'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only'],
			pacing: ['speedrun-timer', 'undo-friendly', 'move-efficiency'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m'],
		},
	},
	untangle: {
		id: 'untangle',
		route: '/untangle',
		assets: {
			icon: '🕸️',
		},
		i18nNamespace: 'untangle',
		category: {
			primary: 'spatial-puzzle',
			secondary: 'casual-sorting',
		},
		tags: {
			mechanics: ['graph-topology', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'drag-and-drop'],
			pacing: ['zen-untimed', 'speedrun-timer', 'undo-friendly', 'move-efficiency'],
			modes: ['single-player', 'procedural-endless', 'curated-levels'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	net: {
		id: 'net',
		route: '/net',
		assets: {
			icon: '🌐',
		},
		i18nNamespace: 'net',
		category: {
			primary: 'logic-deduction',
			secondary: 'spatial-puzzle',
		},
		tags: {
			mechanics: ['grid-based', 'pathfinding', 'deduction', 'tile-rotation', 'graph-topology'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only'],
			pacing: ['zen-untimed', 'speedrun-timer', 'undo-friendly', 'move-efficiency'],
			modes: ['single-player', 'procedural-endless'],
			sessionLength: ['snack-under-3m', 'standard-5-10m', 'deep-15m-plus'],
		},
	},
	floodit: {
		id: 'floodit',
		route: '/floodit',
		assets: {
			icon: '🌊',
		},
		i18nNamespace: 'floodit',
		category: {
			primary: 'casual-sorting',
			secondary: 'spatial-puzzle',
		},
		tags: {
			mechanics: ['grid-based', 'color-matching', 'sorting', 'pattern-recognition'],
			inputs: ['touch-optimized', 'keyboard-controls', 'tap-only'],
			pacing: ['move-efficiency', 'turn-paced', 'undo-friendly'],
			modes: ['single-player', 'procedural-endless'],
			sessionLength: ['snack-under-3m', 'standard-5-10m'],
		},
	},
};

/**
 * Array of all registered games in canonical display order.
 */
export const ALL_GAMES: readonly GameMetadata[] = Object.freeze(Object.values(GAME_REGISTRY));

/**
 * Array of all game IDs.
 */
export const GAME_IDS: readonly GameId[] = Object.freeze(Object.keys(GAME_REGISTRY) as GameId[]);

/**
 * Retrieves the metadata definition for a given GameId.
 */
export function getGame(id: GameId): GameMetadata {
	return (GAME_REGISTRY as Record<GameId, GameMetadata>)[id];
}

/**
 * Central registry mapping every supported standalone ToolId to its metadata and visual assets.
 */
export const TOOL_REGISTRY: Readonly<Record<ToolId, ToolDefinition>> = {
	dice: {
		id: 'dice',
		name: 'Dice Roller',
		route: '/tools/dice',
		assets: {
			icon: '🎲',
		},
		i18nKey: 'tools.dice',
		tags: ['tool', 'tabletop', 'utility', 'dice'],
	},
};

/**
 * Array of all registered standalone tools in canonical display order.
 */
export const ALL_TOOLS: readonly ToolDefinition[] = Object.freeze(Object.values(TOOL_REGISTRY));

/**
 * Array of all standalone tool IDs.
 */
export const TOOL_IDS: readonly ToolId[] = Object.freeze(Object.keys(TOOL_REGISTRY) as ToolId[]);

/**
 * Retrieves the metadata definition for a given ToolId.
 */
export function getTool(id: ToolId): ToolDefinition {
	return (TOOL_REGISTRY as Record<ToolId, ToolDefinition>)[id];
}
