import type { Difficulty, QueensPuzzle } from './types.ts';

/**
 * Compact, diff-friendly storage form of a puzzle (see `puzzles.data.json`):
 * - `regions`: rows joined by `/`, one base-36 digit per cell (region id), e.g. `"011/012/222"`
 * - `solution`: one base-36 digit per row giving that row's queen column, e.g. `"102"`
 */
export interface EncodedPuzzle {
	id: string;
	difficulty: Difficulty;
	regions: string;
	solution: string;
}

const ROW_SEPARATOR = '/';
const BASE_36 = 36;

export function encodePuzzle(puzzle: QueensPuzzle): EncodedPuzzle {
	return {
		id: puzzle.id,
		difficulty: puzzle.difficulty,
		regions: puzzle.regions
			.map((row) => row.map((regionId) => regionId.toString(BASE_36)).join(''))
			.join(ROW_SEPARATOR),
		solution: puzzle.solution.map(([, col]) => col.toString(BASE_36)).join(''),
	};
}

export function decodePuzzle(encoded: EncodedPuzzle): QueensPuzzle {
	const regions = encoded.regions
		.split(ROW_SEPARATOR)
		.map((row) => Array.from(row, (digit) => Number.parseInt(digit, BASE_36)));

	return {
		id: encoded.id,
		difficulty: encoded.difficulty,
		size: regions.length,
		regions,
		solution: Array.from(encoded.solution, (digit, row) => [row, Number.parseInt(digit, BASE_36)]),
	};
}
