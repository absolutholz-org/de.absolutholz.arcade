import puzzlesData from './puzzles.data.json' with { type: 'json' };
import type { BoardState, CellState, DifficultyLevel, StaticPuzzleDefinition } from './types.ts';

type StaticPuzzleCatalog = Record<DifficultyLevel, StaticPuzzleDefinition[]>;

export const STATIC_PUZZLES: StaticPuzzleCatalog = puzzlesData as StaticPuzzleCatalog;

export function createBoardFromPuzzle(
	puzzle: StaticPuzzleDefinition,
	difficulty: DifficultyLevel = puzzle.difficulty,
): BoardState {
	const grid: CellState[][] = Array.from({ length: puzzle.size }, () =>
		Array.from({ length: puzzle.size }, () => 'empty' as CellState),
	);

	for (const fixed of puzzle.fixedCells) {
		if (fixed.row >= 0 && fixed.row < puzzle.size && fixed.col >= 0 && fixed.col < puzzle.size) {
			grid[fixed.row][fixed.col] = fixed.track;
		}
	}

	return {
		difficulty,
		size: puzzle.size,
		rowClues: [...puzzle.rowClues],
		colClues: [...puzzle.colClues],
		start: { ...puzzle.start },
		end: { ...puzzle.end },
		fixedCells: puzzle.fixedCells.map((f) => ({ ...f })),
		grid,
	};
}

export function getStaticPuzzle(difficulty: DifficultyLevel, index = 0): BoardState {
	const list = STATIC_PUZZLES[difficulty] ?? STATIC_PUZZLES.easy;
	const safeIndex = ((index % list.length) + list.length) % list.length;
	const puzzle = list[safeIndex];
	return createBoardFromPuzzle(puzzle, difficulty);
}

export function getPuzzlesByDifficulty(difficulty: DifficultyLevel): StaticPuzzleDefinition[] {
	return STATIC_PUZZLES[difficulty] ?? STATIC_PUZZLES.easy;
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
