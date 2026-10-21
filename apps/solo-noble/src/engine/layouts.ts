import type {
	BoardLayoutDefinition,
	BoardLayoutId,
	CompiledBoardLayout,
	Coordinate,
	CoordinateKey,
	Jump,
} from './types.js';

export function toCoordinateKey(row: number, col: number): CoordinateKey {
	return `${row},${col}`;
}

export function parseCoordinateKey(key: CoordinateKey): Coordinate {
	const [rowStr, colStr] = key.split(',');
	return {
		row: Number.parseInt(rowStr, 10),
		col: Number.parseInt(colStr, 10),
	};
}

const ORTHOGONAL_VECTORS: [number, number][] = [
	[-2, 0],
	[2, 0],
	[0, -2],
	[0, 2],
];

const TRIANGULAR_VECTORS: [number, number][] = [
	[0, -2],
	[0, 2],
	[-2, 0],
	[2, 0],
	[-2, -2],
	[2, 2],
];

function generateEnglishHoles(): Coordinate[] {
	const holes: Coordinate[] = [];
	for (let row = 0; row < 7; row++) {
		for (let col = 0; col < 7; col++) {
			if ((row >= 2 && row <= 4) || (col >= 2 && col <= 4)) {
				holes.push({ row, col });
			}
		}
	}
	return holes;
}

function generateEuropeanHoles(): Coordinate[] {
	const holes = generateEnglishHoles();
	const additionalCorners: Coordinate[] = [
		{ row: 1, col: 1 },
		{ row: 1, col: 5 },
		{ row: 5, col: 1 },
		{ row: 5, col: 5 },
	];
	holes.push(...additionalCorners);
	return holes;
}

function generateTriangularHoles(): Coordinate[] {
	const holes: Coordinate[] = [];
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col <= row; col++) {
			holes.push({ row, col });
		}
	}
	return holes;
}

function generateDiamondHoles(): Coordinate[] {
	const holes: Coordinate[] = [];
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (Math.abs(row - 4) + Math.abs(col - 4) <= 4) {
				holes.push({ row, col });
			}
		}
	}
	return holes;
}

function generateWieglebHoles(): Coordinate[] {
	const holes: Coordinate[] = [];
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if ((row >= 3 && row <= 5) || (col >= 3 && col <= 5)) {
				holes.push({ row, col });
			}
		}
	}
	return holes;
}

export const BOARD_DEFINITIONS: Record<BoardLayoutId, BoardLayoutDefinition> = {
	english: {
		id: 'english',
		name: 'Classic English (33 holes)',
		gridWidth: 7,
		gridHeight: 7,
		holes: generateEnglishHoles(),
		centerHole: { row: 3, col: 3 },
		jumpVectors: ORTHOGONAL_VECTORS,
	},
	european: {
		id: 'european',
		name: 'European / French (37 holes)',
		gridWidth: 7,
		gridHeight: 7,
		holes: generateEuropeanHoles(),
		centerHole: { row: 3, col: 3 },
		jumpVectors: ORTHOGONAL_VECTORS,
	},
	triangular: {
		id: 'triangular',
		name: 'Triangular (15 holes)',
		gridWidth: 5,
		gridHeight: 5,
		holes: generateTriangularHoles(),
		centerHole: { row: 0, col: 0 },
		jumpVectors: TRIANGULAR_VECTORS,
	},
	diamond: {
		id: 'diamond',
		name: 'Diamond (41 holes)',
		gridWidth: 9,
		gridHeight: 9,
		holes: generateDiamondHoles(),
		centerHole: { row: 4, col: 4 },
		jumpVectors: ORTHOGONAL_VECTORS,
	},
	wiegleb: {
		id: 'wiegleb',
		name: 'Wiegleb German (45 holes)',
		gridWidth: 9,
		gridHeight: 9,
		holes: generateWieglebHoles(),
		centerHole: { row: 4, col: 4 },
		jumpVectors: ORTHOGONAL_VECTORS,
	},
};

export function compileLayout(definition: BoardLayoutDefinition): CompiledBoardLayout {
	const holeKeys = new Set<CoordinateKey>(definition.holes.map((h) => toCoordinateKey(h.row, h.col)));
	const centerKey = toCoordinateKey(definition.centerHole.row, definition.centerHole.col);
	const allJumps: Jump[] = [];
	const jumpsFrom = new Map<CoordinateKey, Jump[]>();
	const jumpsBetween = new Map<`${CoordinateKey}->${CoordinateKey}`, Jump>();

	for (const hole of definition.holes) {
		const fromKey = toCoordinateKey(hole.row, hole.col);
		const fromJumps: Jump[] = [];

		for (const [dRow, dCol] of definition.jumpVectors) {
			const toRow = hole.row + dRow;
			const toCol = hole.col + dCol;
			const jumpedRow = hole.row + dRow / 2;
			const jumpedCol = hole.col + dCol / 2;

			const toKey = toCoordinateKey(toRow, toCol);
			const jumpedKey = toCoordinateKey(jumpedRow, jumpedCol);

			if (holeKeys.has(toKey) && holeKeys.has(jumpedKey)) {
				const jump: Jump = {
					from: fromKey,
					jumped: jumpedKey,
					to: toKey,
				};
				fromJumps.push(jump);
				allJumps.push(jump);
				jumpsBetween.set(`${fromKey}->${toKey}`, jump);
			}
		}

		jumpsFrom.set(fromKey, fromJumps);
	}

	return {
		definition,
		holeKeys,
		centerKey,
		allJumps,
		jumpsFrom,
		jumpsBetween,
	};
}

const COMPILED_LAYOUTS_CACHE = new Map<BoardLayoutId, CompiledBoardLayout>();

export function getCompiledLayout(layoutId: BoardLayoutId): CompiledBoardLayout {
	let compiled = COMPILED_LAYOUTS_CACHE.get(layoutId);
	if (!compiled) {
		const def = BOARD_DEFINITIONS[layoutId];
		if (!def) {
			throw new Error(`Unknown board layout id: ${layoutId}`);
		}
		compiled = compileLayout(def);
		COMPILED_LAYOUTS_CACHE.set(layoutId, compiled);
	}
	return compiled;
}
