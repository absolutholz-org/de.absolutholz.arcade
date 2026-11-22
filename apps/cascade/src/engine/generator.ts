import { hasValidMoves } from './board.ts';
import { createPrng } from './prng.ts';
import { type Board, DIFFICULTY_CONFIGS, type Difficulty, type Tile, type TileColor } from './types.ts';

export interface GeneratedBoard {
	readonly board: Board;
	readonly seed: number;
	readonly difficulty: Difficulty;
}

/**
 * Generates a deterministic Cascade board for the given difficulty and seed.
 * Guarantees at least one valid move (adjacent matching pair) exists on the initial board.
 */
export function generateBoard(difficulty: Difficulty, seed?: number): GeneratedBoard {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const baseSeed = seed ?? Math.floor(Math.random() * 0x7fffffff) + 1;

	for (let attempt = 0; attempt < 20; attempt += 1) {
		const activeSeed = (baseSeed + attempt) >>> 0;
		const rng = createPrng(activeSeed);
		let nextId = 1;

		const board: Board = Array.from({ length: config.rows }, () =>
			Array.from({ length: config.cols }, () => {
				const color = rng.nextInt(0, config.colorCount - 1) as TileColor;
				const tile: Tile = { id: nextId, color };
				nextId += 1;
				return tile;
			}),
		);

		if (hasValidMoves(board)) {
			return { board, seed: activeSeed, difficulty };
		}
	}

	// Fallback: force top-left pair to match if all random attempts somehow produced a checkerboard
	const rng = createPrng(baseSeed);
	let nextId = 1;
	const board: Board = Array.from({ length: config.rows }, () =>
		Array.from({ length: config.cols }, () => {
			const color = rng.nextInt(0, config.colorCount - 1) as TileColor;
			const tile: Tile = { id: nextId, color };
			nextId += 1;
			return tile;
		}),
	);
	const firstRow = board[0];
	if (firstRow?.[0] && firstRow[1]) {
		firstRow[1] = { id: firstRow[1].id, color: firstRow[0].color };
	}

	return { board, seed: baseSeed, difficulty };
}
