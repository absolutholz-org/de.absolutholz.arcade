import type { CellValue, PlayerMark, TicTacToeAction, TicTacToeState, WinningLine } from './types.ts';

export const WINNING_LINES: readonly WinningLine[] = [
	// Rows
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	// Columns
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	// Diagonals
	[0, 4, 8],
	[2, 4, 6],
];

export const EMPTY_BOARD: readonly CellValue[] = Object.freeze(Array<CellValue>(9).fill(null));

export function getNextTurn(currentTurn: PlayerMark): PlayerMark {
	return currentTurn === 'X' ? 'O' : 'X';
}

export function checkWinner(board: readonly CellValue[]): {
	winner: PlayerMark | 'draw' | null;
	winningLine: WinningLine | null;
} {
	for (const line of WINNING_LINES) {
		const [a, b, c] = line;
		const markA = board[a];
		if (markA !== null && markA === board[b] && markA === board[c]) {
			return { winner: markA, winningLine: line };
		}
	}

	const isBoardFull = board.every((cell) => cell !== null);
	if (isBoardFull) {
		return { winner: 'draw', winningLine: null };
	}

	return { winner: null, winningLine: null };
}

export function createInitialState(
	startingMark: PlayerMark = 'X',
	player1Name = 'Player 1',
	player2Name = 'Player 2',
): TicTacToeState {
	return {
		board: EMPTY_BOARD,
		currentTurn: startingMark,
		startingMark,
		winner: null,
		winningLine: null,
		moveCount: 0,
		isComplete: false,
		player1Name,
		player2Name,
	};
}

export function isValidMove(state: TicTacToeState, index: number, senderMark?: PlayerMark): boolean {
	if (state.isComplete) {
		return false;
	}
	if (!Number.isInteger(index) || index < 0 || index >= 9) {
		return false;
	}
	if (state.board[index] !== null) {
		return false;
	}
	if (senderMark !== undefined && senderMark !== state.currentTurn) {
		return false;
	}
	return true;
}

export function reduce(state: TicTacToeState, action: TicTacToeAction): TicTacToeState {
	switch (action.type) {
		case 'MAKE_MOVE': {
			const { index, senderMark } = action.payload;
			if (!isValidMove(state, index, senderMark)) {
				return state;
			}

			const newBoard = [...state.board];
			newBoard[index] = state.currentTurn;

			const { winner, winningLine } = checkWinner(newBoard);
			const isComplete = winner !== null;

			return {
				...state,
				board: Object.freeze(newBoard),
				currentTurn: isComplete ? state.currentTurn : getNextTurn(state.currentTurn),
				winner,
				winningLine,
				moveCount: state.moveCount + 1,
				isComplete,
			};
		}

		case 'RESTART': {
			// Alternating starting turn: if X started, O starts the rematch
			const nextStartingMark = getNextTurn(state.startingMark);
			return {
				...state,
				board: EMPTY_BOARD,
				currentTurn: nextStartingMark,
				startingMark: nextStartingMark,
				winner: null,
				winningLine: null,
				moveCount: 0,
				isComplete: false,
			};
		}

		case 'SET_PLAYERS': {
			return {
				...state,
				player1Name: action.payload.player1Name.trim() || 'Player 1',
				player2Name: action.payload.player2Name.trim() || 'Player 2',
			};
		}

		case 'RESET': {
			const startingMark = action.payload?.startingMark ?? state.startingMark;
			return {
				...state,
				board: EMPTY_BOARD,
				currentTurn: startingMark,
				startingMark,
				winner: null,
				winningLine: null,
				moveCount: 0,
				isComplete: false,
			};
		}

		default:
			return state;
	}
}
