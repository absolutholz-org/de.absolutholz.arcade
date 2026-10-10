import type { CellState, MoveAction } from './types.js';

export function cloneBoard(board: CellState[][]): CellState[][] {
	return board.map((row) => [...row]);
}

export function applyMove(board: CellState[][], action: MoveAction): CellState[][] {
	const nextBoard = cloneBoard(board);

	switch (action.type) {
		case 'setCell': {
			nextBoard[action.row][action.col] = action.next;
			if (action.autoCrossed) {
				for (const item of action.autoCrossed) {
					nextBoard[item.row][item.col] = 'mark';
				}
			}
			break;
		}
		case 'dragBatch': {
			for (const item of action.cells) {
				nextBoard[item.row][item.col] = item.next;
			}
			break;
		}
		case 'reset': {
			// Clear all cells
			for (let r = 0; r < nextBoard.length; r++) {
				for (let c = 0; c < nextBoard[r].length; c++) {
					nextBoard[r][c] = 'empty';
				}
			}
			break;
		}
	}

	return nextBoard;
}

export function undoMove(board: CellState[][], action: MoveAction): CellState[][] {
	const prevBoard = cloneBoard(board);

	switch (action.type) {
		case 'setCell': {
			prevBoard[action.row][action.col] = action.prev;
			if (action.autoCrossed) {
				for (const item of action.autoCrossed) {
					prevBoard[item.row][item.col] = item.prev;
				}
			}
			break;
		}
		case 'dragBatch': {
			for (const item of action.cells) {
				prevBoard[item.row][item.col] = item.prev;
			}
			break;
		}
		case 'reset': {
			return cloneBoard(action.board);
		}
	}

	return prevBoard;
}
