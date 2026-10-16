import type { Direction, PathStep, StaticPuzzleDefinition, TrackType } from './types.ts';
import { DIRECTION_DELTA, OPPOSITE_DIRECTION, TRACK_DIRECTIONS, getTrackTypeFromDirections } from './validator.ts';

type SolvablePuzzle = Pick<StaticPuzzleDefinition, 'size' | 'rowClues' | 'colClues' | 'start' | 'end' | 'fixedCells'>;

const DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];

interface InternalSolveOptions {
	maxSolutions: number;
	maxNodes?: number;
}

interface InternalSolveResult {
	count: number;
	firstSolution: PathStep[] | null;
	aborted: boolean;
}

function runSolver(puzzle: SolvablePuzzle, options: InternalSolveOptions): InternalSolveResult {
	const { size, rowClues, colClues, start, end, fixedCells } = puzzle;

	if (rowClues.length !== size || colClues.length !== size) {
		return { count: 0, firstSolution: null, aborted: false };
	}

	let totalRowClues = 0;
	let totalColClues = 0;
	for (let i = 0; i < size; i++) {
		if (rowClues[i] < 0 || rowClues[i] > size || colClues[i] < 0 || colClues[i] > size) {
			return { count: 0, firstSolution: null, aborted: false };
		}
		totalRowClues += rowClues[i];
		totalColClues += colClues[i];
	}

	if (totalRowClues !== totalColClues || totalRowClues < 2) {
		return { count: 0, firstSolution: null, aborted: false };
	}

	const totalSteps = totalRowClues;

	// Lookup table for fixed cells: fixedGrid[r * size + c] = track or null
	const fixedGrid: (TrackType | null)[] = new Array(size * size).fill(null);
	for (const f of fixedCells) {
		if (f.row < 0 || f.row >= size || f.col < 0 || f.col >= size) {
			return { count: 0, firstSolution: null, aborted: false };
		}
		const idx = f.row * size + f.col;
		if (fixedGrid[idx] !== null && fixedGrid[idx] !== f.track) {
			return { count: 0, firstSolution: null, aborted: false };
		}
		fixedGrid[idx] = f.track;
	}

	// Verify start and end fixed tracks if present
	const startIdx = start.row * size + start.col;
	const endIdx = end.row * size + end.col;
	if (startIdx === endIdx) {
		return { count: 0, firstSolution: null, aborted: false };
	}

	const fixedStart = fixedGrid[startIdx];
	if (fixedStart && !TRACK_DIRECTIONS[fixedStart].includes(start.side)) {
		return { count: 0, firstSolution: null, aborted: false };
	}
	const fixedEndGate = fixedGrid[endIdx];
	if (fixedEndGate && !TRACK_DIRECTIONS[fixedEndGate].includes(end.side)) {
		return { count: 0, firstSolution: null, aborted: false };
	}

	// Precompute required neighbor coordinates for each fixed cell
	interface FixedRequirement {
		row: number;
		col: number;
		idx: number;
		track: TrackType;
		neighbors: number[]; // indices of required in-grid neighbors
	}

	const uniqueFixed: FixedRequirement[] = [];
	const seenFixed = new Set<number>();

	for (const f of fixedCells) {
		const idx = f.row * size + f.col;
		if (seenFixed.has(idx)) continue;
		seenFixed.add(idx);

		const dirs = TRACK_DIRECTIONS[f.track];
		const neighbors: number[] = [];
		for (const dir of dirs) {
			if (idx === startIdx && dir === start.side) continue;
			if (idx === endIdx && dir === end.side) continue;
			const nr = f.row + DIRECTION_DELTA[dir].dRow;
			const nc = f.col + DIRECTION_DELTA[dir].dCol;
			if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
				return { count: 0, firstSolution: null, aborted: false };
			}
			if (rowClues[nr] === 0 || colClues[nc] === 0) {
				return { count: 0, firstSolution: null, aborted: false };
			}
			neighbors.push(nr * size + nc);
		}
		uniqueFixed.push({
			row: f.row,
			col: f.col,
			idx,
			track: f.track,
			neighbors,
		});
	}

	// Reserve cells that MUST be visited: all unique fixed cells plus start and end
	const isReserved = new Uint8Array(size * size);
	const reservedInRow = new Int8Array(size);
	const reservedInCol = new Int8Array(size);

	const markReserved = (r: number, c: number) => {
		const idx = r * size + c;
		if (!isReserved[idx]) {
			isReserved[idx] = 1;
			reservedInRow[r]++;
			reservedInCol[c]++;
		}
	};

	markReserved(start.row, start.col);
	markReserved(end.row, end.col);
	for (const f of uniqueFixed) {
		markReserved(f.row, f.col);
	}

	const remRow = new Int8Array(rowClues);
	const remCol = new Int8Array(colClues);

	for (let i = 0; i < size; i++) {
		if (remRow[i] < reservedInRow[i] || remCol[i] < reservedInCol[i]) {
			return { count: 0, firstSolution: null, aborted: false };
		}
	}

	const visited = new Uint8Array(size * size);
	const pathRows = new Int8Array(totalSteps);
	const pathCols = new Int8Array(totalSteps);
	const pathEnter = new Array<Direction>(totalSteps);
	const pathExit = new Array<Direction>(totalSteps);

	let solutionsCount = 0;
	let firstSolution: PathStep[] | null = null;
	let nodesVisited = 0;
	let aborted = false;

	// Enter start cell
	visited[startIdx] = 1;
	remRow[start.row]--;
	remCol[start.col]--;
	reservedInRow[start.row]--;
	reservedInCol[start.col]--;

	pathRows[0] = start.row;
	pathCols[0] = start.col;
	pathEnter[0] = start.side;

	function isBoardFeasible(currIdx: number, stepsRemaining: number): boolean {
		// Check unvisited fixed cells: their required neighbors must either be currIdx or unvisited with rem > 0
		for (let i = 0; i < uniqueFixed.length; i++) {
			const f = uniqueFixed[i];
			if (visited[f.idx]) continue;
			for (let j = 0; j < f.neighbors.length; j++) {
				const nIdx = f.neighbors[j];
				if (visited[nIdx]) {
					if (nIdx !== currIdx) {
						return false;
					}
				} else {
					const nr = (nIdx / size) | 0;
					const nc = nIdx % size;
					if (remRow[nr] <= 0 || remCol[nc] <= 0) {
						return false;
					}
				}
			}
		}

		// If stepsRemaining > 1, endIdx must still have at least 1 valid entry neighbor (or be currIdx's neighbor when stepsRemaining === 1)
		if (stepsRemaining > 1) {
			let endHasEntry = false;
			const endFixed = fixedGrid[endIdx];
			for (let d = 0; d < 4; d++) {
				const dir = DIRECTIONS[d];
				if (dir === end.side) continue;
				if (endFixed && !TRACK_DIRECTIONS[endFixed].includes(dir)) continue;
				const nr = end.row + DIRECTION_DELTA[dir].dRow;
				const nc = end.col + DIRECTION_DELTA[dir].dCol;
				if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
				const nIdx = nr * size + nc;
				if (nIdx === currIdx || (!visited[nIdx] && remRow[nr] > 0 && remCol[nc] > 0)) {
					endHasEntry = true;
					break;
				}
			}
			if (!endHasEntry) return false;
		}

		// Check row/col available cells vs remaining clues
		for (let r = 0; r < size; r++) {
			const need = remRow[r];
			if (need <= 0) continue;
			let avail = 0;
			const rowOffset = r * size;
			for (let c = 0; c < size; c++) {
				if (!visited[rowOffset + c] && remCol[c] > 0) {
					avail++;
				}
			}
			if (avail < need) return false;
		}

		for (let c = 0; c < size; c++) {
			const need = remCol[c];
			if (need <= 0) continue;
			let avail = 0;
			for (let r = 0; r < size; r++) {
				if (!visited[r * size + c] && remRow[r] > 0) {
					avail++;
				}
			}
			if (avail < need) return false;
		}

		return true;
	}

	function dfs(stepIndex: number, r: number, c: number, enterFrom: Direction): void {
		if (aborted || solutionsCount >= options.maxSolutions) {
			return;
		}
		nodesVisited++;
		if (options.maxNodes !== undefined && nodesVisited > options.maxNodes) {
			aborted = true;
			return;
		}

		const currIdx = r * size + c;
		const stepsRemaining = totalSteps - 1 - stepIndex;

		if (stepsRemaining === 0) {
			if (currIdx !== endIdx) return;
			const fixedEnd = fixedGrid[endIdx];
			if (fixedEnd) {
				const [d1, d2] = TRACK_DIRECTIONS[fixedEnd];
				const exitDir = d1 === enterFrom ? d2 : d1;
				if (exitDir !== end.side) return;
			}
			pathExit[stepIndex] = end.side;

			solutionsCount++;
			if (!firstSolution) {
				const sol: PathStep[] = [];
				for (let i = 0; i < totalSteps; i++) {
					const track = getTrackTypeFromDirections(pathEnter[i], pathExit[i]);
					if (!track) return;
					sol.push({
						row: pathRows[i],
						col: pathCols[i],
						track,
						enterFrom: pathEnter[i],
						exitTo: pathExit[i],
					});
				}
				firstSolution = sol;
			}
			return;
		}

		// Manhattan distance check to end
		const distToEnd = Math.abs(r - end.row) + Math.abs(c - end.col);
		if (distToEnd > stepsRemaining) {
			return;
		}

		if (!isBoardFeasible(currIdx, stepsRemaining)) {
			return;
		}

		// Determine allowed exit directions from (r, c)
		const currFixed = fixedGrid[currIdx];
		let forcedSingleDir: Direction | null = null;
		if (currFixed) {
			const [d1, d2] = TRACK_DIRECTIONS[currFixed];
			forcedSingleDir = d1 === enterFrom ? d2 : d1;
		}

		// Also check if any unvisited fixed cell is adjacent to currIdx and requires currIdx as a neighbor!
		for (let i = 0; i < uniqueFixed.length; i++) {
			const f = uniqueFixed[i];
			if (visited[f.idx]) continue;
			if (f.neighbors.includes(currIdx)) {
				// We MUST step into f.idx on this move!
				const dRow = f.row - r;
				const dCol = f.col - c;
				let reqDir: Direction | null = null;
				if (dRow === -1 && dCol === 0) reqDir = 'N';
				else if (dRow === 0 && dCol === 1) reqDir = 'E';
				else if (dRow === 1 && dCol === 0) reqDir = 'S';
				else if (dRow === 0 && dCol === -1) reqDir = 'W';

				if (!reqDir) return;
				if (forcedSingleDir !== null && forcedSingleDir !== reqDir) {
					return;
				}
				forcedSingleDir = reqDir;
			}
		}

		for (let d = 0; d < 4; d++) {
			const exitDir = DIRECTIONS[d];
			if (exitDir === enterFrom) continue;
			if (forcedSingleDir !== null && exitDir !== forcedSingleDir) continue;

			const nr = r + DIRECTION_DELTA[exitDir].dRow;
			const nc = c + DIRECTION_DELTA[exitDir].dCol;
			if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;

			const nextIdx = nr * size + nc;
			if (visited[nextIdx]) continue;

			// endIdx can ONLY be entered on the very last move (stepsRemaining === 1)
			if (nextIdx === endIdx && stepsRemaining > 1) continue;
			if (nextIdx !== endIdx && stepsRemaining === 1) continue;

			const nextIsReserved = isReserved[nextIdx] === 1;
			if (nextIsReserved) {
				if (remRow[nr] < reservedInRow[nr] || remCol[nc] < reservedInCol[nc]) {
					continue;
				}
			} else {
				if (remRow[nr] <= reservedInRow[nr] || remCol[nc] <= reservedInCol[nc]) {
					continue;
				}
			}

			const nextEnter = OPPOSITE_DIRECTION[exitDir];
			const nextFixed = fixedGrid[nextIdx];
			if (nextFixed) {
				const [fd1, fd2] = TRACK_DIRECTIONS[nextFixed];
				if (fd1 !== nextEnter && fd2 !== nextEnter) {
					continue;
				}
			}

			if (nextIdx === endIdx && nextEnter === end.side) {
				continue;
			}

			// Step into (nr, nc)
			visited[nextIdx] = 1;
			remRow[nr]--;
			remCol[nc]--;
			if (nextIsReserved) {
				reservedInRow[nr]--;
				reservedInCol[nc]--;
			}

			pathExit[stepIndex] = exitDir;
			pathRows[stepIndex + 1] = nr;
			pathCols[stepIndex + 1] = nc;
			pathEnter[stepIndex + 1] = nextEnter;

			dfs(stepIndex + 1, nr, nc, nextEnter);

			// Backtrack
			if (nextIsReserved) {
				reservedInRow[nr]++;
				reservedInCol[nc]++;
			}
			remRow[nr]++;
			remCol[nc]++;
			visited[nextIdx] = 0;

			if (aborted || solutionsCount >= options.maxSolutions) {
				return;
			}
		}
	}

	dfs(0, start.row, start.col, start.side);

	return {
		count: solutionsCount,
		firstSolution,
		aborted,
	};
}

export function solveTracksPuzzle(puzzle: SolvablePuzzle): PathStep[] | null {
	return runSolver(puzzle, { maxSolutions: 1 }).firstSolution;
}

export function countTracksSolutions(puzzle: SolvablePuzzle, maxSolutions = 2, maxNodes?: number): number {
	const result = runSolver(puzzle, { maxSolutions, maxNodes });
	if (result.aborted) {
		return maxSolutions;
	}
	return result.count;
}

export function hasUniqueSolution(puzzle: SolvablePuzzle, maxNodes?: number): boolean {
	return countTracksSolutions(puzzle, 2, maxNodes) === 1;
}
