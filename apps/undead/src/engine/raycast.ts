import {
	type Direction,
	EDGE_SIDES,
	type EdgeClues,
	type EdgeSide,
	type MirrorType,
	type MonsterType,
	type RayPath,
	type RayStep,
	getClueId,
} from './types.ts';

const DIR_DELTA: Readonly<Record<Direction, { readonly dr: number; readonly dc: number }>> = {
	N: { dr: -1, dc: 0 },
	E: { dr: 0, dc: 1 },
	S: { dr: 1, dc: 0 },
	W: { dr: 0, dc: -1 },
};

/**
 * Reflects a ray traveling in `dir` off a diagonal mirror:
 * - `/` reflects N <-> E and S <-> W
 * - `\` reflects N <-> W and S <-> E
 */
export function reflectDirection(dir: Direction, mirror: MirrorType): Direction {
	if (mirror === '/') {
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
 * Determines whether a monster is visible to a ray at a given traversal step.
 * - Zombie: always visible
 * - Ghost: visible only after at least one mirror reflection (`hasReflected === true`)
 * - Vampire: visible only before any mirror reflection (`hasReflected === false`)
 */
export function isMonsterVisible(monster: MonsterType, hasReflected: boolean): boolean {
	switch (monster) {
		case 'zombie':
			return true;
		case 'ghost':
			return hasReflected;
		case 'vampire':
			return !hasReflected;
	}
}

/**
 * Traces the complete line-of-sight ray starting from an edge clue position.
 */
export function traceRay(mirrors: readonly (readonly (MirrorType | null)[])[], side: EdgeSide, index: number): RayPath {
	const size = mirrors.length;
	let row = 0;
	let col = 0;
	let dir: Direction = 'S';

	switch (side) {
		case 'top':
			row = 0;
			col = index;
			dir = 'S';
			break;
		case 'bottom':
			row = size - 1;
			col = index;
			dir = 'N';
			break;
		case 'left':
			row = index;
			col = 0;
			dir = 'E';
			break;
		case 'right':
			row = index;
			col = size - 1;
			dir = 'W';
			break;
	}

	const steps: RayStep[] = [];
	let hasReflected = false;
	const maxSteps = size * size * 4;

	while (row >= 0 && row < size && col >= 0 && col < size && steps.length < maxSteps) {
		const mirror = mirrors[row]?.[col] ?? null;
		const enterDir = dir;

		if (mirror !== null) {
			const exitDir = reflectDirection(enterDir, mirror);
			steps.push({
				row,
				col,
				enterDir,
				exitDir,
				hasReflected,
				isMirror: true,
				mirrorType: mirror,
			});
			hasReflected = true;
			dir = exitDir;
		} else {
			steps.push({
				row,
				col,
				enterDir,
				exitDir: enterDir,
				hasReflected,
				isMirror: false,
				mirrorType: null,
			});
		}

		const delta = DIR_DELTA[dir];
		row += delta.dr;
		col += delta.dc;
	}

	return {
		clueId: getClueId(side, index),
		side,
		index,
		steps,
	};
}

/**
 * Traces all 4N edge rays for a mirror grid, returning a lookup keyed by `clueId`.
 */
export function traceAllRays(mirrors: readonly (readonly (MirrorType | null)[])[]): Readonly<Record<string, RayPath>> {
	const size = mirrors.length;
	const rays: Record<string, RayPath> = {};

	for (const side of EDGE_SIDES) {
		for (let i = 0; i < size; i += 1) {
			const path = traceRay(mirrors, side, i);
			rays[path.clueId] = path;
		}
	}

	return rays;
}

/**
 * Counts how many monsters are visible along a pre-traced ray path.
 * Visibility is evaluated per traversal step: if a ray crosses the same monster twice,
 * it is counted on each pass where it is visible.
 */
export function countVisibleAlongRay(ray: RayPath, monsters: readonly (readonly (MonsterType | null)[])[]): number {
	let visible = 0;
	for (const step of ray.steps) {
		if (step.isMirror) continue;
		const monster = monsters[step.row]?.[step.col] ?? null;
		if (monster !== null && isMonsterVisible(monster, step.hasReflected)) {
			visible += 1;
		}
	}
	return visible;
}

/**
 * Derives all 4N edge clues from a mirror layout and a completed monster assignment.
 */
export function computeEdgeClues(
	mirrors: readonly (readonly (MirrorType | null)[])[],
	monsters: readonly (readonly (MonsterType | null)[])[],
): EdgeClues {
	const size = mirrors.length;
	const top: number[] = [];
	const right: number[] = [];
	const bottom: number[] = [];
	const left: number[] = [];

	for (let i = 0; i < size; i += 1) {
		top.push(countVisibleAlongRay(traceRay(mirrors, 'top', i), monsters));
		right.push(countVisibleAlongRay(traceRay(mirrors, 'right', i), monsters));
		bottom.push(countVisibleAlongRay(traceRay(mirrors, 'bottom', i), monsters));
		left.push(countVisibleAlongRay(traceRay(mirrors, 'left', i), monsters));
	}

	return { top, right, bottom, left };
}
