export type PlayerMark = 'X' | 'O';

export type CellValue = PlayerMark | null;

export type WinningLine = readonly [number, number, number];

export interface TicTacToeState {
	readonly board: readonly CellValue[];
	readonly currentTurn: PlayerMark;
	readonly startingMark: PlayerMark;
	readonly winner: PlayerMark | 'draw' | null;
	readonly winningLine: WinningLine | null;
	readonly moveCount: number;
	readonly isComplete: boolean;
	readonly player1Name: string;
	readonly player2Name: string;
}

export type TicTacToeAction =
	| { type: 'MAKE_MOVE'; payload: { index: number; senderMark?: PlayerMark } }
	| { type: 'RESTART' }
	| { type: 'RESET_GAME' }
	| { type: 'SET_PLAYERS'; payload: { player1Name: string; player2Name: string } }
	| { type: 'RESET'; payload?: { startingMark?: PlayerMark } };
