import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { BoardState, Bridge, Island } from './types.ts';
import {
	bridgesIntersect,
	canConnect,
	checkVictory,
	getIslandStatus,
	getOrthogonalRaycasts,
	toggleBridge,
} from './validator.ts';

describe('Hashiwokakero Validator Engine', () => {
	describe('1. Line-of-sight raycasting through empty space vs blocked space', () => {
		it('finds unobstructed orthogonal island neighbors in empty space', () => {
			// Center island with neighbors in all 4 cardinal directions
			const islands: Island[] = [
				{ id: 'center', x: 4, y: 4, target: 4 },
				{ id: 'north', x: 4, y: 1, target: 1 },
				{ id: 'south', x: 4, y: 7, target: 1 },
				{ id: 'west', x: 1, y: 4, target: 1 },
				{ id: 'east', x: 7, y: 4, target: 1 },
			];
			const state: BoardState = {
				islands,
				bridges: [],
				difficulty: 'medium',
				width: 10,
				height: 10,
			};

			const raycasts = getOrthogonalRaycasts('center', state);
			const neighborIds = raycasts.map((isl) => isl.id).sort();

			assert.deepEqual(neighborIds, ['east', 'north', 'south', 'west']);
		});

		it('stops raycast when blocked by an intermediate island and does not see further islands', () => {
			// Center at (4,4), intermediate island at (4,2), distant island at (4,0)
			const islands: Island[] = [
				{ id: 'center', x: 4, y: 4, target: 2 },
				{ id: 'blocker-north', x: 4, y: 2, target: 2 },
				{ id: 'distant-north', x: 4, y: 0, target: 1 },
				{ id: 'blocker-east', x: 6, y: 4, target: 2 },
				{ id: 'distant-east', x: 8, y: 4, target: 1 },
			];
			const state: BoardState = {
				islands,
				bridges: [],
				difficulty: 'medium',
				width: 10,
				height: 10,
			};

			const raycasts = getOrthogonalRaycasts('center', state);
			const neighborIds = raycasts.map((isl) => isl.id).sort();

			// Only the closest blockers are detected, distant islands are occluded
			assert.deepEqual(neighborIds, ['blocker-east', 'blocker-north']);
			assert.equal(neighborIds.includes('distant-north'), false);
			assert.equal(neighborIds.includes('distant-east'), false);

			// canConnect must reject connecting to the occluded island
			assert.equal(canConnect('center', 'distant-north', state), false);
			assert.equal(canConnect('center', 'blocker-north', state), true);
			assert.equal(canConnect('blocker-north', 'distant-north', state), true);
		});

		it('returns empty array when island has no orthogonal peers', () => {
			const islands: Island[] = [
				{ id: 'isolated', x: 2, y: 2, target: 0 },
				{ id: 'diagonal', x: 5, y: 5, target: 0 },
			];
			const state: BoardState = {
				islands,
				bridges: [],
				difficulty: 'easy',
				width: 8,
				height: 8,
			};

			assert.deepEqual(getOrthogonalRaycasts('isolated', state), []);
			assert.equal(canConnect('isolated', 'diagonal', state), false);
		});
	});

	describe('2. Perpendicular bridge intersection rejection', () => {
		const islands: Island[] = [
			{ id: 'h1', x: 1, y: 3, target: 2 },
			{ id: 'h2', x: 5, y: 3, target: 2 },
			{ id: 'v1', x: 3, y: 1, target: 2 },
			{ id: 'v2', x: 3, y: 5, target: 2 },
			{ id: 'corner', x: 1, y: 1, target: 2 },
		];
		const islandMap = new Map(islands.map((i) => [i.id, i]));

		it('detects perpendicular bridge intersection in open space', () => {
			const bridgeH: Bridge = {
				id: 'h',
				fromId: 'h1',
				toId: 'h2',
				count: 1,
				orientation: 'horizontal',
			};
			const bridgeV: Bridge = {
				id: 'v',
				fromId: 'v1',
				toId: 'v2',
				count: 1,
				orientation: 'vertical',
			};

			assert.equal(bridgesIntersect(bridgeH, bridgeV, islandMap), true);
			assert.equal(bridgesIntersect(bridgeV, bridgeH, islandMap), true);
		});

		it('does not reject perpendicular bridges meeting at a shared island endpoint', () => {
			const bridgeH: Bridge = {
				id: 'b1',
				fromId: 'corner',
				toId: 'v1',
				count: 1,
				orientation: 'horizontal',
			}; // (1,1) to (3,1)
			const bridgeV: Bridge = {
				id: 'b2',
				fromId: 'corner',
				toId: 'h1',
				count: 1,
				orientation: 'vertical',
			}; // (1,1) to (1,3)

			assert.equal(bridgesIntersect(bridgeH, bridgeV, islandMap), false);
		});

		it('returns false for parallel bridges', () => {
			const b1: Bridge = {
				id: 'b1',
				fromId: 'h1',
				toId: 'h2',
				count: 1,
				orientation: 'horizontal',
			};
			const b2: Bridge = {
				id: 'b2',
				fromId: 'corner',
				toId: 'v1',
				count: 1,
				orientation: 'horizontal',
			};

			assert.equal(bridgesIntersect(b1, b2, islandMap), false);
		});

		it('canConnect rejects placement crossing an existing perpendicular bridge', () => {
			const stateWithVerticalBridge: BoardState = {
				islands,
				bridges: [
					{
						id: 'bridge-v',
						fromId: 'v1',
						toId: 'v2',
						count: 1,
						orientation: 'vertical',
					},
				],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			// Attempting to place horizontal bridge h1-h2 which crosses v1-v2
			assert.equal(canConnect('h1', 'h2', stateWithVerticalBridge), false);

			// Toggling bridge must return unchanged state without creating bridge
			const nextState = toggleBridge('h1', 'h2', stateWithVerticalBridge);
			assert.equal(nextState.bridges.length, 1);
			assert.equal(nextState.bridges[0].id, 'bridge-v');
		});
	});

	describe('3. Bridge count transitions (0 -> 1 -> 2 -> remove)', () => {
		it('cycles through count 1, count 2, and removal', () => {
			const islands: Island[] = [
				{ id: 'a', x: 1, y: 1, target: 2 },
				{ id: 'b', x: 4, y: 1, target: 2 },
			];
			const initialState: BoardState = {
				islands,
				bridges: [],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			// 0 -> 1
			const state1 = toggleBridge('a', 'b', initialState);
			assert.equal(state1.bridges.length, 1);
			assert.equal(state1.bridges[0].count, 1);
			assert.equal(state1.bridges[0].orientation, 'horizontal');

			// 1 -> 2 (invoked in reverse order 'b' -> 'a' should target the same bridge)
			const state2 = toggleBridge('b', 'a', state1);
			assert.equal(state2.bridges.length, 1);
			assert.equal(state2.bridges[0].count, 2);

			// 2 -> 0 (remove)
			const state3 = toggleBridge('a', 'b', state2);
			assert.equal(state3.bridges.length, 0);

			// 0 -> 1 (re-add)
			const state4 = toggleBridge('a', 'b', state3);
			assert.equal(state4.bridges.length, 1);
			assert.equal(state4.bridges[0].count, 1);
		});

		it('updates island status through under, satisfied, and overflow', () => {
			const islands: Island[] = [
				{ id: 'a', x: 0, y: 0, target: 1 },
				{ id: 'b', x: 3, y: 0, target: 1 },
			];
			const state0: BoardState = {
				islands,
				bridges: [],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			assert.deepEqual(getIslandStatus('a', state0), {
				status: 'under',
				current: 0,
				target: 1,
			});

			const state1 = toggleBridge('a', 'b', state0);
			assert.deepEqual(getIslandStatus('a', state1), {
				status: 'satisfied',
				current: 1,
				target: 1,
			});

			const state2 = toggleBridge('a', 'b', state1);
			assert.deepEqual(getIslandStatus('a', state2), {
				status: 'overflow',
				current: 2,
				target: 1,
			});
		});
	});

	describe('4. Victory check rejection on closed sub-graphs forming disconnected networks', () => {
		it('rejects victory when counts are satisfied locally but form 2 disconnected networks', () => {
			// Sub-graph 1: Islands A and B at y=0, target 2 each, connected with a double bridge
			// Sub-graph 2: Islands C and D at y=4, target 2 each, connected with a double bridge
			const islands: Island[] = [
				{ id: 'a', x: 0, y: 0, target: 2 },
				{ id: 'b', x: 3, y: 0, target: 2 },
				{ id: 'c', x: 0, y: 4, target: 2 },
				{ id: 'd', x: 3, y: 4, target: 2 },
			];

			const disconnectedState: BoardState = {
				islands,
				bridges: [
					{
						id: 'bridge-a-b',
						fromId: 'a',
						toId: 'b',
						count: 2,
						orientation: 'horizontal',
					},
					{
						id: 'bridge-c-d',
						fromId: 'c',
						toId: 'd',
						count: 2,
						orientation: 'horizontal',
					},
				],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			// All 4 islands locally satisfy current === target
			assert.equal(getIslandStatus('a', disconnectedState).status, 'satisfied');
			assert.equal(getIslandStatus('b', disconnectedState).status, 'satisfied');
			assert.equal(getIslandStatus('c', disconnectedState).status, 'satisfied');
			assert.equal(getIslandStatus('d', disconnectedState).status, 'satisfied');

			// MUST be rejected because graph is not 1 connected component
			assert.equal(checkVictory(disconnectedState), false);
		});

		it('accepts victory when all island quotas match AND form a single connected component', () => {
			// 4 islands forming a connected loop/cycle: A-(1)-B, B-(1)-D, D-(1)-C, C-(1)-A
			// Each island target is 2
			const islands: Island[] = [
				{ id: 'a', x: 0, y: 0, target: 2 },
				{ id: 'b', x: 3, y: 0, target: 2 },
				{ id: 'c', x: 0, y: 3, target: 2 },
				{ id: 'd', x: 3, y: 3, target: 2 },
			];

			const solvedState: BoardState = {
				islands,
				bridges: [
					{
						id: 'bridge-a-b',
						fromId: 'a',
						toId: 'b',
						count: 1,
						orientation: 'horizontal',
					},
					{
						id: 'bridge-b-d',
						fromId: 'b',
						toId: 'd',
						count: 1,
						orientation: 'vertical',
					},
					{
						id: 'bridge-c-d',
						fromId: 'c',
						toId: 'd',
						count: 1,
						orientation: 'horizontal',
					},
					{
						id: 'bridge-a-c',
						fromId: 'a',
						toId: 'c',
						count: 1,
						orientation: 'vertical',
					},
				],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			assert.equal(checkVictory(solvedState), true);
		});

		it('rejects victory when any island is not satisfied or board is empty', () => {
			const islands: Island[] = [
				{ id: 'a', x: 0, y: 0, target: 2 },
				{ id: 'b', x: 3, y: 0, target: 2 },
			];
			const partialState: BoardState = {
				islands,
				bridges: [
					{
						id: 'bridge-a-b',
						fromId: 'a',
						toId: 'b',
						count: 1,
						orientation: 'horizontal',
					},
				],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};

			assert.equal(checkVictory(partialState), false);

			const emptyState: BoardState = {
				islands: [],
				bridges: [],
				difficulty: 'beginner',
				width: 6,
				height: 6,
			};
			assert.equal(checkVictory(emptyState), false);
		});
	});
});
