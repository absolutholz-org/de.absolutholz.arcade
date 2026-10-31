import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countPorts, getTileShape, hasDirection, rotateCCW, rotateCW, rotateMask } from './rotator.ts';
import { DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST } from './types.ts';

describe('Net Engine: Rotator', () => {
	it('rotates direction bits clockwise (CW) correctly', () => {
		assert.equal(rotateCW(DIR_NORTH), DIR_EAST);
		assert.equal(rotateCW(DIR_EAST), DIR_SOUTH);
		assert.equal(rotateCW(DIR_SOUTH), DIR_WEST);
		assert.equal(rotateCW(DIR_WEST), DIR_NORTH);
	});

	it('rotates direction bits counter-clockwise (CCW) correctly', () => {
		assert.equal(rotateCCW(DIR_NORTH), DIR_WEST);
		assert.equal(rotateCCW(DIR_WEST), DIR_SOUTH);
		assert.equal(rotateCCW(DIR_SOUTH), DIR_EAST);
		assert.equal(rotateCCW(DIR_EAST), DIR_NORTH);
	});

	it('completes a full 360-degree cycle after 4 rotations', () => {
		const mask = DIR_NORTH | DIR_EAST; // 3
		const rot1 = rotateCW(mask);
		const rot2 = rotateCW(rot1);
		const rot3 = rotateCW(rot2);
		const rot4 = rotateCW(rot3);
		assert.equal(rot4, mask);
	});

	it('handles reverse rotation via rotateMask', () => {
		const mask = DIR_NORTH | DIR_SOUTH;
		const cw = rotateMask(mask, 'cw');
		assert.equal(rotateMask(cw, 'ccw'), mask);
	});

	it('checks directions and counts ports correctly', () => {
		const mask = DIR_NORTH | DIR_SOUTH | DIR_EAST;
		assert.equal(hasDirection(mask, DIR_NORTH), true);
		assert.equal(hasDirection(mask, DIR_EAST), true);
		assert.equal(hasDirection(mask, DIR_SOUTH), true);
		assert.equal(hasDirection(mask, DIR_WEST), false);
		assert.equal(countPorts(mask), 3);
	});

	it('classifies tile shapes correctly', () => {
		assert.equal(getTileShape(0), 'empty');
		assert.equal(getTileShape(DIR_NORTH), 'endpoint');
		assert.equal(getTileShape(DIR_NORTH | DIR_SOUTH), 'straight');
		assert.equal(getTileShape(DIR_EAST | DIR_WEST), 'straight');
		assert.equal(getTileShape(DIR_NORTH | DIR_EAST), 'corner');
		assert.equal(getTileShape(DIR_SOUTH | DIR_WEST), 'corner');
		assert.equal(getTileShape(DIR_NORTH | DIR_EAST | DIR_SOUTH), 'tee');
		assert.equal(getTileShape(DIR_NORTH | DIR_EAST | DIR_SOUTH | DIR_WEST), 'cross');
	});
});
