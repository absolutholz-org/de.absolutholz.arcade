import type {
	Cell,
	CellInequalityRelations,
	ConflictResult,
	FutoshikiBoard,
	FutoshikiPuzzle,
	InequalitySign,
} from './types.ts';

export function coordKey(row: number, col: number): string {
	return `${row}-${col}`;
}

export function createBoardFromPuzzle(
	puzzle: FutoshikiPuzzle,
	values?: readonly (readonly (number | null)[])[],
	notes?: readonly (readonly (readonly number[])[])[],
): FutoshikiBoard {
	const cells: Cell[][] = [];
	for (let r = 0; r < puzzle.size; r += 1) {
		const rowCells: Cell[] = [];
		for (let c = 0; c < puzzle.size; c += 1) {
			const givenValue = puzzle.givens[r][c];
			const isGiven = givenValue !== null;
			const cellValue = isGiven ? givenValue : (values?.[r]?.[c] ?? null);
			const cellNotes = isGiven ? [] : [...(notes?.[r]?.[c] ?? [])];
			rowCells.push({
				row: r,
				col: c,
				value: cellValue,
				given: isGiven,
				notes: cellNotes,
			});
		}
		cells.push(rowCells);
	}

	return {
		size: puzzle.size,
		cells,
		hInequalities: puzzle.hInequalities,
		vInequalities: puzzle.vInequalities,
	};
}

export function satisfiesInequality(a: number, b: number, sign: InequalitySign): boolean {
	if (sign === null) return true;
	return sign === '<' ? a < b : a > b;
}

export function validateBoard(board: FutoshikiBoard): ConflictResult {
	const duplicateCells = new Set<string>();
	const violatedHorizontal = new Set<string>();
	const violatedVertical = new Set<string>();
	const { size, cells, hInequalities, vInequalities } = board;

	// Check row duplicates
	for (let r = 0; r < size; r += 1) {
		const seen = new Map<number, number[]>();
		for (let c = 0; c < size; c += 1) {
			const val = cells[r][c].value;
			if (val === null) continue;
			const cols = seen.get(val) ?? [];
			cols.push(c);
			seen.set(val, cols);
		}
		for (const cols of seen.values()) {
			if (cols.length > 1) {
				for (const c of cols) {
					duplicateCells.add(coordKey(r, c));
				}
			}
		}
	}

	// Check column duplicates
	for (let c = 0; c < size; c += 1) {
		const seen = new Map<number, number[]>();
		for (let r = 0; r < size; r += 1) {
			const val = cells[r][c].value;
			if (val === null) continue;
			const rows = seen.get(val) ?? [];
			rows.push(r);
			seen.set(val, rows);
		}
		for (const rows of seen.values()) {
			if (rows.length > 1) {
				for (const r of rows) {
					duplicateCells.add(coordKey(r, c));
				}
			}
		}
	}

	// Check horizontal inequalities: (r, c) vs (r, c + 1)
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size - 1; c += 1) {
			const sign = hInequalities[r][c];
			if (sign === null) continue;
			const leftVal = cells[r][c].value;
			const rightVal = cells[r][c + 1].value;
			if (leftVal !== null && rightVal !== null && !satisfiesInequality(leftVal, rightVal, sign)) {
				violatedHorizontal.add(coordKey(r, c));
			}
		}
	}

	// Check vertical inequalities: (r, c) vs (r + 1, c)
	for (let r = 0; r < size - 1; r += 1) {
		for (let c = 0; c < size; c += 1) {
			const sign = vInequalities[r][c];
			if (sign === null) continue;
			const topVal = cells[r][c].value;
			const bottomVal = cells[r + 1][c].value;
			if (topVal !== null && bottomVal !== null && !satisfiesInequality(topVal, bottomVal, sign)) {
				violatedVertical.add(coordKey(r, c));
			}
		}
	}

	return {
		duplicateCells,
		violatedHorizontal,
		violatedVertical,
		hasConflicts: duplicateCells.size > 0 || violatedHorizontal.size > 0 || violatedVertical.size > 0,
	};
}

export function isBoardComplete(board: FutoshikiBoard): boolean {
	const { size, cells } = board;
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			const val = cells[r][c].value;
			if (val === null || val < 1 || val > size) {
				return false;
			}
		}
	}
	return !validateBoard(board).hasConflicts;
}

/**
 * Returns the inequality relationships from the perspective of cell (row, col)
 * relative to its four orthogonal neighbors.
 * Example: if hInequalities[r][c - 1] === '<', then left < cell, so cell is 'greater' than left.
 */
export function getCellInequalityRelations(
	board: Pick<FutoshikiBoard, 'size' | 'hInequalities' | 'vInequalities'>,
	row: number,
	col: number,
): CellInequalityRelations {
	let left: 'greater' | 'less' | undefined;
	let right: 'greater' | 'less' | undefined;
	let above: 'greater' | 'less' | undefined;
	let below: 'greater' | 'less' | undefined;

	if (col > 0) {
		const sign = board.hInequalities[row][col - 1];
		if (sign === '<') left = 'greater';
		else if (sign === '>') left = 'less';
	}

	if (col < board.size - 1) {
		const sign = board.hInequalities[row][col];
		if (sign === '<') right = 'less';
		else if (sign === '>') right = 'greater';
	}

	if (row > 0) {
		const sign = board.vInequalities[row - 1][col];
		if (sign === '<') above = 'greater';
		else if (sign === '>') above = 'less';
	}

	if (row < board.size - 1) {
		const sign = board.vInequalities[row][col];
		if (sign === '<') below = 'less';
		else if (sign === '>') below = 'greater';
	}

	return { left, right, above, below };
}
