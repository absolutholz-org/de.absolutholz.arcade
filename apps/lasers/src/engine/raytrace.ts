import {
	type BeamColor,
	type BeamSegment,
	COLOR_MASKS,
	type Direction,
	type LaserCell,
	type LaserGrid,
	MASK_TO_COLOR,
	type MirrorOrientation,
	type RaytraceResult,
	type TargetStatus,
	isRotatableCell,
	toggleOrientation,
} from './types.ts';

export const DIRECTION_DELTAS: Readonly<Record<Direction, { readonly dr: number; readonly dc: number }>> = {
	N: { dr: -1, dc: 0 },
	E: { dr: 0, dc: 1 },
	S: { dr: 1, dc: 0 },
	W: { dr: 0, dc: -1 },
};

/**
 * Reflects an incoming ray traveling in `dir` off a mirror with `orientation`.
 *
 * `/` mirror: N -> E, E -> N, S -> W, W -> S
 * `\` mirror: N -> W, W -> N, S -> E, E -> S
 */
export function reflectDirection(dir: Direction, orientation: MirrorOrientation): Direction {
	if (orientation === '/') {
		switch (dir) {
			case 'N':
				return 'E';
			case 'E':
				return 'N';
			case 'S':
				return 'W';
			case 'W':
				return 'S';
		}
	}
	switch (dir) {
		case 'N':
			return 'W';
		case 'W':
			return 'N';
		case 'S':
			return 'E';
		case 'E':
			return 'S';
	}
}

/**
 * Mixes two beam colors additively via RGB bitmask OR.
 */
export function mixBeamColors(a: BeamColor, b: BeamColor): BeamColor {
	const mask = COLOR_MASKS[a] | COLOR_MASKS[b];
	return MASK_TO_COLOR[mask] ?? 'white';
}

export function maskToBeamColor(mask: number): BeamColor | null {
	if (mask <= 0) return null;
	return MASK_TO_COLOR[mask & 7] ?? 'white';
}

interface RayState {
	readonly fromRow: number;
	readonly fromCol: number;
	readonly row: number;
	readonly col: number;
	readonly dir: Direction;
	readonly colorMask: number;
}

/**
 * Builds a canonical undirected segment key so overlapping/opposite beams along the
 * same grid edge combine additively into their mixed color.
 */
function canonicalSegmentKey(fromRow: number, fromCol: number, toRow: number, toCol: number): string {
	if (fromRow < toRow || (fromRow === toRow && fromCol <= toCol)) {
		return `${fromRow},${fromCol}->${toRow},${toCol}`;
	}
	return `${toRow},${toCol}->${fromRow},${fromCol}`;
}

/**
 * Deterministic grid ray-tracer.
 * Computes all active beam segments (with additive color mixing on overlapping edges),
 * lit target receivers, and guarantees safe termination on infinite mirror loops via
 * a visited state set of `(row, col, direction, colorMask)`.
 */
export function traceBeams(grid: LaserGrid): RaytraceResult {
	const rows = grid.length;
	const cols = rows > 0 ? grid[0].length : 0;

	const queue: RayState[] = [];
	const visited = new Set<string>();
	const segmentMap = new Map<
		string,
		{
			fromRow: number;
			fromCol: number;
			toRow: number;
			toCol: number;
			colorMask: number;
			direction: Direction;
		}
	>();
	const targetMasks = new Map<string, number>();
	const targetCells: LaserCell[] = [];
	let terminatedByLoopGuard = false;

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			const cell = grid[r][c];
			if (cell.kind === 'target') {
				targetCells.push(cell);
				targetMasks.set(`${r},${c}`, 0);
			} else if (cell.kind === 'emitter' && cell.direction && cell.color) {
				const delta = DIRECTION_DELTAS[cell.direction];
				const colorMask = COLOR_MASKS[cell.color];
				queue.push({
					fromRow: r,
					fromCol: c,
					row: r + delta.dr,
					col: c + delta.dc,
					dir: cell.direction,
					colorMask,
				});
			}
		}
	}

	const addSegment = (
		fromRow: number,
		fromCol: number,
		toRow: number,
		toCol: number,
		colorMask: number,
		direction: Direction,
	) => {
		const key = canonicalSegmentKey(fromRow, fromCol, toRow, toCol);
		const existing = segmentMap.get(key);
		if (existing) {
			existing.colorMask |= colorMask;
		} else {
			segmentMap.set(key, {
				fromRow,
				fromCol,
				toRow,
				toCol,
				colorMask,
				direction,
			});
		}
	};

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;

		const { fromRow, fromCol, row, col, dir, colorMask } = current;

		// Beam exits the board: draw half-cell exit stub to the board border
		if (row < 0 || row >= rows || col < 0 || col >= cols) {
			const edgeRow = fromRow + DIRECTION_DELTAS[dir].dr * 0.5;
			const edgeCol = fromCol + DIRECTION_DELTAS[dir].dc * 0.5;
			addSegment(fromRow, fromCol, edgeRow, edgeCol, colorMask, dir);
			continue;
		}

		// Record beam segment traveling into (row, col)
		addSegment(fromRow, fromCol, row, col, colorMask, dir);

		const stateKey = `${row},${col},${dir},${colorMask}`;
		if (visited.has(stateKey)) {
			terminatedByLoopGuard = true;
			continue;
		}
		visited.add(stateKey);

		const cell = grid[row][col];

		if (cell.kind === 'wall' || cell.kind === 'emitter') {
			continue;
		}

		if (cell.kind === 'target') {
			const tKey = `${row},${col}`;
			const prevMask = targetMasks.get(tKey) ?? 0;
			targetMasks.set(tKey, prevMask | colorMask);
			continue;
		}

		if (cell.kind === 'empty') {
			const delta = DIRECTION_DELTAS[dir];
			queue.push({
				fromRow: row,
				fromCol: col,
				row: row + delta.dr,
				col: col + delta.dc,
				dir,
				colorMask,
			});
			continue;
		}

		if ((cell.kind === 'mirror' || cell.kind === 'fixed-mirror') && cell.orientation) {
			const nextDir = reflectDirection(dir, cell.orientation);
			const delta = DIRECTION_DELTAS[nextDir];
			queue.push({
				fromRow: row,
				fromCol: col,
				row: row + delta.dr,
				col: col + delta.dc,
				dir: nextDir,
				colorMask,
			});
			continue;
		}

		if ((cell.kind === 'splitter' || cell.kind === 'fixed-splitter') && cell.orientation) {
			// Pass 50% straight through
			const straightDelta = DIRECTION_DELTAS[dir];
			queue.push({
				fromRow: row,
				fromCol: col,
				row: row + straightDelta.dr,
				col: col + straightDelta.dc,
				dir,
				colorMask,
			});
			// Reflect 50% at 90 degrees
			const reflectedDir = reflectDirection(dir, cell.orientation);
			const reflectedDelta = DIRECTION_DELTAS[reflectedDir];
			queue.push({
				fromRow: row,
				fromCol: col,
				row: row + reflectedDelta.dr,
				col: col + reflectedDelta.dc,
				dir: reflectedDir,
				colorMask,
			});
		}
	}

	const segments: BeamSegment[] = [];
	for (const entry of segmentMap.values()) {
		segments.push({
			fromRow: entry.fromRow,
			fromCol: entry.fromCol,
			toRow: entry.toRow,
			toCol: entry.toCol,
			color: maskToBeamColor(entry.colorMask) ?? 'white',
			colorMask: entry.colorMask,
			direction: entry.direction,
		});
	}

	let litTargetCount = 0;
	const targets: TargetStatus[] = targetCells.map((cell) => {
		const requiredColor = cell.color ?? 'cyan';
		const requiredMask = COLOR_MASKS[requiredColor];
		const receivedMask = targetMasks.get(`${cell.row},${cell.col}`) ?? 0;
		const isLit = receivedMask === requiredMask;
		if (isLit) litTargetCount += 1;
		return {
			row: cell.row,
			col: cell.col,
			requiredColor,
			receivedColor: maskToBeamColor(receivedMask),
			receivedMask,
			isLit,
		};
	});

	return {
		segments,
		targets,
		litTargetCount,
		totalTargetCount: targets.length,
		isSolved: targets.length > 0 && litTargetCount === targets.length,
		terminatedByLoopGuard,
	};
}

/**
 * Returns a new grid with the rotatable mirror/splitter at (row, col) toggled.
 * Returns null if the cell is not rotatable.
 */
export function rotateCellAt(grid: LaserGrid, row: number, col: number): LaserGrid | null {
	const targetRow = grid[row];
	if (!targetRow) return null;
	const cell = targetRow[col];
	if (!cell || !isRotatableCell(cell) || !cell.orientation) return null;

	const nextOrientation = toggleOrientation(cell.orientation);
	return grid.map((rCells, rIdx) =>
		rIdx !== row
			? rCells
			: rCells.map((cCell, cIdx) => (cIdx !== col ? cCell : { ...cCell, orientation: nextOrientation })),
	);
}

/**
 * Finds one misplaced rotatable mirror/splitter whose current orientation differs
 * from its solution orientation (prioritizing non-decoy mirrors).
 */
export function findHintCell(grid: LaserGrid): { readonly row: number; readonly col: number } | null {
	const candidates: { row: number; col: number; isDecoy: boolean }[] = [];
	for (let r = 0; r < grid.length; r += 1) {
		for (let c = 0; c < grid[r].length; c += 1) {
			const cell = grid[r][c];
			if (isRotatableCell(cell) && cell.orientation && cell.solutionOrientation) {
				if (cell.orientation !== cell.solutionOrientation) {
					candidates.push({ row: r, col: c, isDecoy: Boolean(cell.isDecoy) });
				}
			}
		}
	}
	if (candidates.length === 0) return null;
	const nonDecoy = candidates.find((item) => !item.isDecoy);
	const chosen = nonDecoy ?? candidates[0];
	return { row: chosen.row, col: chosen.col };
}
