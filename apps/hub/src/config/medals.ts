import type { AchievementDefinition, GameId } from '@arcade/lib-medals';
import { ANAGRAM_MEDAL_DEFINITIONS } from '../../../anagram/src/config/medals';
import { BRIDGES_MEDAL_DEFINITIONS } from '../../../bridges/src/config/medals';
import { COLOR_FLOOD_MEDAL_DEFINITIONS } from '../../../color-flood/src/config/medals';
import { DICE_BINGO_MEDAL_DEFINITIONS } from '../../../dice-bingo/src/config/medals';
import { LIQUID_SORT_MEDAL_DEFINITIONS } from '../../../liquid-sort/src/config/medals';
import { MINESWEEPER_MEDAL_DEFINITIONS } from '../../../minesweeper/src/config/medals';
import { NET_MEDAL_DEFINITIONS } from '../../../net/src/config/medals';
import { NONOGRAM_MEDAL_DEFINITIONS } from '../../../nonogram/src/config/medals';
import { PENTOMINOES_MEDAL_DEFINITIONS } from '../../../pentominoes/src/config/medals';
import { STAR_BATTLE_MEDAL_DEFINITIONS } from '../../../star-battle/src/config/medals';
import { SUDOKU_MEDAL_DEFINITIONS } from '../../../sudoku/src/config/medals';
import { TENTS_MEDAL_DEFINITIONS } from '../../../tents/src/config/medals';
import { TICTACTOE_MEDAL_DEFINITIONS } from '../../../tictactoe/src/config/medals';
import { TRACKS_MEDAL_DEFINITIONS } from '../../../tracks/src/config/medals';
import { UNTANGLE_MEDAL_DEFINITIONS } from '../../../untangle/src/config/medals';

export const HUB_MEDAL_DEFINITIONS: {
	readonly [G in GameId]: readonly AchievementDefinition<G>[];
} = {
	sudoku: SUDOKU_MEDAL_DEFINITIONS,
	nonogram: NONOGRAM_MEDAL_DEFINITIONS,
	minesweeper: MINESWEEPER_MEDAL_DEFINITIONS,
	'star-battle': STAR_BATTLE_MEDAL_DEFINITIONS,
	tracks: TRACKS_MEDAL_DEFINITIONS,
	bridges: BRIDGES_MEDAL_DEFINITIONS,
	tents: TENTS_MEDAL_DEFINITIONS,
	anagram: ANAGRAM_MEDAL_DEFINITIONS,
	'liquid-sort': LIQUID_SORT_MEDAL_DEFINITIONS,
	untangle: UNTANGLE_MEDAL_DEFINITIONS,
	net: NET_MEDAL_DEFINITIONS,
	'color-flood': COLOR_FLOOD_MEDAL_DEFINITIONS,
	'dice-bingo': DICE_BINGO_MEDAL_DEFINITIONS,
	pentominoes: PENTOMINOES_MEDAL_DEFINITIONS,
	tictactoe: TICTACTOE_MEDAL_DEFINITIONS,
};

export function getHubMedalDefinitionsForGame<G extends GameId>(gameId: G): readonly AchievementDefinition<G>[] {
	return HUB_MEDAL_DEFINITIONS[gameId] ?? [];
}
