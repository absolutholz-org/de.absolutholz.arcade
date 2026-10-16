import type {
	BoardEvaluation,
	BoardState,
	CellState,
	Direction,
	FixedCell,
	LineEvaluation,
	LineStatus,
	PathStep,
	TrackType,
} from './types.ts';

export const TRACK_DIRECTIONS: Record<TrackType, [Direction, Direction]> = {
	'straight-h': ['E', 'W'],
	'straight-v': ['N', 'S'],
	'curve-ne': ['N', 'E'],
	'curve-nw': ['N', 'W'],
	'curve-se': ['S', 'E'],
	'curve-sw': ['S', 'W'],
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
	N: 'S',
	S: 'N',
	E: 'W',
	W: 'E',
};

export const DIRECTION_DELTA: Record<Direction, { dRow: number; dCol: number }> = {
	N: { dRow: -1, dCol: 0 },
	E: { dRow: 0, dCol: 1 },
	S: { dRow: 1, dCol: 0 },
	W: { dRow: 0, dCol: -1 },
};

export const ALL_TRACK_TYPES: TrackType[] = [
	'straight-h',
	'straight-v',
	'curve-ne',
	'curve-nw',
	'curve-se',
	'curve-sw',
];

const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];

export function isTrackType(state: CellState): state is TrackType {
	return (
		state === 'straight-h' ||
		state === 'straight-v' ||
		state === 'curve-ne' ||
		state === 'curve-nw' ||
		state === 'curve-se' ||
		state === 'curve-sw'
	);
}

export function isTrackOrCandidate(state: CellState): boolean {
	return state === 'candidate' || isTrackType(state);
}

export function getFixedCell(board: BoardState, row: number, col: number): FixedCell | undefined {
	return board.fixedCells.find((f) => f.row === row && f.col === col);
}

export function getTrackTypeFromDirections(d1: Direction, d2: Direction): TrackType | null {
	if (d1 === d2) {
		return null;
	}
	for (const trackType of ALL_TRACK_TYPES) {
		const [a, b] = TRACK_DIRECTIONS[trackType];
		if ((a === d1 && b === d2) || (a === d2 && b === d1)) {
			return trackType;
		}
	}
	return null;
}

export function getDirectionBetween(fromRow: number, fromCol: number, toRow: number, toCol: number): Direction | null {
	const dRow = toRow - fromRow;
	const dCol = toCol - fromCol;
	if (dRow === -1 && dCol === 0) return 'N';
	if (dRow === 0 && dCol === 1) return 'E';
	if (dRow === 1 && dCol === 0) return 'S';
	if (dRow === 0 && dCol === -1) return 'W';
	return null;
}

function getGateDirectionsAt(board: BoardState, row: number, col: number): Direction[] {
	const gates: Direction[] = [];
	if (board.start.row === row && board.start.col === col) {
		gates.push(board.start.side);
	}
	if (board.end.row === row && board.end.col === col && !gates.includes(board.end.side)) {
		gates.push(board.end.side);
	}
	return gates;
}

/**
 * Infers the best TrackType for a cell based on its gate sides and orthogonal neighbors.
 */
export function inferCellTrackType(board: BoardState, row: number, col: number): TrackType | null {
	if (row < 0 || row >= board.size || col < 0 || col >= board.size) {
		return null;
	}

	const fixed = getFixedCell(board, row, col);
	if (fixed) {
		return fixed.track;
	}

	const reciprocalDirs: Direction[] = [...getGateDirectionsAt(board, row, col)];
	const candidateDirs: Direction[] = [];

	for (const dir of DIRECTIONS) {
		if (reciprocalDirs.includes(dir)) continue;
		const nRow = row + DIRECTION_DELTA[dir].dRow;
		const nCol = col + DIRECTION_DELTA[dir].dCol;
		if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) {
			continue;
		}
		const nState = board.grid[nRow]?.[nCol];
		if (!nState || !isTrackOrCandidate(nState)) {
			continue;
		}
		const opp = OPPOSITE_DIRECTION[dir];
		if (isTrackType(nState) && TRACK_DIRECTIONS[nState].includes(opp)) {
			reciprocalDirs.push(dir);
		} else {
			const fixedNeighbor = getFixedCell(board, nRow, nCol);
			if (fixedNeighbor && !TRACK_DIRECTIONS[fixedNeighbor.track].includes(opp)) {
				continue;
			}
			candidateDirs.push(dir);
		}
	}

	const combined = [...reciprocalDirs, ...candidateDirs];
	if (combined.length >= 2) {
		return getTrackTypeFromDirections(combined[0], combined[1]);
	}
	if (combined.length === 1) {
		return combined[0] === 'N' || combined[0] === 'S' ? 'straight-v' : 'straight-h';
	}
	return 'straight-h';
}

/**
 * Updates non-fixed 'candidate' cells or TrackType cells whose connected orthogonal neighbors changed.
 */
export function autoOrientBoardTracks(board: BoardState): BoardState {
	const nextGrid: CellState[][] = board.grid.map((row) => [...row]);

	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			const fixed = getFixedCell(board, r, c);
			if (fixed) {
				nextGrid[r][c] = fixed.track;
			}
		}
	}

	let changed = true;
	let iterations = 0;
	const maxIterations = board.size * board.size + 2;

	while (changed && iterations < maxIterations) {
		changed = false;
		iterations++;

		for (let r = 0; r < board.size; r++) {
			for (let c = 0; c < board.size; c++) {
				if (getFixedCell(board, r, c)) {
					continue;
				}

				const state = nextGrid[r][c];
				if (!isTrackOrCandidate(state)) {
					continue;
				}

				const activeDirs: Direction[] = [...getGateDirectionsAt(board, r, c)];
				const openDirs: Direction[] = [...activeDirs];
				const reciprocalDirs: Direction[] = [...activeDirs];

				for (const dir of DIRECTIONS) {
					if (activeDirs.includes(dir)) continue;
					const nRow = r + DIRECTION_DELTA[dir].dRow;
					const nCol = c + DIRECTION_DELTA[dir].dCol;
					if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) {
						continue;
					}
					const nState = nextGrid[nRow][nCol];
					if (!isTrackOrCandidate(nState)) {
						continue;
					}
					const opp = OPPOSITE_DIRECTION[dir];
					const fixedNeighbor = getFixedCell(board, nRow, nCol);
					if (fixedNeighbor && !TRACK_DIRECTIONS[fixedNeighbor.track].includes(opp)) {
						continue;
					}
					activeDirs.push(dir);
					if (isTrackType(nState)) {
						if (TRACK_DIRECTIONS[nState].includes(opp)) {
							openDirs.push(dir);
							reciprocalDirs.push(dir);
						}
					} else {
						openDirs.push(dir);
					}
				}

				if (isTrackType(state)) {
					const [d1, d2] = TRACK_DIRECTIONS[state];
					if (activeDirs.includes(d1) && activeDirs.includes(d2)) {
						continue;
					}
					let inferred: TrackType | null = null;
					if (reciprocalDirs.length === 2) {
						inferred = getTrackTypeFromDirections(reciprocalDirs[0], reciprocalDirs[1]);
					} else if (openDirs.length === 2) {
						inferred = getTrackTypeFromDirections(openDirs[0], openDirs[1]);
					} else if (activeDirs.length === 2) {
						inferred = getTrackTypeFromDirections(activeDirs[0], activeDirs[1]);
					} else if (activeDirs.length === 1 && !activeDirs.includes(d1) && !activeDirs.includes(d2)) {
						inferred = activeDirs[0] === 'N' || activeDirs[0] === 'S' ? 'straight-v' : 'straight-h';
					}
					if (inferred && inferred !== state) {
						nextGrid[r][c] = inferred;
						changed = true;
					}
				} else if (state === 'candidate') {
					let inferred: TrackType | null = null;
					if (reciprocalDirs.length === 2) {
						inferred = getTrackTypeFromDirections(reciprocalDirs[0], reciprocalDirs[1]);
					} else if (openDirs.length === 2) {
						inferred = getTrackTypeFromDirections(openDirs[0], openDirs[1]);
					} else if (activeDirs.length === 2) {
						inferred = getTrackTypeFromDirections(activeDirs[0], activeDirs[1]);
					}
					if (inferred) {
						nextGrid[r][c] = inferred;
						changed = true;
					}
				}
			}
		}
	}

	return {
		...board,
		grid: nextGrid,
	};
}

function findSecondaryDirection(board: BoardState, row: number, col: number, primaryDir: Direction): Direction {
	const currentState = board.grid[row]?.[col];
	const gateDirs = getGateDirectionsAt(board, row, col).filter((d) => d !== primaryDir);

	if (isTrackType(currentState)) {
		const [d1, d2] = TRACK_DIRECTIONS[currentState];
		// First check if an existing direction is a gate or has a reciprocal track neighbor
		for (const existingDir of [d1, d2]) {
			if (existingDir === primaryDir) continue;
			if (gateDirs.includes(existingDir)) {
				return existingDir;
			}
			const nRow = row + DIRECTION_DELTA[existingDir].dRow;
			const nCol = col + DIRECTION_DELTA[existingDir].dCol;
			if (nRow >= 0 && nRow < board.size && nCol >= 0 && nCol < board.size) {
				const nState = board.grid[nRow][nCol];
				if (isTrackType(nState) && TRACK_DIRECTIONS[nState].includes(OPPOSITE_DIRECTION[existingDir])) {
					return existingDir;
				}
			}
		}
		// Fallback to candidate neighbor in existing direction
		for (const existingDir of [d1, d2]) {
			if (existingDir === primaryDir) continue;
			const nRow = row + DIRECTION_DELTA[existingDir].dRow;
			const nCol = col + DIRECTION_DELTA[existingDir].dCol;
			if (nRow >= 0 && nRow < board.size && nCol >= 0 && nCol < board.size) {
				const nState = board.grid[nRow][nCol];
				if (nState === 'candidate') {
					return existingDir;
				}
			}
		}
	}

	if (gateDirs.length > 0) {
		return gateDirs[0];
	}

	// Prefer neighbor with reciprocal track opening
	for (const dir of DIRECTIONS) {
		if (dir === primaryDir) continue;
		const nRow = row + DIRECTION_DELTA[dir].dRow;
		const nCol = col + DIRECTION_DELTA[dir].dCol;
		if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) continue;
		const nState = board.grid[nRow][nCol];
		if (isTrackType(nState) && TRACK_DIRECTIONS[nState].includes(OPPOSITE_DIRECTION[dir])) {
			return dir;
		}
	}

	// Next prefer candidate neighbor
	for (const dir of DIRECTIONS) {
		if (dir === primaryDir) continue;
		const nRow = row + DIRECTION_DELTA[dir].dRow;
		const nCol = col + DIRECTION_DELTA[dir].dCol;
		if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) continue;
		const nState = board.grid[nRow][nCol];
		if (nState === 'candidate') {
			return dir;
		}
	}

	return OPPOSITE_DIRECTION[primaryDir];
}

/**
 * Connects (prevRow, prevCol) and (currRow, currCol) orthogonally, setting both cells to tracks
 * and orienting prev and curr accurately.
 */
export function applyDragStep(
	board: BoardState,
	prevRow: number,
	prevCol: number,
	currRow: number,
	currCol: number,
): BoardState {
	if (
		prevRow < 0 ||
		prevRow >= board.size ||
		prevCol < 0 ||
		prevCol >= board.size ||
		currRow < 0 ||
		currRow >= board.size ||
		currCol < 0 ||
		currCol >= board.size
	) {
		return board;
	}

	const dir = getDirectionBetween(prevRow, prevCol, currRow, currCol);
	if (!dir) {
		return board;
	}

	const oppDir = OPPOSITE_DIRECTION[dir];
	const nextGrid: CellState[][] = board.grid.map((row) => [...row]);

	const fixedPrev = getFixedCell(board, prevRow, prevCol);
	if (fixedPrev) {
		nextGrid[prevRow][prevCol] = fixedPrev.track;
	} else {
		const prevOtherDir = findSecondaryDirection(board, prevRow, prevCol, dir);
		const prevTrack = getTrackTypeFromDirections(dir, prevOtherDir);
		if (prevTrack) {
			nextGrid[prevRow][prevCol] = prevTrack;
		}
	}

	const tempBoard: BoardState = {
		...board,
		grid: nextGrid,
	};

	const fixedCurr = getFixedCell(tempBoard, currRow, currCol);
	if (fixedCurr) {
		nextGrid[currRow][currCol] = fixedCurr.track;
	} else {
		const currOtherDir = findSecondaryDirection(tempBoard, currRow, currCol, oppDir);
		const currTrack = getTrackTypeFromDirections(oppDir, currOtherDir);
		if (currTrack) {
			nextGrid[currRow][currCol] = currTrack;
		}
	}

	return {
		...board,
		grid: nextGrid,
	};
}

export function evaluateLines(board: BoardState): {
	rows: LineEvaluation[];
	cols: LineEvaluation[];
} {
	const rows: LineEvaluation[] = [];
	const cols: LineEvaluation[] = [];

	for (let r = 0; r < board.size; r++) {
		let current = 0;
		for (let c = 0; c < board.size; c++) {
			if (isTrackOrCandidate(board.grid[r]?.[c])) {
				current++;
			}
		}
		const target = board.rowClues[r] ?? 0;
		const status: LineStatus = current < target ? 'under' : current === target ? 'satisfied' : 'overflow';
		rows.push({ current, target, status });
	}

	for (let c = 0; c < board.size; c++) {
		let current = 0;
		for (let r = 0; r < board.size; r++) {
			if (isTrackOrCandidate(board.grid[r]?.[c])) {
				current++;
			}
		}
		const target = board.colClues[c] ?? 0;
		const status: LineStatus = current < target ? 'under' : current === target ? 'satisfied' : 'overflow';
		cols.push({ current, target, status });
	}

	return { rows, cols };
}

export function evaluateBoard(board: BoardState): BoardEvaluation {
	const { rows, cols } = evaluateLines(board);
	const totalLines = board.size * 2;
	const satisfiedLines =
		rows.filter((r) => r.status === 'satisfied').length + cols.filter((c) => c.status === 'satisfied').length;

	const errorCells = new Set<string>();

	// 1. Check fixed cells integrity
	for (const fixed of board.fixedCells) {
		const state = board.grid[fixed.row]?.[fixed.col];
		if (state !== fixed.track) {
			errorCells.add(`${fixed.row},${fixed.col}`);
		}
	}

	// 2. Mark cells in overflowing rows or columns
	for (let r = 0; r < board.size; r++) {
		if (rows[r].status === 'overflow') {
			for (let c = 0; c < board.size; c++) {
				if (isTrackOrCandidate(board.grid[r][c])) {
					errorCells.add(`${r},${c}`);
				}
			}
		}
	}
	for (let c = 0; c < board.size; c++) {
		if (cols[c].status === 'overflow') {
			for (let r = 0; r < board.size; r++) {
				if (isTrackOrCandidate(board.grid[r][c])) {
					errorCells.add(`${r},${c}`);
				}
			}
		}
	}

	// 3. Check individual track piece connections for invalid border crashes or cross collisions
	let totalTrackOrCandidateCells = 0;
	let totalTrackCells = 0;

	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			const state = board.grid[r][c];
			if (isTrackOrCandidate(state)) {
				totalTrackOrCandidateCells++;
			}
			if (!isTrackType(state)) {
				continue;
			}
			totalTrackCells++;

			const dirs = TRACK_DIRECTIONS[state];
			if (r === board.start.row && c === board.start.col && !dirs.includes(board.start.side)) {
				errorCells.add(`${r},${c}`);
			}
			if (r === board.end.row && c === board.end.col && !dirs.includes(board.end.side)) {
				errorCells.add(`${r},${c}`);
			}

			for (const dir of dirs) {
				const isStartGate = r === board.start.row && c === board.start.col && dir === board.start.side;
				const isEndGate = r === board.end.row && c === board.end.col && dir === board.end.side;
				if (isStartGate || isEndGate) {
					continue;
				}
				const nRow = r + DIRECTION_DELTA[dir].dRow;
				const nCol = c + DIRECTION_DELTA[dir].dCol;
				if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) {
					errorCells.add(`${r},${c}`);
					continue;
				}
				const nState = board.grid[nRow][nCol];
				if (nState === 'cross') {
					errorCells.add(`${r},${c}`);
				}
			}
		}
	}

	// 4. Walk path from start gate to end gate
	const orderedPath: PathStep[] = [];
	const visited = new Set<string>();
	let currRow = board.start.row;
	let currCol = board.start.col;
	let enterFrom: Direction = board.start.side;
	let reachedEnd = false;

	while (currRow >= 0 && currRow < board.size && currCol >= 0 && currCol < board.size) {
		const key = `${currRow},${currCol}`;
		if (visited.has(key)) {
			errorCells.add(key);
			break;
		}
		const state = board.grid[currRow][currCol];
		if (!isTrackType(state)) {
			break;
		}
		const [d1, d2] = TRACK_DIRECTIONS[state];
		if (d1 !== enterFrom && d2 !== enterFrom) {
			errorCells.add(key);
			break;
		}
		const exitTo: Direction = d1 === enterFrom ? d2 : d1;
		visited.add(key);
		orderedPath.push({
			row: currRow,
			col: currCol,
			track: state,
			enterFrom,
			exitTo,
		});

		if (currRow === board.end.row && currCol === board.end.col && exitTo === board.end.side) {
			reachedEnd = true;
			break;
		}

		const isStartGateExit =
			currRow === board.start.row && currCol === board.start.col && exitTo === board.start.side;
		if (isStartGateExit) {
			errorCells.add(key);
			break;
		}

		currRow += DIRECTION_DELTA[exitTo].dRow;
		currCol += DIRECTION_DELTA[exitTo].dCol;
		enterFrom = OPPOSITE_DIRECTION[exitTo];
	}

	// 5. If path reached end (or all clues met), any unvisited track/candidate cell is an isolated extra segment
	if (reachedEnd && totalTrackOrCandidateCells > orderedPath.length) {
		for (let r = 0; r < board.size; r++) {
			for (let c = 0; c < board.size; c++) {
				if (isTrackOrCandidate(board.grid[r][c]) && !visited.has(`${r},${c}`)) {
					errorCells.add(`${r},${c}`);
				}
			}
		}
	}

	const allFixedVisited = board.fixedCells.every(
		(f) => visited.has(`${f.row},${f.col}`) && board.grid[f.row]?.[f.col] === f.track,
	);

	const isComplete =
		reachedEnd &&
		satisfiedLines === totalLines &&
		orderedPath.length === totalTrackOrCandidateCells &&
		totalTrackCells === totalTrackOrCandidateCells &&
		allFixedVisited &&
		errorCells.size === 0;

	return {
		rows,
		cols,
		satisfiedLines,
		totalLines,
		isComplete,
		orderedPath,
		errorCells,
	};
}

export function checkVictory(board: BoardState): boolean {
	return evaluateBoard(board).isComplete;
}
