import type { AchievementDefinition, GameId } from '../types/index.js';
import { ANAGRAM_MEDAL_DEFINITIONS } from './anagram.js';
import { BRIDGES_MEDAL_DEFINITIONS } from './bridges.js';
import { MINESWEEPER_MEDAL_DEFINITIONS } from './minesweeper.js';
import { NONOGRAM_MEDAL_DEFINITIONS } from './nonogram.js';
import { QUEENS_MEDAL_DEFINITIONS } from './queens.js';
import { SUDOKU_MEDAL_DEFINITIONS } from './sudoku.js';
import { TENTS_MEDAL_DEFINITIONS } from './tents.js';
import { TRACKS_MEDAL_DEFINITIONS } from './tracks.js';

export * from './sudoku.js';
export * from './nonogram.js';
export * from './minesweeper.js';
export * from './queens.js';
export * from './tracks.js';
export * from './bridges.js';
export * from './tents.js';
export * from './anagram.js';

export function getMedalDefinitionsForGame<G extends GameId>(gameId: G): readonly AchievementDefinition<G>[] {
	switch (gameId) {
		case 'sudoku':
			return SUDOKU_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'nonogram':
			return NONOGRAM_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'minesweeper':
			return MINESWEEPER_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'queens':
			return QUEENS_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'tracks':
			return TRACKS_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'bridges':
			return BRIDGES_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'tents':
			return TENTS_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		case 'anagram':
			return ANAGRAM_MEDAL_DEFINITIONS as unknown as readonly AchievementDefinition<G>[];
		default:
			return [];
	}
}
