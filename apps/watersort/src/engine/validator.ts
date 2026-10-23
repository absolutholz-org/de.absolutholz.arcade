import { type Board, type Move, TUBE_CAPACITY, type Tube } from './types.ts';

export function getTopRunLength(tube: Tube): number {
	if (tube.length === 0) {
		return 0;
	}
	const topColor = tube[tube.length - 1];
	let length = 0;
	for (let index = tube.length - 1; index >= 0 && tube[index] === topColor; index--) {
		length++;
	}
	return length;
}

export function isTubeUniform(tube: Tube): boolean {
	return tube.every((color) => color === tube[0]);
}

export function isTubeComplete(tube: Tube): boolean {
	return tube.length === TUBE_CAPACITY && isTubeUniform(tube);
}

export function canPour(board: Board, { from, to }: Move): boolean {
	const source = board[from];
	const target = board[to];
	if (!source || !target || from === to) {
		return false;
	}
	if (source.length === 0 || target.length >= TUBE_CAPACITY) {
		return false;
	}
	return target.length === 0 || target[target.length - 1] === source[source.length - 1];
}

/** A pour transfers the whole top run of one color, limited by the free space in the target tube. */
function getPourAmount(board: Board, move: Move): number {
	if (!canPour(board, move)) {
		return 0;
	}
	return Math.min(getTopRunLength(board[move.from]), TUBE_CAPACITY - board[move.to].length);
}

/** Returns a new board; the input is never mutated. Illegal moves return the input board unchanged. */
export function applyPour(board: Board, move: Move): Board {
	const amount = getPourAmount(board, move);
	if (amount === 0) {
		return board;
	}
	const source = board[move.from];
	const color = source[source.length - 1];
	return board.map((tube, index) => {
		if (index === move.from) {
			return tube.slice(0, tube.length - amount);
		}
		if (index === move.to) {
			return [...tube, ...Array<number>(amount).fill(color)];
		}
		return tube;
	});
}

export function isSolved(board: Board): boolean {
	return board.every((tube) => tube.length === 0 || isTubeComplete(tube));
}

/**
 * Legal pours that can make progress. Pouring a uniform tube into an empty tube only swaps
 * two interchangeable tubes, and only the first empty tube is offered as a destination.
 */
export function getLegalMoves(board: Board): Move[] {
	const moves: Move[] = [];
	const firstEmptyIndex = board.findIndex((tube) => tube.length === 0);
	for (let from = 0; from < board.length; from++) {
		for (let to = 0; to < board.length; to++) {
			if (!canPour(board, { from, to })) {
				continue;
			}
			if (board[to].length === 0 && (to !== firstEmptyIndex || isTubeUniform(board[from]))) {
				continue;
			}
			moves.push({ from, to });
		}
	}
	return moves;
}

export function isDeadlocked(board: Board): boolean {
	return !isSolved(board) && getLegalMoves(board).length === 0;
}

/** Every color id below `colorCount` must appear exactly `TUBE_CAPACITY` times and no tube may overflow. */
export function isValidBoard(board: Board, colorCount: number): boolean {
	const counts = new Array<number>(colorCount).fill(0);
	for (const tube of board) {
		if (tube.length > TUBE_CAPACITY) {
			return false;
		}
		for (const color of tube) {
			if (!Number.isInteger(color) || color < 0 || color >= colorCount) {
				return false;
			}
			counts[color]++;
		}
	}
	return counts.every((count) => count === TUBE_CAPACITY);
}
