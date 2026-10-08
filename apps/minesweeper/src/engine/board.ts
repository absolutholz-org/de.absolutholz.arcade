import type { Cell } from './types';

export function createEmptyBoard(columns: number, rows: number): Cell[] {
	const cells: Cell[] = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < columns; col++) {
			cells.push({
				id: `${col}x${row}`,
				col,
				row,
				mine: false,
				state: 'unexplored',
				nearMineCount: 0,
			});
		}
	}
	return cells;
}

export function getNeighborCoords(
	col: number,
	row: number,
	columns: number,
	rows: number,
): Array<{ col: number; row: number }> {
	const coords: Array<{ col: number; row: number }> = [];
	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			if (dx === 0 && dy === 0) continue;
			const nc = col + dx;
			const nr = row + dy;
			if (nc >= 0 && nc < columns && nr >= 0 && nr < rows) {
				coords.push({ col: nc, row: nr });
			}
		}
	}
	return coords;
}

export function getNeighbors(cells: Cell[], col: number, row: number, columns: number, rows: number): Cell[] {
	const neighborCoords = getNeighborCoords(col, row, columns, rows);
	const result: Cell[] = [];
	for (const coord of neighborCoords) {
		const index = coord.row * columns + coord.col;
		const neighbor = cells[index];
		if (neighbor) {
			result.push(neighbor);
		}
	}
	return result;
}

export function computeNearMineCounts(cells: Cell[], columns: number, rows: number): void {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < columns; col++) {
			const cell = cells[row * columns + col];
			if (!cell || cell.mine) continue;

			let count = 0;
			const neighbors = getNeighbors(cells, col, row, columns, rows);
			for (const neighbor of neighbors) {
				if (neighbor.mine) {
					count++;
				}
			}
			cell.nearMineCount = count;
		}
	}
}

export function placeMines(
	cells: Cell[],
	columns: number,
	rows: number,
	mineCount: number,
	safeCol?: number,
	safeRow?: number,
): Cell[] {
	const totalCells = columns * rows;
	const countToPlace = Math.min(mineCount, Math.max(1, totalCells - 1));

	// Determine excluded coordinate indices for first click safety
	const excludedIndices = new Set<number>();
	if (safeCol !== undefined && safeRow !== undefined) {
		const safeIndex = safeRow * columns + safeCol;
		excludedIndices.add(safeIndex);

		// If possible, also exclude immediate 8 neighbors so the first click opens an area
		const neighborCoords = getNeighborCoords(safeCol, safeRow, columns, rows);
		if (totalCells - (1 + neighborCoords.length) >= countToPlace) {
			for (const n of neighborCoords) {
				excludedIndices.add(n.row * columns + n.col);
			}
		}
	}

	const availableIndices: number[] = [];
	for (let i = 0; i < totalCells; i++) {
		if (!excludedIndices.has(i)) {
			availableIndices.push(i);
		}
	}

	// Fisher-Yates shuffle on available indices
	for (let i = availableIndices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = availableIndices[i];
		availableIndices[i] = availableIndices[j];
		availableIndices[j] = temp;
	}

	const newCells = cells.map((cell) => ({
		...cell,
		mine: false,
		nearMineCount: 0,
	}));

	for (let i = 0; i < countToPlace; i++) {
		const mineIndex = availableIndices[i];
		if (mineIndex !== undefined && newCells[mineIndex]) {
			newCells[mineIndex].mine = true;
		}
	}

	computeNearMineCounts(newCells, columns, rows);
	return newCells;
}
