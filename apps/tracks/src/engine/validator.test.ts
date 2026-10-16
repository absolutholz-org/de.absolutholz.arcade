import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	STATIC_PUZZLES,
	createBoardFromPuzzle,
	getNextPuzzle,
	getPuzzleById,
	getPuzzlesByDifficulty,
	getStaticPuzzle,
} from './puzzles.ts';
import { DIFFICULTY_LEVELS } from './types.ts';
import {
	ALL_TRACK_TYPES,
	DIRECTION_DELTA,
	OPPOSITE_DIRECTION,
	TRACK_DIRECTIONS,
	applyDragStep,
	autoOrientBoardTracks,
	checkVictory,
	evaluateBoard,
	evaluateLines,
	getDirectionBetween,
	getFixedCell,
	getTrackTypeFromDirections,
	inferCellTrackType,
	isTrackOrCandidate,
	isTrackType,
} from './validator.ts';

describe('Tracks Validator', () => {
	it('validates direction and track helper functions', () => {
		assert.equal(ALL_TRACK_TYPES.length, 6);
		for (const track of ALL_TRACK_TYPES) {
			assert.equal(isTrackType(track), true);
			assert.equal(isTrackOrCandidate(track), true);
			const [d1, d2] = TRACK_DIRECTIONS[track];
			assert.equal(getTrackTypeFromDirections(d1, d2), track);
			assert.equal(getTrackTypeFromDirections(d2, d1), track);
		}
		assert.equal(isTrackType('empty'), false);
		assert.equal(isTrackType('cross'), false);
		assert.equal(isTrackType('candidate'), false);
		assert.equal(isTrackOrCandidate('candidate'), true);
		assert.equal(isTrackOrCandidate('empty'), false);
		assert.equal(getTrackTypeFromDirections('N', 'N'), null);

		assert.equal(getDirectionBetween(2, 2, 1, 2), 'N');
		assert.equal(getDirectionBetween(2, 2, 2, 3), 'E');
		assert.equal(getDirectionBetween(2, 2, 3, 2), 'S');
		assert.equal(getDirectionBetween(2, 2, 2, 1), 'W');
		assert.equal(getDirectionBetween(2, 2, 3, 3), null);
		assert.equal(OPPOSITE_DIRECTION.N, 'S');
		assert.equal(DIRECTION_DELTA.N.dRow, -1);
	});

	it('infers cell track types and auto-orients board tracks', () => {
		const puzzle = STATIC_PUZZLES.easy[0];
		const board = createBoardFromPuzzle(puzzle);

		// Fixed cell always returns its fixed track
		const firstFixed = puzzle.fixedCells[0];
		assert.ok(getFixedCell(board, firstFixed.row, firstFixed.col));
		assert.equal(inferCellTrackType(board, firstFixed.row, firstFixed.col), firstFixed.track);

		// Place candidates on the first 3 steps of an empty board (with only start fixed) and auto-orient
		const [step0, step1, step2] = puzzle.solution;
		const partialBoard = createBoardFromPuzzle({
			...puzzle,
			fixedCells: [{ row: step0.row, col: step0.col, track: step0.track }],
		});
		partialBoard.grid[step1.row][step1.col] = 'candidate';
		partialBoard.grid[step2.row][step2.col] = 'candidate';

		assert.equal(inferCellTrackType(partialBoard, step1.row, step1.col), step1.track);

		const oriented = autoOrientBoardTracks(partialBoard);
		assert.equal(oriented.grid[step0.row][step0.col], step0.track);
		assert.equal(oriented.grid[step1.row][step1.col], step1.track);
	});

	it('applies drag steps along the solution path to achieve victory', () => {
		const puzzle = STATIC_PUZZLES.easy[0];
		let board = createBoardFromPuzzle(puzzle);

		for (let i = 1; i < puzzle.solution.length; i++) {
			const prev = puzzle.solution[i - 1];
			const curr = puzzle.solution[i];
			board = applyDragStep(board, prev.row, prev.col, curr.row, curr.col);
		}

		assert.equal(checkVictory(board), true);
	});

	it('detects row/col overflow and disconnected track errors', () => {
		const puzzle = STATIC_PUZZLES.easy[0];
		const board = createBoardFromPuzzle(puzzle);
		const evalInitial = evaluateBoard(board);
		assert.equal(evalInitial.isComplete, false);

		// Fill solution
		for (const step of puzzle.solution) {
			board.grid[step.row][step.col] = step.track;
		}
		assert.equal(checkVictory(board), true);

		// Find an empty cell and place an extra track to cause overflow & extra segment error
		let extraPlaced = false;
		for (let r = 0; r < board.size && !extraPlaced; r++) {
			for (let c = 0; c < board.size && !extraPlaced; c++) {
				if (board.grid[r][c] === 'empty') {
					board.grid[r][c] = 'straight-h';
					extraPlaced = true;
				}
			}
		}

		const lines = evaluateLines(board);
		assert.equal(
			lines.rows.some((r) => r.status === 'overflow'),
			true,
		);
		const evalOverflow = evaluateBoard(board);
		assert.equal(evalOverflow.isComplete, false);
		assert.equal(evalOverflow.errorCells.size > 0, true);
	});

	it('verifies all static puzzles catalog helpers and solution validity', () => {
		for (const diff of DIFFICULTY_LEVELS) {
			const list = getPuzzlesByDifficulty(diff);
			assert.ok(list.length >= 15);
			const staticBoard = getStaticPuzzle(diff, 0);
			assert.equal(staticBoard.difficulty, diff);

			for (let i = 0; i < list.length; i++) {
				const puzzle = list[i];
				const found = getPuzzleById(puzzle.id);
				assert.ok(found);
				assert.equal(found.puzzle.id, puzzle.id);

				const next = getNextPuzzle(puzzle.id);
				if (i < list.length - 1) {
					assert.ok(next);
					assert.equal(next.puzzle.id, list[i + 1].id);
				} else {
					assert.equal(next, undefined);
				}

				const board = createBoardFromPuzzle(puzzle);
				for (const step of puzzle.solution) {
					board.grid[step.row][step.col] = step.track;
				}
				assert.equal(checkVictory(board), true, `Static puzzle ${puzzle.id} solution must be valid`);
			}
		}
	});
});
