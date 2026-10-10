import type { CellState } from './types';

/**
 * Computes clue runs from a line of 0s and 1s.
 * e.g. [0, 1, 1, 0, 1] => [2, 1]
 * [0, 0, 0] => [0]
 */
export function computeLineClue(line: number[]): number[] {
	const clue: number[] = [];
	let currentRun = 0;

	for (const val of line) {
		if (val === 1) {
			currentRun++;
		} else if (currentRun > 0) {
			clue.push(currentRun);
			currentRun = 0;
		}
	}

	if (currentRun > 0) {
		clue.push(currentRun);
	}

	return clue.length > 0 ? clue : [0];
}

/**
 * Computes all row and column clues for a binary solution matrix.
 */
export function computeClues(
	solution: number[],
	width: number,
	height: number,
): { rowClues: number[][]; colClues: number[][] } {
	const rowClues: number[][] = [];
	for (let r = 0; r < height; r++) {
		const row = solution.slice(r * width, (r + 1) * width);
		rowClues.push(computeLineClue(row));
	}

	const colClues: number[][] = [];
	for (let c = 0; c < width; c++) {
		const col: number[] = [];
		for (let r = 0; r < height; r++) {
			col.push(solution[r * width + c]);
		}
		colClues.push(computeLineClue(col));
	}

	return { rowClues, colClues };
}

/**
 * Checks if the player's currently filled cells in a line match the target clue runs.
 */
export function isLineCompleted(currentLineCells: CellState[], targetClue: number[]): boolean {
	const currentFilledRuns: number[] = [];
	let currentRun = 0;

	for (const state of currentLineCells) {
		if (state === 'filled') {
			currentRun++;
		} else if (currentRun > 0) {
			currentFilledRuns.push(currentRun);
			currentRun = 0;
		}
	}

	if (currentRun > 0) {
		currentFilledRuns.push(currentRun);
	}

	const effectiveRuns = currentFilledRuns.length > 0 ? currentFilledRuns : [0];

	if (targetClue.length === 1 && targetClue[0] === 0) {
		// Empty line: complete if no cells are filled AND at least one cell has been crossed out
		const hasCross = currentLineCells.some((c) => c === 'crossed');
		return currentFilledRuns.length === 0 && hasCross;
	}

	if (effectiveRuns.length !== targetClue.length) {
		return false;
	}

	for (let i = 0; i < targetClue.length; i++) {
		if (effectiveRuns[i] !== targetClue[i]) {
			return false;
		}
	}

	return true;
}

/**
 * Validates victory: triggers automatically when all filled cells match the solution
 * (ignoring extra X placements).
 */
export function isPuzzleSolved(cells: CellState[], solution: number[]): boolean {
	if (cells.length !== solution.length) {
		return false;
	}

	for (let i = 0; i < solution.length; i++) {
		const isFilled = cells[i] === 'filled';
		const shouldBeFilled = solution[i] === 1;

		if (shouldBeFilled && !isFilled) {
			return false;
		}
		if (!shouldBeFilled && isFilled) {
			return false;
		}
	}

	return true;
}
