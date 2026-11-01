import type { RandomGenerator } from './types';

const UINT32_RANGE = 0x1_0000_0000;
const randomWordBuffer = new Uint32Array(1);

function getCryptoUint32(): number {
	if (typeof globalThis.crypto?.getRandomValues !== 'function') {
		throw new Error('Cryptographically secure RNG (crypto.getRandomValues) is unavailable in this environment.');
	}

	globalThis.crypto.getRandomValues(randomWordBuffer);
	return randomWordBuffer[0] ?? 0;
}

/**
 * Generates an unbiased integer uniformly distributed across [min, max] (inclusive).
 * Uses rejection sampling over `crypto.getRandomValues()` to eliminate modulo bias,
 * unless a deterministic `customRng` returning floats in `[0, 1)` is supplied.
 */
export function getRandomInt(min: number, max: number, customRng?: RandomGenerator): number {
	if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
		throw new RangeError(`Bounds min (${min}) and max (${max}) must be safe integers.`);
	}

	if (min > max) {
		throw new RangeError(`Lower bound min (${min}) must be less than or equal to max (${max}).`);
	}

	const range = max - min + 1;
	if (range > UINT32_RANGE) {
		throw new RangeError(`Requested range (${range}) exceeds maximum 32-bit unsigned integer span.`);
	}

	if (customRng !== undefined) {
		const sample = customRng();
		if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
			throw new RangeError(`Custom RNG must return a finite float in [0, 1), received ${sample}.`);
		}
		return Math.floor(sample * range) + min;
	}

	if (range === 1) {
		return min;
	}

	// Reject samples in the trailing incomplete bucket so every outcome has identical probability.
	const unbiasedLimit = UINT32_RANGE - (UINT32_RANGE % range);
	let sample = getCryptoUint32();
	while (sample >= unbiasedLimit) {
		sample = getCryptoUint32();
	}

	return (sample % range) + min;
}

/**
 * Creates a deterministic Mulberry32 pseudo-random generator returning floats in [0, 1)
 * for repeatable unit testing and seeded simulations.
 */
export function createSeededRng(seed: number): RandomGenerator {
	if (!Number.isFinite(seed)) {
		throw new RangeError(`Seed must be a finite number, received ${seed}.`);
	}

	let state = seed | 0;

	return (): number => {
		state = (state + 0x6d2b79f5) | 0;
		let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
		mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
		return ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;
	};
}
