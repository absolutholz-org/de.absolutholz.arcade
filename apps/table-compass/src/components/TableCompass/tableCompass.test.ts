import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MAX_PLAYERS, MIN_PLAYERS, PLAYER_CONFIGS } from './constants.ts';
import { calculateAngleDeg, generateSeatsForCount, getShortestRotation } from './geometry.ts';

describe('Table Compass Seat Generation & Geometry', () => {
	it('generates valid seats for player counts between 2 and 8', () => {
		for (let count = MIN_PLAYERS; count <= MAX_PLAYERS; count++) {
			const seats = generateSeatsForCount(count, 'first-player');
			assert.equal(seats.length, count, `Expected ${count} seats`);

			// Exactly one starter
			const starters = seats.filter((s) => s.isStarter);
			assert.equal(starters.length, 1, 'Expected exactly one starter');

			// Turn ranks 1..N are unique
			const ranks = seats.map((s) => s.turnRank).sort((a, b) => (a ?? 0) - (b ?? 0));
			assert.deepEqual(
				ranks,
				Array.from({ length: count }, (_, i) => i + 1),
				'Expected unique turn ranks 1..N',
			);

			// Shapes and colors are assigned
			for (const seat of seats) {
				const config = PLAYER_CONFIGS[seat.playerConfigIndex];
				assert.ok(config, 'Seat must reference valid player configuration');
				assert.ok(config.color.startsWith('oklch('), 'Color must use OKLCH design token');
				assert.ok(config.icon, 'Seat must have an icon badge');
				assert.ok(config.shape, 'Seat must have a distinct shape');
			}
		}
	});

	it('clamps player count to [MIN_PLAYERS, MAX_PLAYERS]', () => {
		const underSeats = generateSeatsForCount(1, 'first-player');
		assert.equal(underSeats.length, MIN_PLAYERS, 'Should clamp to MIN_PLAYERS');

		const overSeats = generateSeatsForCount(12, 'first-player');
		assert.equal(overSeats.length, MAX_PLAYERS, 'Should clamp to MAX_PLAYERS');
	});

	it('calculates clockwise angular progression around circle', () => {
		const count = 4;
		const seats = generateSeatsForCount(count, 'turn-order');

		// Check normalized coordinates are within [0..1]
		for (const seat of seats) {
			assert.ok(seat.x >= 0 && seat.x <= 1, `X coordinate out of bounds: ${seat.x}`);
			assert.ok(seat.y >= 0 && seat.y <= 1, `Y coordinate out of bounds: ${seat.y}`);
			assert.ok(seat.angleDeg >= 0 && seat.angleDeg < 360, `Angle out of range: ${seat.angleDeg}`);
		}
	});

	it('calculates angle correctly using calculateAngleDeg', () => {
		// (1, 0) is 0 deg (3 o'clock)
		assert.equal(Math.round(calculateAngleDeg(1, 0)), 0);
		// (0, 1) is 90 deg (6 o'clock)
		assert.equal(Math.round(calculateAngleDeg(0, 1)), 90);
		// (-1, 0) is 180 deg (9 o'clock)
		assert.equal(Math.round(calculateAngleDeg(-1, 0)), 180);
		// (0, -1) is 270 deg (12 o'clock)
		assert.equal(Math.round(calculateAngleDeg(0, -1)), 270);
	});

	it('computes shortest angular path for needle rotation without wrapping wildly', () => {
		// When moving from 350 deg to 10 deg: delta should be +20 deg, not -340 deg
		const rotation1 = getShortestRotation(350, 10);
		assert.equal(rotation1, 370); // 350 + 20

		// When moving from 10 deg to 350 deg: delta should be -20 deg, not +340 deg
		const rotation2 = getShortestRotation(10, 350);
		assert.equal(rotation2, -10); // 10 - 20

		// When moving from 0 deg to 90 deg: delta should be +90 deg
		const rotation3 = getShortestRotation(0, 90);
		assert.equal(rotation3, 90);
	});
});
