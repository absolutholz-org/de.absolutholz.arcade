import type { BoardDefinition, BoardLayoutId, JumpMove, JumpVector, Position } from './types.ts';

export function posKey(r: number, c: number): string {
	return `${r},${c}`;
}

const ORTHOGONAL_VECTORS: readonly JumpVector[] = Object.freeze([
	{ dr: -1, dc: 0 },
	{ dr: 1, dc: 0 },
	{ dr: 0, dc: -1 },
	{ dr: 0, dc: 1 },
]);

const TRIANGULAR_VECTORS: readonly JumpVector[] = Object.freeze([
	{ dr: 0, dc: 1 },
	{ dr: 0, dc: -1 },
	{ dr: 1, dc: 1 },
	{ dr: -1, dc: -1 },
	{ dr: 1, dc: 0 },
	{ dr: -1, dc: 0 },
]);

function createBoardDefinition(
	id: BoardLayoutId,
	name: string,
	rowCount: number,
	colCount: number,
	holes: readonly Position[],
	center: Position,
	jumpVectors: readonly JumpVector[],
): BoardDefinition {
	const holeSet = new Set<string>();
	for (const hole of holes) {
		holeSet.add(posKey(hole.r, hole.c));
	}

	const validJumps: JumpMove[] = [];
	const jumpLookup = new Map<string, Map<string, JumpMove>>();

	for (const from of holes) {
		const fromK = posKey(from.r, from.c);
		const targetMap = new Map<string, JumpMove>();
		jumpLookup.set(fromK, targetMap);

		for (const vec of jumpVectors) {
			const jumpedR = from.r + vec.dr;
			const jumpedC = from.c + vec.dc;
			const toR = from.r + 2 * vec.dr;
			const toC = from.c + 2 * vec.dc;

			if (holeSet.has(posKey(jumpedR, jumpedC)) && holeSet.has(posKey(toR, toC))) {
				const jump: JumpMove = {
					from,
					jumped: { r: jumpedR, c: jumpedC },
					to: { r: toR, c: toC },
				};
				validJumps.push(jump);
				targetMap.set(posKey(toR, toC), jump);
			}
		}
	}

	return {
		id,
		name,
		rowCount,
		colCount,
		holes: Object.freeze([...holes]),
		center,
		jumpVectors,
		validJumps: Object.freeze(validJumps),
		holeSet,
		jumpLookup,
	};
}

function buildEnglishLayout(): BoardDefinition {
	const holes: Position[] = [];
	for (let r = 0; r < 7; r++) {
		for (let c = 0; c < 7; c++) {
			const isArmRow = r >= 2 && r <= 4;
			const isArmCol = c >= 2 && c <= 4;
			if (isArmRow || isArmCol) {
				holes.push({ r, c });
			}
		}
	}
	return createBoardDefinition('english', 'English', 7, 7, holes, { r: 3, c: 3 }, ORTHOGONAL_VECTORS);
}

function buildEuropeanLayout(): BoardDefinition {
	const holes: Position[] = [];
	const europeanCorners = new Set(['1,1', '1,5', '5,1', '5,5']);
	for (let r = 0; r < 7; r++) {
		for (let c = 0; c < 7; c++) {
			const isArmRow = r >= 2 && r <= 4;
			const isArmCol = c >= 2 && c <= 4;
			if (isArmRow || isArmCol || europeanCorners.has(posKey(r, c))) {
				holes.push({ r, c });
			}
		}
	}
	return createBoardDefinition('european', 'European', 7, 7, holes, { r: 3, c: 3 }, ORTHOGONAL_VECTORS);
}

function buildTriangularLayout(): BoardDefinition {
	const holes: Position[] = [];
	for (let r = 0; r < 5; r++) {
		for (let c = 0; c <= r; c++) {
			holes.push({ r, c });
		}
	}
	return createBoardDefinition('triangular', 'Triangular', 5, 5, holes, { r: 0, c: 0 }, TRIANGULAR_VECTORS);
}

function buildDiamondLayout(): BoardDefinition {
	const holes: Position[] = [];
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			if (Math.abs(r - 4) + Math.abs(c - 4) <= 4) {
				holes.push({ r, c });
			}
		}
	}
	return createBoardDefinition('diamond', 'Diamond', 9, 9, holes, { r: 4, c: 4 }, ORTHOGONAL_VECTORS);
}

function buildWieglebLayout(): BoardDefinition {
	const holes: Position[] = [];
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			const isCrossRow = r >= 3 && r <= 5;
			const isCrossCol = c >= 3 && c <= 5;
			if (isCrossRow || isCrossCol) {
				holes.push({ r, c });
			}
		}
	}
	return createBoardDefinition('wiegleb', 'Wiegleb', 9, 9, holes, { r: 4, c: 4 }, ORTHOGONAL_VECTORS);
}

export const BOARD_DEFINITIONS: Readonly<Record<BoardLayoutId, BoardDefinition>> = Object.freeze({
	english: buildEnglishLayout(),
	european: buildEuropeanLayout(),
	triangular: buildTriangularLayout(),
	diamond: buildDiamondLayout(),
	wiegleb: buildWieglebLayout(),
});

export function getBoardDefinition(layoutId: BoardLayoutId): BoardDefinition {
	const def = BOARD_DEFINITIONS[layoutId];
	if (!def) {
		throw new Error(`Unknown board layout: ${layoutId}`);
	}
	return def;
}
