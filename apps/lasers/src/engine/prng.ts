/**
 * Mulberry32 deterministic 32-bit PRNG for reproducible seeded puzzle generation.
 */
export interface Prng {
	next(): number;
	nextInt(maxExclusive: number): number;
	nextRange(minInclusive: number, maxInclusive: number): number;
	pick<T>(items: readonly T[]): T;
	shuffle<T>(items: readonly T[]): T[];
}

export function createPrng(seed: number): Prng {
	let state = seed >>> 0;

	const next = (): number => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};

	const nextInt = (maxExclusive: number): number => {
		if (maxExclusive <= 0) return 0;
		return Math.floor(next() * maxExclusive);
	};

	const nextRange = (minInclusive: number, maxInclusive: number): number => {
		if (maxInclusive <= minInclusive) return minInclusive;
		return minInclusive + nextInt(maxInclusive - minInclusive + 1);
	};

	const pick = <T>(items: readonly T[]): T => {
		return items[nextInt(items.length)];
	};

	const shuffle = <T>(items: readonly T[]): T[] => {
		const copy = [...items];
		for (let i = copy.length - 1; i > 0; i -= 1) {
			const j = nextInt(i + 1);
			const tmp = copy[i];
			copy[i] = copy[j];
			copy[j] = tmp;
		}
		return copy;
	};

	return { next, nextInt, nextRange, pick, shuffle };
}

export function createRandomSeed(): number {
	return Math.floor(Math.random() * 0x7fffffff) + 1;
}
