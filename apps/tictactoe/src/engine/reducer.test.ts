import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	ROOM_NAMESPACE,
	extractRoomCode,
	generateRoomCode,
	toPeerId,
} from '../../../../libraries/multiplayer/src/roomCode.ts';
import { checkWinner, createInitialState, getNextTurn, isValidMove, reduce } from './reducer.ts';
import type { CellValue } from './types.ts';

describe('Tic-Tac-Toe Engine - Reducer & Rules', () => {
	it('initializes default state correctly', () => {
		const state = createInitialState('X', 'Alice', 'Bob');
		assert.equal(state.currentTurn, 'X');
		assert.equal(state.startingMark, 'X');
		assert.equal(state.winner, null);
		assert.equal(state.winningLine, null);
		assert.equal(state.moveCount, 0);
		assert.equal(state.isComplete, false);
		assert.equal(state.player1Name, 'Alice');
		assert.equal(state.player2Name, 'Bob');
		assert.equal(state.board.length, 9);
		assert.ok(state.board.every((cell) => cell === null));
	});

	it('alternates turns accurately', () => {
		assert.equal(getNextTurn('X'), 'O');
		assert.equal(getNextTurn('O'), 'X');
	});

	describe('Move Validation', () => {
		it('allows valid moves on empty cells within bounds', () => {
			const state = createInitialState();
			assert.equal(isValidMove(state, 0), true);
			assert.equal(isValidMove(state, 4), true);
			assert.equal(isValidMove(state, 8), true);
		});

		it('rejects out-of-bounds indices and non-integers', () => {
			const state = createInitialState();
			assert.equal(isValidMove(state, -1), false);
			assert.equal(isValidMove(state, 9), false);
			assert.equal(isValidMove(state, 100), false);
			assert.equal(isValidMove(state, 2.5), false);
			assert.equal(isValidMove(state, Number.NaN), false);
		});

		it('rejects moves on already occupied cells', () => {
			let state = createInitialState();
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } });
			assert.equal(state.board[4], 'X');
			assert.equal(isValidMove(state, 4), false);

			// Attempting to move on cell 4 again should leave state unchanged
			const nextState = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } });
			assert.deepEqual(nextState, state);
		});

		it('rejects moves if senderMark does not match currentTurn', () => {
			const state = createInitialState(); // currentTurn is 'X'
			assert.equal(isValidMove(state, 0, 'O'), false);
			assert.equal(isValidMove(state, 0, 'X'), true);

			const invalidState = reduce(state, {
				type: 'MAKE_MOVE',
				payload: { index: 0, senderMark: 'O' },
			});
			assert.deepEqual(invalidState, state);
		});

		it('rejects moves once the match is complete', () => {
			let state = createInitialState();
			// Fast horizontal win for X:
			// X: 0, 1, 2
			// O: 3, 4
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 0 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 3 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 1 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 2 } }); // X wins

			assert.equal(state.isComplete, true);
			assert.equal(state.winner, 'X');
			assert.equal(isValidMove(state, 5), false);

			const postMoveState = reduce(state, { type: 'MAKE_MOVE', payload: { index: 5 } });
			assert.deepEqual(postMoveState, state);
		});
	});

	describe('Win Checks', () => {
		it('detects row 0 win', () => {
			let state = createInitialState();
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 0 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 3 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 1 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 2 } }); // X

			assert.equal(state.winner, 'X');
			assert.deepEqual(state.winningLine, [0, 1, 2]);
			assert.equal(state.isComplete, true);
		});

		it('detects row 1 win for O', () => {
			let state = createInitialState();
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 0 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 3 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 1 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 8 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 5 } }); // O wins

			assert.equal(state.winner, 'O');
			assert.deepEqual(state.winningLine, [3, 4, 5]);
			assert.equal(state.isComplete, true);
		});

		it('detects row 2 win', () => {
			let state = createInitialState();
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 6 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 0 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 7 } }); // X
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 1 } }); // O
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 8 } }); // X

			assert.equal(state.winner, 'X');
			assert.deepEqual(state.winningLine, [6, 7, 8]);
		});

		it('detects column wins (col 0, col 1, col 2)', () => {
			// Column 0: 0, 3, 6
			const col0Board: CellValue[] = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
			assert.deepEqual(checkWinner(col0Board), { winner: 'X', winningLine: [0, 3, 6] });

			// Column 1: 1, 4, 7
			const col1Board: CellValue[] = ['X', 'O', null, null, 'O', 'X', null, 'O', 'X'];
			assert.deepEqual(checkWinner(col1Board), { winner: 'O', winningLine: [1, 4, 7] });

			// Column 2: 2, 5, 8
			const col2Board: CellValue[] = [null, 'O', 'X', 'O', null, 'X', null, null, 'X'];
			assert.deepEqual(checkWinner(col2Board), { winner: 'X', winningLine: [2, 5, 8] });
		});

		it('detects diagonal wins ([0, 4, 8] and [2, 4, 6])', () => {
			// Diagonal [0, 4, 8]
			const diag1: CellValue[] = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
			assert.deepEqual(checkWinner(diag1), { winner: 'X', winningLine: [0, 4, 8] });

			// Anti-diagonal [2, 4, 6]
			const diag2: CellValue[] = ['X', null, 'O', null, 'O', 'X', 'O', null, null];
			assert.deepEqual(checkWinner(diag2), { winner: 'O', winningLine: [2, 4, 6] });
		});
	});

	describe('Draw Detection', () => {
		it('detects a draw when all cells are filled with no 3-in-a-row', () => {
			// Classic cat's game draw board:
			// X O X
			// X O O
			// O X X
			const drawBoard: CellValue[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
			const result = checkWinner(drawBoard);
			assert.equal(result.winner, 'draw');
			assert.equal(result.winningLine, null);
		});

		it('reaches a draw via move execution', () => {
			let state = createInitialState();
			// Move sequence to draw:
			// 0:X, 1:O, 2:X, 4:O, 3:X, 5:O, 7:X, 6:O, 8:X
			const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
			for (const move of moves) {
				state = reduce(state, { type: 'MAKE_MOVE', payload: { index: move } });
			}

			assert.equal(state.isComplete, true);
			assert.equal(state.winner, 'draw');
			assert.equal(state.winningLine, null);
			assert.equal(state.moveCount, 9);
		});
	});

	describe('Starting-Mark Rotation & Rematch', () => {
		it('swaps starting mark on RESTART action', () => {
			let state = createInitialState('X', 'Player 1', 'Player 2');
			assert.equal(state.startingMark, 'X');
			assert.equal(state.currentTurn, 'X');

			// Play a quick round
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 0 } });
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 1 } });
			assert.equal(state.moveCount, 2);

			// Trigger rematch / restart
			state = reduce(state, { type: 'RESTART' });

			// Starting mark must now be 'O'
			assert.equal(state.startingMark, 'O');
			assert.equal(state.currentTurn, 'O');
			assert.equal(state.moveCount, 0);
			assert.equal(state.isComplete, false);
			assert.equal(state.winner, null);
			assert.equal(state.winningLine, null);
			assert.ok(state.board.every((cell) => cell === null));
			// Player names are preserved
			assert.equal(state.player1Name, 'Player 1');
			assert.equal(state.player2Name, 'Player 2');

			// Triggering RESTART again swaps back to 'X'
			state = reduce(state, { type: 'RESTART' });
			assert.equal(state.startingMark, 'X');
			assert.equal(state.currentTurn, 'X');

			// Triggering RESET_GAME also swaps startingMark for online rematch parity
			state = reduce(state, { type: 'RESET_GAME' });
			assert.equal(state.startingMark, 'O');
			assert.equal(state.currentTurn, 'O');
			assert.equal(state.moveCount, 0);
			assert.equal(state.isComplete, false);
		});

		it('updates player names via SET_PLAYERS', () => {
			let state = createInitialState();
			state = reduce(state, {
				type: 'SET_PLAYERS',
				payload: { player1Name: 'Dominic', player2Name: 'Dad' },
			});
			assert.equal(state.player1Name, 'Dominic');
			assert.equal(state.player2Name, 'Dad');
		});

		it('resets board cleanly via RESET', () => {
			let state = createInitialState();
			state = reduce(state, { type: 'MAKE_MOVE', payload: { index: 4 } });
			state = reduce(state, { type: 'RESET', payload: { startingMark: 'X' } });
			assert.equal(state.moveCount, 0);
			assert.equal(state.currentTurn, 'X');
			assert.ok(state.board.every((cell) => cell === null));
		});
	});

	describe('Online Room Code & Peer ID Utilities', () => {
		it('generates a 6-character alphanumeric room code and formats Peer IDs', () => {
			const code = generateRoomCode();
			assert.equal(code.length, 6);
			assert.match(code, /^[a-z0-9]{6}$/);
			assert.equal(toPeerId('k7m2p9'), `${ROOM_NAMESPACE}k7m2p9`);
		});

		it('extracts room codes from full URLs, query parameters, and raw inputs', () => {
			assert.equal(extractRoomCode('https://arcade.absolutholz.de/tictactoe/en/?room=k7m2p9'), 'k7m2p9');
			assert.equal(extractRoomCode('https://arcade.absolutholz.de/tictactoe/room/m8n9p0'), 'm8n9p0');
			assert.equal(extractRoomCode('  AbC123  '), 'abc123');
		});
	});
});
