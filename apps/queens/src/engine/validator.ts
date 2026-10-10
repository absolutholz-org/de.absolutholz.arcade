import type { CellConflict, CellCoord, CellState } from './types.js';

/**
 * Validates token placements against the Queens rules and detects collisions:
 * 1. Row: at most 1 token per row
 * 2. Column: at most 1 token per column
 * 3. Region: at most 1 token per contiguous color region
 * 4. Adjacency: tokens cannot touch horizontally, vertically, or diagonally
 */
export function getConflicts(board: CellState[][], regions: number[][], size: number): Map<string, CellConflict> {
	const conflicts = new Map<string, CellConflict>();

	const tokenCoords: CellCoord[] = [];
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (board[r]?.[c] === 'token') {
				tokenCoords.push({ row: r, col: c });
			}
		}
	}

	function flagConflict(r: number, c: number, type: keyof CellConflict) {
		const key = `${r},${c}`;
		const current = conflicts.get(key) || {};
		current[type] = true;
		conflicts.set(key, current);
	}

	// 1. Check Row conflicts
	const rowTokens = new Map<number, CellCoord[]>();
	for (const coord of tokenCoords) {
		const existing = rowTokens.get(coord.row) || [];
		existing.push(coord);
		rowTokens.set(coord.row, existing);
	}
	for (const tokens of rowTokens.values()) {
		if (tokens.length > 1) {
			for (const t of tokens) {
				flagConflict(t.row, t.col, 'row');
			}
		}
	}

	// 2. Check Column conflicts
	const colTokens = new Map<number, CellCoord[]>();
	for (const coord of tokenCoords) {
		const existing = colTokens.get(coord.col) || [];
		existing.push(coord);
		colTokens.set(coord.col, existing);
	}
	for (const tokens of colTokens.values()) {
		if (tokens.length > 1) {
			for (const t of tokens) {
				flagConflict(t.row, t.col, 'col');
			}
		}
	}

	// 3. Check Region conflicts
	const regionTokens = new Map<number, CellCoord[]>();
	for (const coord of tokenCoords) {
		const reg = regions[coord.row]?.[coord.col] ?? -1;
		const existing = regionTokens.get(reg) || [];
		existing.push(coord);
		regionTokens.set(reg, existing);
	}
	for (const tokens of regionTokens.values()) {
		if (tokens.length > 1) {
			for (const t of tokens) {
				flagConflict(t.row, t.col, 'region');
			}
		}
	}

	// 4. Check Adjacency conflicts (King distance: horizontally, vertically, diagonally)
	for (let i = 0; i < tokenCoords.length; i++) {
		for (let j = i + 1; j < tokenCoords.length; j++) {
			const a = tokenCoords[i];
			const b = tokenCoords[j];
			if (Math.abs(a.row - b.row) <= 1 && Math.abs(a.col - b.col) <= 1) {
				flagConflict(a.row, a.col, 'adjacency');
				flagConflict(b.row, b.col, 'adjacency');
			}
		}
	}

	return conflicts;
}

/**
 * Checks if the board satisfies all winning conditions:
 * - Exactly N tokens are placed
 * - Zero active rule conflicts
 */
export function isBoardSolved(board: CellState[][], regions: number[][], size: number): boolean {
	let tokenCount = 0;
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (board[r]?.[c] === 'token') {
				tokenCount++;
			}
		}
	}

	if (tokenCount !== size) {
		return false;
	}

	const conflicts = getConflicts(board, regions, size);
	return conflicts.size === 0;
}
