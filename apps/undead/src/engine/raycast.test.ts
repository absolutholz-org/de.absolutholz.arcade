import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countVisibleAlongRay, isMonsterVisible, reflectDirection, traceRay } from './raycast.ts';
import type { MirrorType, MonsterType } from './types.ts';

describe('Undead Raycasting Engine', () => {
	it('reflects directions accurately off / and \\ mirrors', () => {
		// / reflects N <-> E and S <-> W
		assert.equal(reflectDirection('N', '/'), 'E');
		assert.equal(reflectDirection('E', '/'), 'N');
		assert.equal(reflectDirection('S', '/'), 'W');
		assert.equal(reflectDirection('W', '/'), 'S');

		// \ reflects N <-> W and S <-> E
		assert.equal(reflectDirection('N', '\\'), 'W');
		assert.equal(reflectDirection('W', '\\'), 'N');
		assert.equal(reflectDirection('S', '\\'), 'E');
		assert.equal(reflectDirection('E', '\\'), 'S');
	});

	it('evaluates monster visibility rules before and after reflection', () => {
		assert.equal(isMonsterVisible('zombie', false), true);
		assert.equal(isMonsterVisible('zombie', true), true);

		assert.equal(isMonsterVisible('vampire', false), true);
		assert.equal(isMonsterVisible('vampire', true), false);

		assert.equal(isMonsterVisible('ghost', false), false);
		assert.equal(isMonsterVisible('ghost', true), true);
	});

	it('traces a ray across mirrors and counts a monster twice when crossed twice', () => {
		// 3x3 grid with mirrors forming a U-turn so a ray from left-0 crosses (0,0) and (1,0) or crosses a cell twice:
		// Row 0: [ null,   '\\', null ]
		// Row 1: [ '/',    '/',  null ]  -> Wait: let's build an explicit self-crossing path!
		// Ray enters top-1 going S:
		// (0,1) slot -> (1,1) slot -> (2,1) '/' reflects S->W -> (2,0) '\' reflects W->N -> (1,0) '/' reflects N->E -> (1,1) slot AGAIN! -> (1,2) slot -> exits right
		const mirrors: (MirrorType | null)[][] = [
			[null, null, null],
			['/', null, null],
			['\\', '/', null],
		];

		const ray = traceRay(mirrors, 'top', 1);
		const visitedSlots = ray.steps.filter((s) => !s.isMirror).map((s) => `${s.row},${s.col}:${s.hasReflected}`);
		assert.deepEqual(visitedSlots, ['0,1:false', '1,1:false', '1,1:true', '1,2:true']);

		// Place a zombie at (1,1): should be counted TWICE (once direct, once reflected)
		const zombieGrid: (MonsterType | null)[][] = [
			[null, 'ghost', null], // (0,1) direct ghost -> 0
			[null, 'zombie', 'vampire'], // (1,1) zombie (direct+reflected = 2), (1,2) reflected vampire -> 0
			[null, null, null],
		];
		assert.equal(countVisibleAlongRay(ray, zombieGrid), 2);

		// Place a ghost at (1,1): visible only on the reflected pass -> 1
		const ghostGrid: (MonsterType | null)[][] = [
			[null, 'vampire', null], // (0,1) direct vampire -> 1
			[null, 'ghost', 'ghost'], // (1,1) ghost (reflected = 1), (1,2) ghost (reflected = 1)
			[null, null, null],
		];
		assert.equal(countVisibleAlongRay(ray, ghostGrid), 3);

		// Place a vampire at (1,1): visible only on the direct pass -> 1
		const vampireGrid: (MonsterType | null)[][] = [
			[null, 'ghost', null], // 0
			[null, 'vampire', 'vampire'], // (1,1) direct vampire -> 1, (1,2) reflected vampire -> 0
			[null, null, null],
		];
		assert.equal(countVisibleAlongRay(ray, vampireGrid), 1);
	});
});
