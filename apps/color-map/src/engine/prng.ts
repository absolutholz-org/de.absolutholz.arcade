/**
 * Mulberry32 deterministic PRNG for reproducible seeded map generation.
 */
export interface SeededRng {
	/** Returns a floating point number in [0, 1) */
	readonly next: () => number;
	/** Returns an integer in [min, max] inclusive */
	readonly nextInt: (min: number, max: number) => number;
	/** Shuffles an array in place using Fisher-Yates */
	readonly shuffle: <T>(items: T[]) => T[];
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

	const shuffle = <T>(items: T[]): T[] => {
		for (let i = items.length - 1; i > 0; i -= 1) {
			const j = Math.floor(next() * (i + 1));
			const tmp = items[i];
			items[i] = items[j];
			items[j] = tmp;
		}
		return items;
	};

	return { next, nextInt, shuffle };
}
