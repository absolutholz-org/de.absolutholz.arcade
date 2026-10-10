import type { CellState } from './types';

export interface AutoCrossTarget {
	row: number;
	col: number;
	prev: CellState;
}

/**
 * Computes cells that should be automatically crossed (marked with X) when a token is placed at (row, col):
 * - Entire row
 * - Entire column
 * - 8 adjacent surrounding cells
 */
export function getAutoCrossCells(board: CellState[][], row: number, col: number, size: number): AutoCrossTarget[] {
	const targets: AutoCrossTarget[] = [];
	const seen = new Set<string>();

	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			if (r === row && c === col) continue;

			const isSameRow = r === row;
			const isSameCol = c === col;
			const isAdjacent = Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;

			if (isSameRow || isSameCol || isAdjacent) {
				const key = `${r},${c}`;
				if (!seen.has(key) && board[r]?.[c] === 'empty') {
					seen.add(key);
					targets.push({ row: r, col: c, prev: 'empty' });
				}
			}
		}
	}

	return targets;
}
