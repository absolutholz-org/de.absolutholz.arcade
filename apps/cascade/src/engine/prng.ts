/**
 * Mulberry32 deterministic PRNG for reproducible seeded Cascade board generation.
 */
export interface SeededRng {
	/** Returns a floating point number in [0, 1) */
	readonly next: () => number;
	/** Returns an integer in [min, max] inclusive */
	readonly nextInt: (min: number, max: number) => number;
}

export function createPrng(seed: number): SeededRng {
	let state = seed >>> 0;

	const next = (): number => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};

	const nextInt = (min: number, max: number): number => {
		if (max <= min) return min;
		return min + Math.floor(next() * (max - min + 1));
	};

	return { next, nextInt };
}
