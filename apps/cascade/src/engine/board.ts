import {
	type Board,
	type CellCoord,
	type MoveResult,
	PERFECT_CLEAR_BONUS,
	type RemovedTileInfo,
	type Tile,
} from './types.ts';

const ORTHOGONAL_DIRS: readonly (readonly [number, number])[] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

/**
 * Deep-clones a board matrix (Tile objects themselves are immutable).
 */
export function cloneBoard(board: Board): Board {
	return board.map((row) => [...row]);
}

/**
 * Computes points awarded for clearing a connected cluster of `clusterSize` tiles.
 * Formula: (n - 2)^2 for n >= 2, else 0.
 */
export function calculateClusterScore(clusterSize: number): number {
	if (clusterSize < 2) return 0;
	const diff = clusterSize - 2;
	return diff * diff;
}

/**
 * Performs 4-directional orthogonal flood-fill starting from (startRow, startCol).
 * Returns all connected coordinates of matching color. Returns empty array if cell is null or out of bounds.
 */
export function findCluster(board: Board, startRow: number, startCol: number): CellCoord[] {
	const rows = board.length;
	const cols = rows > 0 ? (board[0]?.length ?? 0) : 0;

	if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) {
		return [];
	}

	const startTile = board[startRow]?.[startCol];
	if (!startTile) {
		return [];
	}

	const targetColor = startTile.color;
	const visited = new Set<number>();
	const cluster: CellCoord[] = [];
	const queue: CellCoord[] = [{ row: startRow, col: startCol }];
	visited.add(startRow * cols + startCol);

	let head = 0;
	while (head < queue.length) {
		const current = queue[head];
		head += 1;
		if (!current) continue;
		cluster.push(current);

		for (const [dr, dc] of ORTHOGONAL_DIRS) {
			const nr = current.row + dr;
			const nc = current.col + dc;
			if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

			const key = nr * cols + nc;
			if (visited.has(key)) continue;

			const neighbor = board[nr]?.[nc];
			if (neighbor && neighbor.color === targetColor) {
				visited.add(key);
				queue.push({ row: nr, col: nc });
			}
		}
	}

	return cluster;
}

/**
 * Returns true if the cell belongs to a valid selectable cluster (size >= 2).
 */
export function isValidClusterCell(board: Board, row: number, col: number): boolean {
	const tile = board[row]?.[col];
	if (!tile) return false;

	const rows = board.length;
	const cols = board[0]?.length ?? 0;

	for (const [dr, dc] of ORTHOGONAL_DIRS) {
		const nr = row + dr;
		const nc = col + dc;
		if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
			const neighbor = board[nr]?.[nc];
			if (neighbor && neighbor.color === tile.color) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Applies Cascade board physics deterministically:
 * 1. Vertical gravity: in each column, non-null tiles fall straight down preserving order.
 * 2. Horizontal compaction: completely empty columns are removed and columns to the right shift left.
 */
export function applyGravity(board: Board): Board {
	const rows = board.length;
	const cols = rows > 0 ? (board[0]?.length ?? 0) : 0;

	// Step 1: Compact each column downward
	const nonEmptyColumns: (Tile | null)[][] = [];
	for (let c = 0; c < cols; c += 1) {
		const columnTiles: Tile[] = [];
		for (let r = rows - 1; r >= 0; r -= 1) {
			const tile = board[r]?.[c];
			if (tile) {
				columnTiles.push(tile);
			}
		}

		// Step 2: Retain only columns with at least one tile (empty columns collapse left)
		if (columnTiles.length > 0) {
			const compactedCol: (Tile | null)[] = new Array<Tile | null>(rows).fill(null);
			for (let i = 0; i < columnTiles.length; i += 1) {
				compactedCol[rows - 1 - i] = columnTiles[i] ?? null;
			}
			nonEmptyColumns.push(compactedCol);
		}
	}

	// Reconstruct 2D board [row][col], padding empty columns on the right
	const nextBoard: Board = Array.from({ length: rows }, () => new Array<Tile | null>(cols).fill(null));
	for (let c = 0; c < nonEmptyColumns.length; c += 1) {
		const colData = nonEmptyColumns[c];
		if (!colData) continue;
		for (let r = 0; r < rows; r += 1) {
			const rowArr = nextBoard[r];
			if (rowArr) {
				rowArr[c] = colData[r] ?? null;
			}
		}
	}

	return nextBoard;
}

/**
 * Counts how many non-null tiles remain on the board.
 */
export function countRemainingTiles(board: Board): number {
	let count = 0;
	for (const row of board) {
		for (const cell of row) {
			if (cell !== null) count += 1;
		}
	}
	return count;
}

/**
 * Scans the board to check if any connected orthogonal pair of matching tiles remains.
 */
export function hasValidMoves(board: Board): boolean {
	const rows = board.length;
	const cols = rows > 0 ? (board[0]?.length ?? 0) : 0;

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const tile = board[r]?.[c];
			if (!tile) continue;

			// Checking right and down is sufficient to detect any orthogonal pair
			if (c + 1 < cols) {
				const right = board[r]?.[c + 1];
				if (right && right.color === tile.color) return true;
			}
			if (r + 1 < rows) {
				const down = board[r + 1]?.[c];
				if (down && down.color === tile.color) return true;
			}
		}
	}

	return false;
}

/**
 * Returns coordinates of all remaining tiles that have no orthogonally adjacent matching neighbor.
 */
export function findOrphanTiles(board: Board): CellCoord[] {
	const orphans: CellCoord[] = [];
	const rows = board.length;
	const cols = rows > 0 ? (board[0]?.length ?? 0) : 0;

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const tile = board[r]?.[c];
			if (tile && !isValidClusterCell(board, r, c)) {
				orphans.push({ row: r, col: c });
			}
		}
	}

	return orphans;
}

/**
 * Executes a move at (row, col). Returns null if the cell is empty or isolated (cluster < 2).
 */
export function executeMove(board: Board, row: number, col: number): MoveResult | null {
	const cluster = findCluster(board, row, col);
	if (cluster.length < 2) {
		return null;
	}

	const working = cloneBoard(board);
	const removedTiles: RemovedTileInfo[] = [];

	for (const coord of cluster) {
		const tile = working[coord.row]?.[coord.col];
		if (tile) {
			removedTiles.push({
				id: tile.id,
				color: tile.color,
				row: coord.row,
				col: coord.col,
			});
			const targetRow = working[coord.row];
			if (targetRow) {
				targetRow[coord.col] = null;
			}
		}
	}

	const settledBoard = applyGravity(working);
	const remainingTiles = countRemainingTiles(settledBoard);
	const isPerfectClear = remainingTiles === 0;
	const isGameOver = isPerfectClear || !hasValidMoves(settledBoard);
	const pointsAwarded = calculateClusterScore(cluster.length);
	const perfectClearBonus = isPerfectClear ? PERFECT_CLEAR_BONUS : 0;
	const orphanTiles = isGameOver && !isPerfectClear ? findOrphanTiles(settledBoard) : [];

	return {
		board: settledBoard,
		removedTiles,
		clusterSize: cluster.length,
		pointsAwarded,
		perfectClearBonus,
		remainingTiles,
		isGameOver,
		isPerfectClear,
		orphanTiles,
	};
}
