import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeEdgeClues } from './raycast.ts';
import { countSolutions, solveUndead } from './solver.ts';
import type { MirrorType, MonsterType } from './types.ts';

describe('Undead Constraint-Propagation & Backtracking Solver', () => {
	it('finds the unique solution for a deterministic 3x3 puzzle', () => {
		const mirrors: (MirrorType | null)[][] = [
			[null, '/', null],
			[null, null, '\\'],
			['\\', null, null],
		];
		const solution: (MonsterType | null)[][] = [
			['vampire', null, 'ghost'],
			['zombie', 'ghost', null],
			[null, 'vampire', 'zombie'],
		];
		const clues = computeEdgeClues(mirrors, solution);
		const result = solveUndead({
			size: 3,
			mirrors,
			clues,
			inventory: { ghost: 2, vampire: 2, zombie: 2 },
		});

		assert.equal(result.count, 1);
		assert.deepEqual(result.solution, solution);
	});

	it('detects ambiguous boards with multiple solutions', () => {
		// 2x2 grid with no mirrors and 1 vampire + 1 zombie in a symmetric layout has > 1 solution
		const mirrors: (MirrorType | null)[][] = [
			[null, null],
			[null, null],
		];
		const solution: (MonsterType | null)[][] = [
			['vampire', 'ghost'],
			['ghost', 'vampire'],
		];
		const clues = computeEdgeClues(mirrors, solution);
		const count = countSolutions(
			{
				size: 2,
				mirrors,
				clues,
				inventory: { ghost: 2, vampire: 2, zombie: 0 },
			},
			2,
		);
		assert.equal(count, 2);
	});

	it('returns 0 solutions when inventory or clues are unsatisfiable', () => {
		const mirrors: (MirrorType | null)[][] = [
			[null, null],
			[null, null],
		];
		const result = solveUndead({
			size: 2,
			mirrors,
			clues: {
				top: [2, 2],
				right: [2, 2],
				bottom: [2, 2],
				left: [2, 2],
			},
			inventory: { ghost: 4, vampire: 0, zombie: 0 },
		});
		assert.equal(result.count, 0);
		assert.equal(result.solution, null);
	});
});
