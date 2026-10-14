import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { STATIC_PUZZLES, getNextPuzzle, getPuzzleById, getPuzzlesByDifficulty, getStaticPuzzle } from './puzzles.ts';
import { DIFFICULTY_GRID_SIZES, type DifficultyLevel } from './types.ts';

const DIFFICULTIES: DifficultyLevel[] = ['beginner', 'easy', 'medium', 'hard', 'expert'];

describe('Hashiwokakero Static Puzzles & Generator Engine', () => {
	describe('getStaticPuzzle', () => {
		for (const difficulty of DIFFICULTIES) {
			it(`returns valid initial board state for difficulty "${difficulty}"`, () => {
				const expectedSize = DIFFICULTY_GRID_SIZES[difficulty];
				const board = getStaticPuzzle(difficulty);

				assert.equal(board.difficulty, difficulty);
				assert.equal(board.width, expectedSize.width);
				assert.equal(board.height, expectedSize.height);
				assert.equal(board.bridges.length, 0);
				assert.ok(board.islands.length >= 4);

				const coordSet = new Set<string>();
				for (const island of board.islands) {
					// Unique coordinates
					const key = `${island.x},${island.y}`;
					assert.equal(coordSet.has(key), false, `Duplicate island at ${key}`);
					coordSet.add(key);

					// Within grid boundaries
					assert.ok(island.x >= 0 && island.x < board.width);
					assert.ok(island.y >= 0 && island.y < board.height);

					// Target bounds 1..8
					assert.ok(
						island.target >= 1 && island.target <= 8,
						`Island target out of bounds: ${island.target}`,
					);
				}
			});
		}

		it('contains at least 10 puzzles per difficulty tier', () => {
			for (const diff of DIFFICULTIES) {
				const list = STATIC_PUZZLES[diff];
				assert.ok(list.length >= 10, `Difficulty tier ${diff} has only ${list.length} puzzles, expected >= 10`);
			}
		});

		it('cycles through indices if index exceeds available puzzles', () => {
			const totalBeginner = STATIC_PUZZLES.beginner.length;
			assert.ok(totalBeginner >= 10);

			const p0 = getStaticPuzzle('beginner', 0);
			const p1 = getStaticPuzzle('beginner', 1);
			const pCycled = getStaticPuzzle('beginner', totalBeginner);

			assert.notDeepEqual(p0.islands, p1.islands);
			assert.deepEqual(p0.islands, pCycled.islands);
		});
	});

	describe('catalog lookup helpers', () => {
		it('getPuzzlesByDifficulty returns all puzzles for a tier', () => {
			const easyList = getPuzzlesByDifficulty('easy');
			assert.equal(easyList.length, 10);
			assert.equal(easyList[0].id, 'e-1');
		});

		it('getPuzzleById finds puzzle across tiers', () => {
			const found = getPuzzleById('m-5');
			assert.ok(found);
			assert.equal(found?.puzzle.id, 'm-5');
			assert.equal(found?.difficulty, 'medium');
		});

		it('getNextPuzzle returns the next puzzle in the same tier', () => {
			const next = getNextPuzzle('b-1');
			assert.ok(next);
			assert.equal(next?.puzzle.id, 'b-2');
			assert.equal(next?.difficulty, 'beginner');

			const last = getNextPuzzle('b-10');
			assert.equal(last, undefined);
		});
	});

	describe('generatePuzzle', () => {
		for (const difficulty of DIFFICULTIES) {
			it(`procedurally generates valid board for difficulty "${difficulty}"`, () => {
				const expectedSize = DIFFICULTY_GRID_SIZES[difficulty];
				const board = generatePuzzle(difficulty, 42);

				assert.equal(board.difficulty, difficulty);
				assert.equal(board.width, expectedSize.width);
				assert.equal(board.height, expectedSize.height);
				assert.equal(board.bridges.length, 0);
				assert.ok(board.islands.length >= 4);

				const coordSet = new Set<string>();
				for (const island of board.islands) {
					// Coordinate uniqueness
					const key = `${island.x},${island.y}`;
					assert.equal(coordSet.has(key), false, `Duplicate island at ${key}`);
					coordSet.add(key);

					// Boundaries
					assert.ok(island.x >= 0 && island.x < board.width);
					assert.ok(island.y >= 0 && island.y < board.height);

					// Target range 1..8
					assert.ok(island.target >= 1 && island.target <= 8, `Island target out of range: ${island.target}`);
				}

				// Check minimum 1 empty cell between islands orthogonally (no adjacent islands)
				for (let i = 0; i < board.islands.length; i++) {
					for (let j = i + 1; j < board.islands.length; j++) {
						const a = board.islands[i];
						const b = board.islands[j];
						const manhattan = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
						assert.notEqual(
							manhattan,
							1,
							`Islands ${a.id} (${a.x},${a.y}) and ${b.id} (${b.x},${b.y}) are directly adjacent`,
						);
					}
				}
			});
		}

		it('produces identical output with identical seeds (deterministic PRNG)', () => {
			const boardA = generatePuzzle('easy', 98765);
			const boardB = generatePuzzle('easy', 98765);

			assert.deepEqual(boardA.islands, boardB.islands);
		});

		it('produces diverse boards with different seeds', () => {
			const board1 = generatePuzzle('easy', 111);
			const board2 = generatePuzzle('easy', 999);

			assert.notDeepEqual(board1.islands, board2.islands);
		});
	});
});
