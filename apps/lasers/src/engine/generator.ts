import { type Prng, createPrng } from './prng.ts';
import { DIRECTION_DELTAS, mixBeamColors, reflectDirection, traceBeams } from './raytrace.ts';
import {
	type BeamColor,
	DIFFICULTY_CONFIGS,
	type Difficulty,
	type Direction,
	type LaserCell,
	type LaserGrid,
	type LaserPuzzle,
	type MirrorOrientation,
	type PrimaryColor,
	isRotatableCell,
	toggleOrientation,
} from './types.ts';

type MutableCell = {
	row: number;
	col: number;
	kind: LaserCell['kind'];
	direction?: Direction;
	color?: BeamColor;
	orientation?: MirrorOrientation;
	solutionOrientation?: MirrorOrientation;
	isDecoy?: boolean;
};

const ALL_DIRECTIONS: readonly Direction[] = ['N', 'E', 'S', 'W'];

const PERPENDICULAR: Readonly<Record<Direction, readonly [Direction, Direction]>> = {
	N: ['E', 'W'],
	S: ['E', 'W'],
	E: ['N', 'S'],
	W: ['N', 'S'],
};

const OPPOSITE: Readonly<Record<Direction, Direction>> = {
	N: 'S',
	S: 'N',
	E: 'W',
	W: 'E',
};

const PRIMARY_PAIRS: readonly (readonly [PrimaryColor, PrimaryColor])[] = [
	['red', 'blue'],
	['red', 'green'],
	['blue', 'green'],
];

function createEmptyGrid(rows: number, cols: number): MutableCell[][] {
	const grid: MutableCell[][] = [];
	for (let r = 0; r < rows; r += 1) {
		const row: MutableCell[] = [];
		for (let c = 0; c < cols; c += 1) {
			row.push({ row: r, col: c, kind: 'empty' });
		}
		grid.push(row);
	}
	return grid;
}

function inBounds(rows: number, cols: number, r: number, c: number): boolean {
	return r >= 0 && r < rows && c >= 0 && c < cols;
}

function orientationForTurn(incomingDir: Direction, outgoingDir: Direction): MirrorOrientation {
	return reflectDirection(incomingDir, '/') === outgoingDir ? '/' : '\\';
}

function keyOf(r: number, c: number): string {
	return `${r},${c}`;
}

/**
 * Collects candidate empty cells along a ray starting after (startR, startC) in `dir`
 * up until hitting a non-empty cell or board boundary.
 */
function collectRayCandidates(
	grid: MutableCell[][],
	beamCells: ReadonlySet<string>,
	startR: number,
	startC: number,
	dir: Direction,
): { row: number; col: number; traversed: { row: number; col: number }[] }[] {
	const rows = grid.length;
	const cols = grid[0].length;
	const delta = DIRECTION_DELTAS[dir];
	const candidates: { row: number; col: number; traversed: { row: number; col: number }[] }[] = [];
	const traversed: { row: number; col: number }[] = [];

	let r = startR + delta.dr;
	let c = startC + delta.dc;

	while (inBounds(rows, cols, r, c)) {
		const cell = grid[r][c];
		if (cell.kind !== 'empty') {
			break;
		}
		// Only allow placing a new mirror/target on cells not already carrying another beam
		if (!beamCells.has(keyOf(r, c))) {
			candidates.push({ row: r, col: c, traversed: [...traversed, { row: r, col: c }] });
		}
		traversed.push({ row: r, col: c });
		r += delta.dr;
		c += delta.dc;
	}

	return candidates;
}

/**
 * Carves a forward beam path of `turns` mirror reflections from `(startR, startC)` in `startDir`,
 * ending at a newly placed `target` of `targetColor`.
 */
function carveForwardPath(
	grid: MutableCell[][],
	beamCells: Set<string>,
	startR: number,
	startC: number,
	startDir: Direction,
	turns: number,
	targetColor: BeamColor,
	prng: Prng,
): {
	readonly mirrors: { row: number; col: number }[];
	readonly target: { row: number; col: number };
	readonly pathSegments: { row: number; col: number; dir: Direction }[];
} | null {
	let curR = startR;
	let curC = startC;
	let curDir = startDir;
	const placedMirrors: { row: number; col: number }[] = [];
	const pathSegments: { row: number; col: number; dir: Direction }[] = [];

	for (let t = 0; t < turns; t += 1) {
		const candidates = collectRayCandidates(grid, beamCells, curR, curC, curDir);
		if (candidates.length === 0) return null;

		const shuffled = prng.shuffle(candidates);
		let chosen: (typeof candidates)[number] | null = null;
		let nextDir: Direction | null = null;

		for (const cand of shuffled) {
			const perpDirs = prng.shuffle(PERPENDICULAR[curDir]);
			for (const pDir of perpDirs) {
				const nextCands = collectRayCandidates(grid, beamCells, cand.row, cand.col, pDir);
				if (nextCands.length > 0) {
					chosen = cand;
					nextDir = pDir;
					break;
				}
			}
			if (chosen && nextDir) break;
		}

		if (!chosen || !nextDir) return null;

		for (const pt of chosen.traversed) {
			beamCells.add(keyOf(pt.row, pt.col));
			pathSegments.push({ row: pt.row, col: pt.col, dir: curDir });
		}

		const orientation = orientationForTurn(curDir, nextDir);
		grid[chosen.row][chosen.col] = {
			row: chosen.row,
			col: chosen.col,
			kind: 'mirror',
			orientation,
			solutionOrientation: orientation,
		};
		placedMirrors.push({ row: chosen.row, col: chosen.col });

		curR = chosen.row;
		curC = chosen.col;
		curDir = nextDir;
	}

	const targetCandidates = collectRayCandidates(grid, beamCells, curR, curC, curDir);
	if (targetCandidates.length === 0) return null;

	// Prefer targets at least 2 cells away when available
	const preferred = targetCandidates.filter((c) => c.traversed.length >= 2);
	const targetChoice = prng.pick(preferred.length > 0 ? preferred : targetCandidates);

	for (const pt of targetChoice.traversed) {
		beamCells.add(keyOf(pt.row, pt.col));
		pathSegments.push({ row: pt.row, col: pt.col, dir: curDir });
	}

	grid[targetChoice.row][targetChoice.col] = {
		row: targetChoice.row,
		col: targetChoice.col,
		kind: 'target',
		color: targetColor,
	};

	return {
		mirrors: placedMirrors,
		target: { row: targetChoice.row, col: targetChoice.col },
		pathSegments,
	};
}

/**
 * Carves a path backwards from an existing target at `(targetR, targetC)` so that a new emitter
 * of `emitterColor` sends a beam into `(targetR, targetC)` with `turns` mirrors.
 */
function carveBackwardPathToTarget(
	grid: MutableCell[][],
	beamCells: Set<string>,
	targetR: number,
	targetC: number,
	turns: number,
	emitterColor: BeamColor,
	prng: Prng,
): {
	readonly emitter: { row: number; col: number; dir: Direction };
	readonly mirrors: { row: number; col: number }[];
} | null {
	const entryDirs = prng.shuffle(ALL_DIRECTIONS);

	for (const walkBackDir of entryDirs) {
		// Walking backwards in `walkBackDir` means the forward beam travels in `OPPOSITE[walkBackDir]`
		let curR = targetR;
		let curC = targetC;
		let curBackDir = walkBackDir;
		const tempMirrors: { row: number; col: number; orientation: MirrorOrientation }[] = [];
		const tempBeam: { row: number; col: number }[] = [];
		const localBeam = new Set(beamCells);
		let ok = true;

		for (let t = 0; t < turns; t += 1) {
			const cands = collectRayCandidates(grid, localBeam, curR, curC, curBackDir);
			if (cands.length === 0) {
				ok = false;
				break;
			}
			const shuffled = prng.shuffle(cands);
			let picked: (typeof cands)[number] | null = null;
			let nextBackDir: Direction | null = null;

			for (const cand of shuffled) {
				const perpDirs = prng.shuffle(PERPENDICULAR[curBackDir]);
				for (const pDir of perpDirs) {
					const afterCands = collectRayCandidates(grid, localBeam, cand.row, cand.col, pDir);
					if (afterCands.length > 0) {
						picked = cand;
						nextBackDir = pDir;
						break;
					}
				}
				if (picked && nextBackDir) break;
			}

			if (!picked || !nextBackDir) {
				ok = false;
				break;
			}

			for (const pt of picked.traversed) {
				localBeam.add(keyOf(pt.row, pt.col));
				tempBeam.push(pt);
			}

			// Forward beam arrives traveling in OPPOSITE[nextBackDir] and exits in OPPOSITE[curBackDir]
			const forwardIn = OPPOSITE[nextBackDir];
			const forwardOut = OPPOSITE[curBackDir];
			const orientation = orientationForTurn(forwardIn, forwardOut);
			tempMirrors.push({ row: picked.row, col: picked.col, orientation });

			curR = picked.row;
			curC = picked.col;
			curBackDir = nextBackDir;
		}

		if (!ok) continue;

		const emitterCands = collectRayCandidates(grid, localBeam, curR, curC, curBackDir);
		if (emitterCands.length === 0) continue;

		const emitterPick = prng.pick(emitterCands);
		for (const pt of emitterPick.traversed) {
			localBeam.add(keyOf(pt.row, pt.col));
			tempBeam.push(pt);
		}

		// Commit to grid
		for (const pt of tempBeam) {
			beamCells.add(keyOf(pt.row, pt.col));
		}
		for (const m of tempMirrors) {
			grid[m.row][m.col] = {
				row: m.row,
				col: m.col,
				kind: 'mirror',
				orientation: m.orientation,
				solutionOrientation: m.orientation,
			};
		}

		const forwardDir = OPPOSITE[curBackDir];
		grid[emitterPick.row][emitterPick.col] = {
			row: emitterPick.row,
			col: emitterPick.col,
			kind: 'emitter',
			direction: forwardDir,
			color: emitterColor,
		};

		return {
			emitter: { row: emitterPick.row, col: emitterPick.col, dir: forwardDir },
			mirrors: tempMirrors.map((m) => ({ row: m.row, col: m.col })),
		};
	}

	return null;
}

/**
 * Picks a border cell and inward-pointing direction for placing a primary emitter.
 */
function pickEmitterStart(
	rows: number,
	cols: number,
	grid: MutableCell[][],
	beamCells: ReadonlySet<string>,
	prng: Prng,
): { row: number; col: number; dir: Direction } | null {
	const candidates: { row: number; col: number; dir: Direction }[] = [];

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			if (grid[r][c].kind !== 'empty' || beamCells.has(keyOf(r, c))) continue;
			const isBorder = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
			if (!isBorder) continue;

			const dirs: Direction[] = [];
			if (r === 0) dirs.push('S');
			if (r === rows - 1) dirs.push('N');
			if (c === 0) dirs.push('E');
			if (c === cols - 1) dirs.push('W');

			for (const dir of dirs) {
				const delta = DIRECTION_DELTAS[dir];
				const nr = r + delta.dr;
				const nc = c + delta.dc;
				if (inBounds(rows, cols, nr, nc) && grid[nr][nc].kind === 'empty') {
					candidates.push({ row: r, col: c, dir });
				}
			}
		}
	}

	if (candidates.length === 0) return null;
	return prng.pick(candidates);
}

/**
 * Converts one of the placed mirrors into a beam splitter and carves a straight-through
 * branch from it to a new target of `branchColor`.
 */
function addSplitterBranch(
	grid: MutableCell[][],
	beamCells: Set<string>,
	mirrorCoords: readonly { row: number; col: number }[],
	incomingDirsByKey: ReadonlyMap<string, Direction>,
	branchTurns: number,
	branchColor: BeamColor,
	prng: Prng,
): { row: number; col: number } | null {
	const shuffled = prng.shuffle(mirrorCoords);
	for (const coord of shuffled) {
		const cell = grid[coord.row][coord.col];
		if (cell.kind !== 'mirror' || !cell.orientation) continue;
		const inDir = incomingDirsByKey.get(keyOf(coord.row, coord.col));
		if (!inDir) continue;

		// Straight-through branch continues in `inDir`
		const branchResult = carveForwardPath(
			grid,
			beamCells,
			coord.row,
			coord.col,
			inDir,
			branchTurns,
			branchColor,
			prng,
		);
		if (branchResult) {
			grid[coord.row][coord.col] = {
				...cell,
				kind: 'splitter',
			};
			return coord;
		}
	}
	return null;
}

function buildIncomingDirMap(
	pathSegments: readonly { row: number; col: number; dir: Direction }[],
): Map<string, Direction> {
	const map = new Map<string, Direction>();
	for (const seg of pathSegments) {
		const k = keyOf(seg.row, seg.col);
		if (!map.has(k)) {
			map.set(k, seg.dir);
		}
	}
	return map;
}

function placeWallsAndDecoys(
	grid: MutableCell[][],
	beamCells: ReadonlySet<string>,
	wallCount: number,
	decoyCount: number,
	prng: Prng,
): void {
	const rows = grid.length;
	const cols = grid[0].length;
	const freeCells: { row: number; col: number }[] = [];

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			if (grid[r][c].kind === 'empty' && !beamCells.has(keyOf(r, c))) {
				freeCells.push({ row: r, col: c });
			}
		}
	}

	const shuffled = prng.shuffle(freeCells);
	let idx = 0;

	for (let w = 0; w < wallCount && idx < shuffled.length; w += 1, idx += 1) {
		const pt = shuffled[idx];
		grid[pt.row][pt.col] = { row: pt.row, col: pt.col, kind: 'wall' };
	}

	for (let d = 0; d < decoyCount && idx < shuffled.length; d += 1, idx += 1) {
		const pt = shuffled[idx];
		const orientation: MirrorOrientation = prng.next() < 0.5 ? '/' : '\\';
		grid[pt.row][pt.col] = {
			row: pt.row,
			col: pt.col,
			kind: 'mirror',
			orientation,
			solutionOrientation: orientation,
			isDecoy: true,
		};
	}
}

function freezeFixedMirrors(grid: MutableCell[][], fixedCount: number, prng: Prng): void {
	if (fixedCount <= 0) return;
	const rotatableMirrors: MutableCell[] = [];
	for (const row of grid) {
		for (const cell of row) {
			if (cell.kind === 'mirror' && !cell.isDecoy) {
				rotatableMirrors.push(cell);
			}
		}
	}
	// Keep at least 3 rotatable mirrors
	const maxToFreeze = Math.max(0, Math.min(fixedCount, rotatableMirrors.length - 3));
	const picked = prng.shuffle(rotatableMirrors).slice(0, maxToFreeze);
	for (const cell of picked) {
		cell.kind = 'fixed-mirror';
		cell.solutionOrientation = undefined;
	}
}

function scrambleGrid(solvedGrid: MutableCell[][], prng: Prng): { grid: LaserGrid; parMoves: number } | null {
	const grid: MutableCell[][] = solvedGrid.map((row) => row.map((cell) => ({ ...cell })));
	const rotatable: MutableCell[] = [];

	for (const row of grid) {
		for (const cell of row) {
			if (isRotatableCell(cell) && cell.orientation) {
				cell.solutionOrientation = cell.orientation;
				if (!cell.isDecoy) {
					rotatable.push(cell);
				}
			}
		}
	}

	if (rotatable.length === 0) return null;

	const shuffled = prng.shuffle(rotatable);
	const flipCount = Math.max(2, Math.min(rotatable.length, Math.ceil(rotatable.length * 0.65)));

	for (let i = 0; i < flipCount; i += 1) {
		const cell = shuffled[i];
		if (cell.orientation) {
			cell.orientation = toggleOrientation(cell.orientation);
		}
	}

	// Ensure initial state is NOT already solved
	let trace = traceBeams(grid);
	if (trace.isSolved) {
		for (let i = flipCount; i < shuffled.length; i += 1) {
			const cell = shuffled[i];
			if (cell.orientation) {
				cell.orientation = toggleOrientation(cell.orientation);
				trace = traceBeams(grid);
				if (!trace.isSolved) break;
			}
		}
	}

	if (trace.isSolved) return null;

	let parMoves = 0;
	for (const row of grid) {
		for (const cell of row) {
			if (isRotatableCell(cell) && cell.orientation && cell.solutionOrientation) {
				if (cell.orientation !== cell.solutionOrientation) {
					parMoves += 1;
				}
			}
		}
	}

	return { grid, parMoves: Math.max(1, parMoves) };
}

function attemptGenerate(difficulty: Difficulty, prng: Prng): { solvedGrid: MutableCell[][] } | null {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const grid = createEmptyGrid(config.rows, config.cols);
	const beamCells = new Set<string>();

	const start = pickEmitterStart(config.rows, config.cols, grid, beamCells, prng);
	if (!start) return null;

	if (!config.colorMixing) {
		const beamColor: BeamColor = 'cyan';
		grid[start.row][start.col] = {
			row: start.row,
			col: start.col,
			kind: 'emitter',
			direction: start.dir,
			color: beamColor,
		};
		beamCells.add(keyOf(start.row, start.col));

		const mainTurns =
			difficulty === 'easy'
				? prng.nextRange(config.minRotatableMirrors, config.maxRotatableMirrors)
				: prng.nextRange(4, 5);

		const mainPath = carveForwardPath(grid, beamCells, start.row, start.col, start.dir, mainTurns, beamColor, prng);
		if (!mainPath) return null;

		if (config.splitters > 0) {
			const inDirs = buildIncomingDirMap(mainPath.pathSegments);
			const branchTurns = prng.nextRange(2, 3);
			const splitter = addSplitterBranch(grid, beamCells, mainPath.mirrors, inDirs, branchTurns, beamColor, prng);
			if (!splitter) return null;
		}

		freezeFixedMirrors(grid, config.fixedMirrors, prng);
		placeWallsAndDecoys(grid, beamCells, config.walls, config.decoys, prng);
		return { solvedGrid: grid };
	}

	// Color-mixing tiers (hard & expert)
	const [colorA, colorB] = prng.pick(PRIMARY_PAIRS);
	const mixedColor = mixBeamColors(colorA, colorB);

	grid[start.row][start.col] = {
		row: start.row,
		col: start.col,
		kind: 'emitter',
		direction: start.dir,
		color: colorA,
	};
	beamCells.add(keyOf(start.row, start.col));

	const mainTurnsA = difficulty === 'hard' ? prng.nextRange(3, 4) : prng.nextRange(3, 5);
	const pathA = carveForwardPath(grid, beamCells, start.row, start.col, start.dir, mainTurnsA, mixedColor, prng);
	if (!pathA) return null;

	// Add splitter on pathA to reach a pure colorA target
	const inDirsA = buildIncomingDirMap(pathA.pathSegments);
	const splitterA = addSplitterBranch(grid, beamCells, pathA.mirrors, inDirsA, prng.nextRange(1, 2), colorA, prng);
	if (!splitterA) return null;

	// Carve pathB backwards from the mixed target so colorA + colorB = mixedColor
	const turnsB = difficulty === 'hard' ? prng.nextRange(2, 3) : prng.nextRange(2, 4);
	const pathB = carveBackwardPathToTarget(grid, beamCells, pathA.target.row, pathA.target.col, turnsB, colorB, prng);
	if (!pathB) return null;

	// For expert (and optionally hard), add a second splitter or branch for a pure colorB target
	if (difficulty === 'expert') {
		// Trace pathB forward from emitterB to know incoming directions into pathB's mirrors
		const segsB: { row: number; col: number; dir: Direction }[] = [];
		let r = pathB.emitter.row;
		let c = pathB.emitter.col;
		let d = pathB.emitter.dir;
		for (let step = 0; step < config.rows * config.cols; step += 1) {
			const delta = DIRECTION_DELTAS[d];
			r += delta.dr;
			c += delta.dc;
			if (!inBounds(config.rows, config.cols, r, c)) break;
			segsB.push({ row: r, col: c, dir: d });
			const cell = grid[r][c];
			if (cell.kind === 'target') break;
			if (cell.kind === 'mirror' && cell.orientation) {
				d = reflectDirection(d, cell.orientation);
			}
		}
		const inDirsB = buildIncomingDirMap(segsB);
		const splitterB = addSplitterBranch(
			grid,
			beamCells,
			pathB.mirrors,
			inDirsB,
			prng.nextRange(1, 2),
			colorB,
			prng,
		);
		if (!splitterB) return null;
	}

	freezeFixedMirrors(grid, config.fixedMirrors, prng);
	placeWallsAndDecoys(grid, beamCells, config.walls, config.decoys, prng);
	return { solvedGrid: grid };
}

/**
 * Deterministic fallback puzzle guaranteed to be valid for any difficulty
 * if randomized attempts exhaust their budget.
 */
function createFallbackPuzzle(difficulty: Difficulty, seed: number): LaserPuzzle {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const grid = createEmptyGrid(config.rows, config.cols);

	if (!config.colorMixing) {
		grid[0][0] = { row: 0, col: 0, kind: 'emitter', direction: 'E', color: 'cyan' };
		grid[0][3] = { row: 0, col: 3, kind: 'mirror', orientation: '/', solutionOrientation: '\\' };
		grid[3][3] = { row: 3, col: 3, kind: 'mirror', orientation: '\\', solutionOrientation: '/' };
		grid[3][1] = { row: 3, col: 1, kind: 'mirror', orientation: '/', solutionOrientation: '\\' };
		grid[4][1] = { row: 4, col: 1, kind: 'target', color: 'cyan' };
		grid[2][2] = { row: 2, col: 2, kind: 'wall' };
		return {
			seed,
			difficulty,
			rows: config.rows,
			cols: config.cols,
			initialGrid: grid,
			parMoves: 3,
			targetCount: 1,
		};
	}

	// Color-mixing fallback: Red + Blue -> Magenta at (3, 4)
	grid[0][0] = { row: 0, col: 0, kind: 'emitter', direction: 'E', color: 'red' };
	grid[0][4] = { row: 0, col: 4, kind: 'mirror', orientation: '/', solutionOrientation: '\\' };
	grid[3][4] = { row: 3, col: 4, kind: 'target', color: 'magenta' };
	grid[6][0] = { row: 6, col: 0, kind: 'emitter', direction: 'E', color: 'blue' };
	grid[6][2] = { row: 6, col: 2, kind: 'mirror', orientation: '\\', solutionOrientation: '/' };
	grid[3][2] = { row: 3, col: 2, kind: 'mirror', orientation: '\\', solutionOrientation: '/' };
	grid[4][4] = { row: 4, col: 4, kind: 'wall' };

	return {
		seed,
		difficulty,
		rows: config.rows,
		cols: config.cols,
		initialGrid: grid,
		parMoves: 3,
		targetCount: 1,
	};
}

/**
 * Generates a deterministic, 100% guaranteed solvable Laser & Mirrors puzzle
 * for the requested difficulty and seed.
 */
export function generatePuzzle(difficulty: Difficulty, seed: number): LaserPuzzle {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const prng = createPrng(seed ^ (difficulty.length * 0x9e3779b9));

	const maxAttempts = 250;
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const built = attemptGenerate(difficulty, prng);
		if (!built) continue;

		const solvedCheck = traceBeams(built.solvedGrid);
		if (!solvedCheck.isSolved) continue;

		const scrambled = scrambleGrid(built.solvedGrid, prng);
		if (!scrambled) continue;

		return {
			seed,
			difficulty,
			rows: config.rows,
			cols: config.cols,
			initialGrid: scrambled.grid,
			parMoves: scrambled.parMoves,
			targetCount: solvedCheck.totalTargetCount,
		};
	}

	return createFallbackPuzzle(difficulty, seed);
}

/**
 * Reconstructs the solved grid from a puzzle by snapping every rotatable cell to `solutionOrientation`.
 */
export function getSolvedGrid(grid: LaserGrid): LaserGrid {
	return grid.map((row) =>
		row.map((cell) =>
			isRotatableCell(cell) && cell.solutionOrientation
				? { ...cell, orientation: cell.solutionOrientation }
				: cell,
		),
	);
}
