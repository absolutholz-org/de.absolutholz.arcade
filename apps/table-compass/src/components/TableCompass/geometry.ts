import type { PickMode, Seat } from './TableCompass.types.ts';
import { MAX_PLAYERS, MIN_PLAYERS, PLAYER_CONFIGS } from './constants.ts';

export function calculateAngleDeg(dx: number, dy: number): number {
	const rad = Math.atan2(dy, dx);
	const deg = (rad * 180) / Math.PI;
	return (deg + 360) % 360;
}

export function getShortestRotation(currentAngle: number, targetAngle: number): number {
	const diff = ((targetAngle - (currentAngle % 360) + 540) % 360) - 180;
	return currentAngle + diff;
}

export function generateSeatsForCount(count: number, _pickMode: PickMode): Seat[] {
	const safeCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, count));
	const starterIdx = Math.floor(Math.random() * safeCount);
	const seats: Seat[] = [];

	for (let i = 0; i < safeCount; i++) {
		// Evenly distribute around circle starting from top (270 deg)
		const angleDeg = (i * (360 / safeCount) + 270) % 360;
		const rad = (angleDeg * Math.PI) / 180;
		// Circle centered at (0.5, 0.5) with radius 0.38
		const x = 0.5 + 0.38 * Math.cos(rad);
		const y = 0.5 + 0.38 * Math.sin(rad);
		const isStarter = i === starterIdx;
		const rank = ((i - starterIdx + safeCount) % safeCount) + 1;

		seats.push({
			id: `seat-${i}-${Date.now()}`,
			playerConfigIndex: i % PLAYER_CONFIGS.length,
			name: PLAYER_CONFIGS[i % PLAYER_CONFIGS.length].defaultNameKey,
			x,
			y,
			angleDeg,
			isStarter,
			turnRank: rank,
		});
	}

	return seats;
}
