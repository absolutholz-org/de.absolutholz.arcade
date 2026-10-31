import { hasDirection } from './rotator.ts';
import { ALL_DIRECTIONS, type Board, type Cell, DIRECTION_DELTAS, OPPOSITE_DIRECTIONS } from './types.ts';

export interface ValidationResult {
	readonly isSolved: boolean;
	readonly totalCells: number;
	readonly poweredCount: number;
	readonly leakingPortsCount: number;
	readonly poweredGrid: readonly (readonly boolean[])[];
}

/**
 * Validates the network by performing a BFS traversal from the root server.
 * Traverses all connected wires and determines which nodes are powered and
 * whether there are any leaking (open/mismatched) ports.
 */
export function validateBoard(board: Board): ValidationResult {
	const { rows, cols, rootRow, rootCol, grid } = board;
	const totalCells = rows * cols;

	const poweredMatrix: boolean[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));

	// Root node is powered
	poweredMatrix[rootRow][rootCol] = true;

	const visited = new Set<number>();
	const rootIndex = rootRow * cols + rootCol;
	visited.add(rootIndex);

	const queue: { r: number; c: number }[] = [{ r: rootRow, c: rootCol }];

	while (queue.length > 0) {
		const curr = queue.shift();
		if (!curr) {
			break;
		}
		const cell = grid[curr.r][curr.c];

		for (const dir of ALL_DIRECTIONS) {
			if (hasDirection(cell.currentMask, dir)) {
				const { dr, dc } = DIRECTION_DELTAS[dir];
				const nr = curr.r + dr;
				const nc = curr.c + dc;

				// In-bounds check
				if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
					const neighbor = grid[nr][nc];
					const oppDir = OPPOSITE_DIRECTIONS[dir];

					// Check matching port
					if (hasDirection(neighbor.currentMask, oppDir)) {
						const neighborIndex = nr * cols + nc;
						if (!visited.has(neighborIndex)) {
							visited.add(neighborIndex);
							poweredMatrix[nr][nc] = true;
							queue.push({ r: nr, c: nc });
						}
					}
				}
			}
		}
	}

	// Calculate leaking ports
	let leakingPortsCount = 0;
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const cell = grid[r][c];
			for (const dir of ALL_DIRECTIONS) {
				if (hasDirection(cell.currentMask, dir)) {
					const { dr, dc } = DIRECTION_DELTAS[dir];
					const nr = r + dr;
					const nc = c + dc;

					if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
						leakingPortsCount++;
					} else {
						const neighbor = grid[nr][nc];
						const oppDir = OPPOSITE_DIRECTIONS[dir];
						if (!hasDirection(neighbor.currentMask, oppDir)) {
							leakingPortsCount++;
						}
					}
				}
			}
		}
	}

	const poweredCount = visited.size;
	const isSolved = poweredCount === totalCells && leakingPortsCount === 0;

	return {
		isSolved,
		totalCells,
		poweredCount,
		leakingPortsCount,
		poweredGrid: poweredMatrix,
	};
}

/**
 * Returns a new Board where each cell's isPowered state is updated
 * according to current connectivity to the root server.
 */
export function updateBoardPoweredState(board: Board): Board {
	const validation = validateBoard(board);
	const newGrid: Cell[][] = board.grid.map((row, r) =>
		row.map((cell, c) => ({
			...cell,
			isPowered: validation.poweredGrid[r][c],
		})),
	);

	return {
		...board,
		grid: newGrid,
	};
}
