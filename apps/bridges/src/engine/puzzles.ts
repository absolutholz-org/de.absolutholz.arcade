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

export function getPuzzlesByDifficulty(difficulty: DifficultyLevel): StaticPuzzleDefinition[] {
	return STATIC_PUZZLES[difficulty] ?? STATIC_PUZZLES.beginner;
}

export function getPuzzleById(
	id: string,
): { puzzle: StaticPuzzleDefinition; difficulty: DifficultyLevel; index: number } | undefined {
	for (const diff of Object.keys(STATIC_PUZZLES) as DifficultyLevel[]) {
		const list = STATIC_PUZZLES[diff] ?? [];
		const index = list.findIndex((p) => p.id === id);
		if (index >= 0) {
			return { puzzle: list[index], difficulty: diff, index };
		}
	}
	return undefined;
}

export function getNextPuzzle(
	currentId: string,
): { puzzle: StaticPuzzleDefinition; difficulty: DifficultyLevel } | undefined {
	const current = getPuzzleById(currentId);
	if (!current) return undefined;
	const list = STATIC_PUZZLES[current.difficulty] ?? [];
	if (current.index >= 0 && current.index < list.length - 1) {
		return { puzzle: list[current.index + 1], difficulty: current.difficulty };
	}
	return undefined;
}

export function createBoardFromPuzzle(puzzle: StaticPuzzleDefinition, difficulty: DifficultyLevel): BoardState {
	return {
		difficulty,
		width: puzzle.width,
		height: puzzle.height,
		islands: puzzle.islands.map((island) => ({ ...island })),
		bridges: [],
	};
}
