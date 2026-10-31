import { countPorts, rotateCW } from './rotator.ts';
import {
	ALL_DIRECTIONS,
	type Board,
	type Cell,
	DIFFICULTY_CONFIGS,
	DIRECTION_DELTAS,
	type Difficulty,
	type Direction,
	type GameSnapshot,
	OPPOSITE_DIRECTIONS,
	type PortMask,
} from './types.ts';
import { updateBoardPoweredState } from './validator.ts';

interface EdgeCandidate {
	fromR: number;
	fromC: number;
	toR: number;
	toC: number;
	dirFrom: Direction;
	dirTo: Direction;
}

/**
 * Procedurally generates a solvable Net puzzle spanning tree via randomized Prim's algorithm.
 * Guarantees 100% reachability from the root node with zero initial cycles.
 */
export function generateNetPuzzle(difficulty: Difficulty, randomFn: () => number = Math.random): Board {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const { rows, cols } = config;
	const totalCells = rows * cols;

	const rootRow = Math.floor(rows / 2);
	const rootCol = Math.floor(cols / 2);

	const solutionMasks: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

	const inTree = new Uint8Array(totalCells);
	inTree[rootRow * cols + rootCol] = 1;
	let treeCount = 1;

	const candidateEdges: EdgeCandidate[] = [];

	// Add edges from root
	function addCandidateEdgesFor(r: number, c: number) {
		for (const dir of ALL_DIRECTIONS) {
			const { dr, dc } = DIRECTION_DELTAS[dir];
			const nr = r + dr;
			const nc = c + dc;
			if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
				const nIdx = nr * cols + nc;
				if (!inTree[nIdx]) {
					candidateEdges.push({
						fromR: r,
						fromC: c,
						toR: nr,
						toC: nc,
						dirFrom: dir,
						dirTo: OPPOSITE_DIRECTIONS[dir],
					});
				}
			}
		}
	}

	addCandidateEdgesFor(rootRow, rootCol);

	while (treeCount < totalCells && candidateEdges.length > 0) {
		const randIdx = Math.floor(randomFn() * candidateEdges.length);
		const edge = candidateEdges[randIdx];

		// Fast swap-and-pop
		candidateEdges[randIdx] = candidateEdges[candidateEdges.length - 1];
		candidateEdges.pop();

		const toIdx = edge.toR * cols + edge.toC;
		if (inTree[toIdx]) {
			continue;
		}

		inTree[toIdx] = 1;
		treeCount++;

		solutionMasks[edge.fromR][edge.fromC] |= edge.dirFrom;
		solutionMasks[edge.toR][edge.toC] |= edge.dirTo;

		addCandidateEdgesFor(edge.toR, edge.toC);
	}

	// Shuffle the board with a minimum rotation distance
	const cells: Cell[][] = [];

	for (let r = 0; r < rows; r++) {
		const rowCells: Cell[] = [];
		for (let c = 0; c < cols; c++) {
			const solMask = solutionMasks[r][c];
			const isRoot = r === rootRow && c === rootCol;
			const ports = countPorts(solMask);

			let rotSteps = 0;
			if (ports === 4 || ports === 0) {
				// Cross or empty has 4-fold symmetry
				rotSteps = 0;
			} else if (ports === 2 && (solMask === 5 || solMask === 10)) {
				// Straight line has 2-fold symmetry (0 or 1 step)
				rotSteps = Math.floor(randomFn() * 2);
				// Bias towards rotating to ensure puzzle isn't pre-solved
				if (rotSteps === 0 && randomFn() < 0.75) {
					rotSteps = 1;
				}
			} else {
				// 4 orientations
				rotSteps = 1 + Math.floor(randomFn() * 3); // 1, 2, or 3 rotations
			}

			let currentMask = solMask;
			for (let i = 0; i < rotSteps; i++) {
				currentMask = rotateCW(currentMask);
			}

			rowCells.push({
				id: `cell-${r}-${c}`,
				row: r,
				col: c,
				isRoot,
				solutionMask: solMask,
				currentMask,
				rotation: rotSteps * 90,
				isPowered: false,
				isLocked: false,
			});
		}
		cells.push(rowCells);
	}

	const rawBoard: Board = {
		rows,
		cols,
		rootRow,
		rootCol,
		grid: cells,
	};

	return updateBoardPoweredState(rawBoard);
}

/**
 * Reconstructs a Board instance from a serialized GameSnapshot.
 */
export function createBoardFromSnapshot(snapshot: GameSnapshot): Board {
	const { rows, cols, rootRow, rootCol, cells } = snapshot;

	const grid: Cell[][] = Array.from({ length: rows }, (_, r) =>
		Array.from({ length: cols }, (_, c) => {
			const snap = cells.find((cell) => cell.row === r && cell.col === c);
			const solMask = snap?.solutionMask ?? 0;
			const curMask = snap?.currentMask ?? 0;
			const rot = snap?.rotation ?? 0;
			const locked = snap?.isLocked ?? false;

			return {
				id: `cell-${r}-${c}`,
				row: r,
				col: c,
				isRoot: r === rootRow && c === rootCol,
				solutionMask: solMask,
				currentMask: curMask,
				rotation: rot,
				isPowered: false,
				isLocked: locked,
			};
		}),
	);

	const rawBoard: Board = {
		rows,
		cols,
		rootRow,
		rootCol,
		grid,
	};

	return updateBoardPoweredState(rawBoard);
}
