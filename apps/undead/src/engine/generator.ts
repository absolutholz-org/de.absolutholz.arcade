import { computeEdgeClues } from './raycast.ts';
import { countSolutions } from './solver.ts';
import {
	DIFFICULTY_CONFIG,
	type Difficulty,
	MONSTER_TYPES,
	type MirrorType,
	type MonsterCounts,
	type MonsterType,
	type UndeadPuzzle,
} from './types.ts';

function createMulberry32(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function randomInt(rng: () => number, min: number, maxInclusive: number): number {
	return min + Math.floor(rng() * (maxInclusive - min + 1));
}

function shuffleInPlace<T>(items: T[], rng: () => number): T[] {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = items[i];
		const swap = items[j];
		if (tmp !== undefined && swap !== undefined) {
			items[i] = swap;
			items[j] = tmp;
		}
	}
	return items;
}

/**
 * Generates a single candidate Undead puzzle (mirrors + monster solution + derived clues & inventory)
 * without running uniqueness verification.
 */
function buildCandidatePuzzle(difficulty: Difficulty, rng: () => number, id: string): UndeadPuzzle {
	const { size, minMirrors, maxMirrors } = DIFFICULTY_CONFIG[difficulty];
	const mirrorCount = randomInt(rng, minMirrors, maxMirrors);

	const mirrors: (MirrorType | null)[][] = Array.from({ length: size }, () =>
		Array.from({ length: size }, () => null),
	);

	// Shuffle all coordinates and pick mirror positions
	const coords: { readonly row: number; readonly col: number }[] = [];
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			coords.push({ row: r, col: c });
		}
	}
	shuffleInPlace(coords, rng);

	for (let i = 0; i < mirrorCount; i += 1) {
		const coord = coords[i];
		if (!coord) continue;
		const rowArr = mirrors[coord.row];
		if (rowArr) {
			rowArr[coord.col] = rng() < 0.5 ? '/' : '\\';
		}
	}

	// Assign monsters to all remaining slots, guaranteeing at least 1 of each type
	const slotCoords = coords.slice(mirrorCount);
	const solution: (MonsterType | null)[][] = Array.from({ length: size }, () =>
		Array.from({ length: size }, () => null),
	);

	let ghost = 0;
	let vampire = 0;
	let zombie = 0;

	for (let i = 0; i < slotCoords.length; i += 1) {
		const coord = slotCoords[i];
		if (!coord) continue;
		const monster: MonsterType =
			i < MONSTER_TYPES.length
				? (MONSTER_TYPES[i] ?? 'zombie')
				: (MONSTER_TYPES[Math.floor(rng() * MONSTER_TYPES.length)] ?? 'zombie');

		const rowArr = solution[coord.row];
		if (rowArr) {
			rowArr[coord.col] = monster;
		}

		if (monster === 'ghost') ghost += 1;
		else if (monster === 'vampire') vampire += 1;
		else zombie += 1;
	}

	const clues = computeEdgeClues(mirrors, solution);
	const inventory: MonsterCounts = { ghost, vampire, zombie };

	return {
		id,
		difficulty,
		size,
		mirrors,
		clues,
		inventory,
		solution,
	};
}

const FALLBACK_SEEDS: Readonly<Record<Difficulty, number>> = {
	easy: 104729,
	medium: 224737,
	hard: 350377,
	expert: 479909,
};

/**
 * Generates a solver-verified Undead puzzle guaranteed to have strictly one unique solution.
 */
export function generatePuzzle(difficulty: Difficulty, seed?: number): UndeadPuzzle {
	const baseSeed = seed ?? Math.floor(Math.random() * 0xffffffff);
	const rng = createMulberry32(baseSeed);
	const maxAttempts = 600;
	const nodeBudget = difficulty === 'expert' ? 200 : 400;

	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const candidate = buildCandidatePuzzle(difficulty, rng, `undead-${difficulty}-${baseSeed}-${attempt}`);
		if (countSolutions(candidate, 2, nodeBudget) === 1) {
			return candidate;
		}
	}

	// Deterministic fallback search using a known-good seed if random stream was unlucky
	const fallbackRng = createMulberry32(FALLBACK_SEEDS[difficulty]);
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const candidate = buildCandidatePuzzle(difficulty, fallbackRng, `undead-${difficulty}-fb-${attempt}`);
		if (countSolutions(candidate, 2, nodeBudget) === 1) {
			return candidate;
		}
	}

	throw new Error(`Failed to generate unique Undead puzzle for difficulty "${difficulty}".`);
}
