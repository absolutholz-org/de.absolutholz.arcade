import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSeededRng, getRandomInt } from '../src/cryptoRng';

describe('cryptoRng', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('keeps generated integers strictly within [min, max] across 10,000 iterations', () => {
		const observedFaces = new Set<number>();

		for (let i = 0; i < 10_000; i += 1) {
			const roll = getRandomInt(1, 6);
			expect(Number.isInteger(roll)).toBe(true);
			expect(roll).toBeGreaterThanOrEqual(1);
			expect(roll).toBeLessThanOrEqual(6);
			observedFaces.add(roll);
		}

		expect(observedFaces.size).toBe(6);
	});

	it('supports negative, zero-crossing, and d100 ranges across 10,000 iterations', () => {
		for (let i = 0; i < 5_000; i += 1) {
			const signedValue = getRandomInt(-10, 10);
			expect(Number.isInteger(signedValue)).toBe(true);
			expect(signedValue).toBeGreaterThanOrEqual(-10);
			expect(signedValue).toBeLessThanOrEqual(10);

			const percentile = getRandomInt(1, 100);
			expect(Number.isInteger(percentile)).toBe(true);
			expect(percentile).toBeGreaterThanOrEqual(1);
			expect(percentile).toBeLessThanOrEqual(100);
		}
	});

	it('returns min immediately when min equals max', () => {
		expect(getRandomInt(4, 4)).toBe(4);
		expect(getRandomInt(0, 0)).toBe(0);
	});

	it('eliminates modulo bias by rejecting samples inside the trailing remainder bucket', () => {
		// For range = 6, 2^32 % 6 = 4, so unbiasedLimit = 4_294_967_292 (0xffff_fffc).
		// Values >= 0xffff_fffc must be discarded and resampled.
		const biasedSamples = [0xffff_ffff, 0xffff_fffe, 0xffff_fffc, 5];
		let callIndex = 0;

		const spy = vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation((array) => {
			if (array instanceof Uint32Array) {
				array[0] = biasedSamples[callIndex] ?? 0;
				callIndex += 1;
			}
			return array;
		});

		const result = getRandomInt(1, 6);
		expect(spy).toHaveBeenCalledTimes(4);
		expect(result).toBe(6);
	});

	it('produces deterministic, repeatable sequences via createSeededRng', () => {
		const rngA = createSeededRng(123456);
		const rngB = createSeededRng(123456);
		const rngDifferent = createSeededRng(654321);

		const sequenceA = Array.from({ length: 20 }, () => getRandomInt(1, 20, rngA));
		const sequenceB = Array.from({ length: 20 }, () => getRandomInt(1, 20, rngB));
		const sequenceDifferent = Array.from({ length: 20 }, () => getRandomInt(1, 20, rngDifferent));

		expect(sequenceA).toEqual(sequenceB);
		expect(sequenceA).not.toEqual(sequenceDifferent);
	});

	it('supports custom mock RNG generators and validates [0, 1) bounds', () => {
		expect(getRandomInt(1, 6, () => 0)).toBe(1);
		expect(getRandomInt(1, 6, () => 0.5)).toBe(4);
		expect(getRandomInt(1, 6, () => 0.999999)).toBe(6);

		expect(() => getRandomInt(1, 6, () => -0.01)).toThrow(RangeError);
		expect(() => getRandomInt(1, 6, () => 1)).toThrow(RangeError);
		expect(() => getRandomInt(1, 6, () => Number.NaN)).toThrow(RangeError);
	});

	it('throws RangeError for invalid bounds or non-finite seeds', () => {
		expect(() => getRandomInt(6, 1)).toThrow(RangeError);
		expect(() => getRandomInt(1.5, 6)).toThrow(RangeError);
		expect(() => getRandomInt(1, Number.NaN)).toThrow(RangeError);
		expect(() => getRandomInt(0, 0x1_0000_0000)).toThrow(RangeError);
		expect(() => createSeededRng(Number.POSITIVE_INFINITY)).toThrow(RangeError);
	});

	it('throws a descriptive error when crypto.getRandomValues is unavailable', () => {
		vi.stubGlobal('crypto', undefined);
		expect(() => getRandomInt(1, 6)).toThrow(/crypto\.getRandomValues/i);
		vi.unstubAllGlobals();
	});
});
