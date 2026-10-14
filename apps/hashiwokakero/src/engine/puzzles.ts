import puzzlesData from './puzzles.data.json' with { type: 'json' };
import type { BoardState, DifficultyLevel, Island } from './types.ts';

export interface StaticPuzzleDefinition {
	id: string;
	width: number;
	height: number;
	islands: Island[];
}

export type StaticPuzzleCatalog = Record<DifficultyLevel, StaticPuzzleDefinition[]>;

export const STATIC_PUZZLES: StaticPuzzleCatalog = puzzlesData as StaticPuzzleCatalog;

/**
 * Returns an initial BoardState from the static puzzle catalog.
 * If index exceeds the available puzzles for the difficulty tier, it cycles through using modulo.
 */
export function getStaticPuzzle(difficulty: DifficultyLevel, index = 0): BoardState {
	const list = STATIC_PUZZLES[difficulty] ?? STATIC_PUZZLES.beginner;
	const safeIndex = ((index % list.length) + list.length) % list.length;
	const puzzle = list[safeIndex];

	return {
		difficulty,
		width: puzzle.width,
		height: puzzle.height,
		islands: puzzle.islands.map((island) => ({ ...island })),
		bridges: [],
	};
}
