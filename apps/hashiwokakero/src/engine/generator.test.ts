import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import { STATIC_PUZZLES, getStaticPuzzle } from './puzzles.ts';
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

		it('cycles through indices if index exceeds available puzzles', () => {
			const totalBeginner = STATIC_PUZZLES.beginner.length;
			assert.ok(totalBeginner >= 2);

			const p0 = getStaticPuzzle('beginner', 0);
			const p1 = getStaticPuzzle('beginner', 1);
			const pCycled = getStaticPuzzle('beginner', totalBeginner);

			assert.notDeepEqual(p0.islands, p1.islands);
			assert.deepEqual(p0.islands, pCycled.islands);
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
