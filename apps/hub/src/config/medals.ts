import type { AchievementDefinition, GameId } from '@arcade/lib-medals';
import { ANAGRAM_MEDAL_DEFINITIONS } from '../../../anagram/src/config/medals';
import { BRIDGES_MEDAL_DEFINITIONS } from '../../../bridges/src/config/medals';
import { MINESWEEPER_MEDAL_DEFINITIONS } from '../../../minesweeper/src/config/medals';
import { NONOGRAM_MEDAL_DEFINITIONS } from '../../../nonogram/src/config/medals';
import { QUEENS_MEDAL_DEFINITIONS } from '../../../queens/src/config/medals';
import { SUDOKU_MEDAL_DEFINITIONS } from '../../../sudoku/src/config/medals';
import { TENTS_MEDAL_DEFINITIONS } from '../../../tents/src/config/medals';
import { TRACKS_MEDAL_DEFINITIONS } from '../../../tracks/src/config/medals';
import { UNTANGLE_MEDAL_DEFINITIONS } from '../../../untangle/src/config/medals';
import { WATERSORT_MEDAL_DEFINITIONS } from '../../../watersort/src/config/medals';

export const HUB_MEDAL_DEFINITIONS: {
	readonly [G in GameId]: readonly AchievementDefinition<G>[];
} = {
	sudoku: SUDOKU_MEDAL_DEFINITIONS,
	nonogram: NONOGRAM_MEDAL_DEFINITIONS,
	minesweeper: MINESWEEPER_MEDAL_DEFINITIONS,
	queens: QUEENS_MEDAL_DEFINITIONS,
	tracks: TRACKS_MEDAL_DEFINITIONS,
	bridges: BRIDGES_MEDAL_DEFINITIONS,
	tents: TENTS_MEDAL_DEFINITIONS,
	anagram: ANAGRAM_MEDAL_DEFINITIONS,
	watersort: WATERSORT_MEDAL_DEFINITIONS,
	untangle: UNTANGLE_MEDAL_DEFINITIONS,
};

export function getHubMedalDefinitionsForGame<G extends GameId>(gameId: G): readonly AchievementDefinition<G>[] {
	return HUB_MEDAL_DEFINITIONS[gameId] ?? [];
}
