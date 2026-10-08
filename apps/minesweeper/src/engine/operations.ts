import { getNeighbors } from './board';
import type { Cell, FieldState } from './types';

export interface RevealResult {
	cells: Cell[];
	detonated: boolean;
	won: boolean;
	revealedCountChange: number;
}

export function revealCell(
	cells: Cell[],
	columns: number,
	rows: number,
	targetCol: number,
	targetRow: number,
	totalMines: number,
): RevealResult {
	const targetIndex = targetRow * columns + targetCol;
	const targetCell = cells[targetIndex];

	if (!targetCell || targetCell.state !== 'unexplored') {
		return { cells, detonated: false, won: false, revealedCountChange: 0 };
	}

	const newCells = cells.map((c) => ({ ...c }));
	const cell = newCells[targetIndex];

	// If clicked cell is a mine, game over
	if (cell.mine) {
		cell.state = 'detonated';
		return { cells: newCells, detonated: true, won: false, revealedCountChange: 0 };
	}

	// Safe cell
	cell.state = 'revealed';
	let countRevealed = 1;

	// Flood fill if 0 adjacent mines
	if (cell.nearMineCount === 0) {
		const queue: Array<{ col: number; row: number }> = [{ col: targetCol, row: targetRow }];
		const visited = new Set<string>([cell.id]);

		while (queue.length > 0) {
			const current = queue.shift();
			if (!current) break;

			const neighbors = getNeighbors(newCells, current.col, current.row, columns, rows);
			for (const neighbor of neighbors) {
				if (visited.has(neighbor.id)) continue;
				visited.add(neighbor.id);

				if (neighbor.state === 'unexplored' && !neighbor.mine) {
					neighbor.state = 'revealed';
					countRevealed++;

					if (neighbor.nearMineCount === 0) {
						queue.push({ col: neighbor.col, row: neighbor.row });
					}
				}
			}
		}
	}

	// Check victory condition
	const totalCells = columns * rows;
	let currentRevealedCount = 0;
	for (const c of newCells) {
		if (c.state === 'revealed') {
			currentRevealedCount++;
		}
	}

	const won = currentRevealedCount === totalCells - totalMines;

	// If won, automatically flag any remaining unexplored mines
	if (won) {
		for (const c of newCells) {
			if (c.mine && c.state !== 'flagged') {
				c.state = 'flagged';
			}
		}
	}

	return {
		cells: newCells,
		detonated: false,
		won,
		revealedCountChange: countRevealed,
	};
}

export function cycleFlagState(currentState: FieldState, enableQuestionMarks: boolean): FieldState {
	if (currentState === 'unexplored') {
		return 'flagged';
	}
	if (currentState === 'flagged') {
		return enableQuestionMarks ? 'questioned' : 'unexplored';
	}
	if (currentState === 'questioned') {
		return 'unexplored';
	}
	return currentState;
}

export function chordCell(
	cells: Cell[],
	columns: number,
	rows: number,
	targetCol: number,
	targetRow: number,
	totalMines: number,
): RevealResult {
	const targetIndex = targetRow * columns + targetCol;
	const targetCell = cells[targetIndex];

	if (!targetCell || targetCell.state !== 'revealed' || targetCell.nearMineCount === 0) {
		return { cells, detonated: false, won: false, revealedCountChange: 0 };
	}

	const neighbors = getNeighbors(cells, targetCol, targetRow, columns, rows);
	const flaggedCount = neighbors.filter((n) => n.state === 'flagged').length;

	// Chord only executes when the number of flags matches the number on the cell
	if (flaggedCount !== targetCell.nearMineCount) {
		return { cells, detonated: false, won: false, revealedCountChange: 0 };
	}

	let currentCells = cells;
	let totalRevealedChange = 0;

	for (const neighbor of neighbors) {
		if (neighbor.state === 'unexplored') {
			const result = revealCell(currentCells, columns, rows, neighbor.col, neighbor.row, totalMines);
			currentCells = result.cells;
			totalRevealedChange += result.revealedCountChange;

			if (result.detonated) {
				return {
					cells: currentCells,
					detonated: true,
					won: false,
					revealedCountChange: totalRevealedChange,
				};
			}

			if (result.won) {
				return {
					cells: currentCells,
					detonated: false,
					won: true,
					revealedCountChange: totalRevealedChange,
				};
			}
		}
	}

	return {
		cells: currentCells,
		detonated: false,
		won: false,
		revealedCountChange: totalRevealedChange,
	};
}
