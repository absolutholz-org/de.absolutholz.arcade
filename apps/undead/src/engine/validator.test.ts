import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeEdgeClues } from './raycast.ts';
import type { MirrorType, MonsterType, UndeadPuzzle } from './types.ts';
import { validateBoard } from './validator.ts';

describe('Undead Board Validator', () => {
	const mirrors: (MirrorType | null)[][] = [
		[null, '/'],
		['\\', null],
	];
	const solution: (MonsterType | null)[][] = [
		['vampire', null],
		[null, 'ghost'],
	];
	const puzzle: UndeadPuzzle = {
		id: 'test-2x2',
		difficulty: 'easy',
		size: 2,
		mirrors,
		clues: computeEdgeClues(mirrors, solution),
		inventory: { ghost: 1, vampire: 1, zombie: 0 },
		solution,
	};

	it('recognizes a completely solved board with zero errors', () => {
		const res = validateBoard(puzzle, solution);
		assert.equal(res.isSolved, true);
		assert.equal(res.hasErrors, false);
		assert.equal(res.emptySlotCount, 0);
		assert.deepEqual(res.placedCounts, { ghost: 1, vampire: 1, zombie: 0 });
	});

	it('flags over-limit inventory and clue violations', () => {
		const overPlaced: (MonsterType | null)[][] = [
			['vampire', null],
			[null, 'vampire'],
		];
		const res = validateBoard(puzzle, overPlaced);
		assert.equal(res.isSolved, false);
		assert.equal(res.hasErrors, true);
		assert.equal(res.overLimit.vampire, true);
		assert.equal(res.overLimit.ghost, false);
	});

	it('reports incomplete status on partially filled valid boards', () => {
		const partial: (MonsterType | null)[][] = [
			['vampire', null],
			[null, null],
		];
		const res = validateBoard(puzzle, partial);
		assert.equal(res.isSolved, false);
		assert.equal(res.hasErrors, false);
		assert.equal(res.emptySlotCount, 1);
	});
});
