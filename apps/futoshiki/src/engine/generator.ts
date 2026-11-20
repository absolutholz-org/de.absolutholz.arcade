import { countSolutions, requiresInequalities, solveDeductively } from './solver.ts';
import { DIFFICULTY_CONFIG, type Difficulty, type FutoshikiPuzzle, type InequalitySign } from './types.ts';

function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffleInPlace<T>(items: T[], rng: () => number): T[] {
	for (let i = items.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = items[i];
		items[i] = items[j];
		items[j] = tmp;
	}
	return items;
}

/**
 * Generates a randomized valid N × N Latin square via randomized backtracking.
 */
export function generateLatinSquare(size: number, rng: () => number): number[][] {
	const grid: number[][] = Array.from({ length: size }, () => Array<number>(size).fill(0));
	const rowMask = new Array<number>(size).fill(0);
	const colMask = new Array<number>(size).fill(0);

	function fill(index: number): boolean {
		if (index === size * size) return true;
		const r = Math.floor(index / size);
		const c = index % size;
		const used = rowMask[r] | colMask[c];

		const digits: number[] = [];
		for (let d = 1; d <= size; d += 1) {
			if ((used & (1 << (d - 1))) === 0) {
				digits.push(d);
			}
		}
		shuffleInPlace(digits, rng);

		for (const d of digits) {
			const bit = 1 << (d - 1);
			grid[r][c] = d;
			rowMask[r] |= bit;
			colMask[c] |= bit;
			if (fill(index + 1)) return true;
			grid[r][c] = 0;
			rowMask[r] &= ~bit;
			colMask[c] &= ~bit;
		}
		return false;
	}

	fill(0);
	return grid;
}

interface ClueRef {
	readonly kind: 'digit' | 'h' | 'v';
	readonly r: number;
	readonly c: number;
}

function countActiveInequalities(
	hInequalities: readonly (readonly InequalitySign[])[],
	vInequalities: readonly (readonly InequalitySign[])[],
): number {
	let count = 0;
	for (const row of hInequalities) {
		for (const sign of row) {
			if (sign !== null) count += 1;
		}
	}
	for (const row of vInequalities) {
		for (const sign of row) {
			if (sign !== null) count += 1;
		}
	}
	return count;
}

function countActiveGivens(givens: readonly (readonly (number | null)[])[]): number {
	let count = 0;
	for (const row of givens) {
		for (const val of row) {
			if (val !== null) count += 1;
		}
	}
	return count;
}

/**
 * Generates a Futoshiki puzzle for the requested difficulty tier.
 * Guarantees:
 *   1. Unique solution (`countSolutions === 1`).
 *   2. Solvable strictly by deterministic human deduction without guessing.
 *   3. Inequalities are required (plain Latin square without inequalities has > 1 solution).
 */
export function generatePuzzle(difficulty: Difficulty, seed?: number): FutoshikiPuzzle {
	const config = DIFFICULTY_CONFIG[difficulty];
	const { size, minInequalities, maxGivenDigits } = config;
	const baseSeed = seed ?? Math.floor(Math.random() * 0x7fffffff);

	for (let attempt = 0; attempt < 40; attempt += 1) {
		const rng = mulberry32(baseSeed + attempt * 1013904223);
		const solution = generateLatinSquare(size, rng);

		// Start with all true inequalities and a randomized subset of givens
		const hInequalities: InequalitySign[][] = Array.from({ length: size }, (_, r) =>
			Array.from({ length: size - 1 }, (_, c) => (solution[r][c] < solution[r][c + 1] ? '<' : '>')),
		);
		const vInequalities: InequalitySign[][] = Array.from({ length: size - 1 }, (_, r) =>
			Array.from({ length: size }, (_, c) => (solution[r][c] < solution[r + 1][c] ? '<' : '>')),
		);
		const givens: (number | null)[][] = Array.from({ length: size }, (_, r) =>
			Array.from({ length: size }, (_, c) => solution[r][c]),
		);

		// Build shuffled lists of digits and inequalities to prune
		const digitClues: ClueRef[] = [];
		for (let r = 0; r < size; r += 1) {
			for (let c = 0; c < size; c += 1) {
				digitClues.push({ kind: 'digit', r, c });
			}
		}
		shuffleInPlace(digitClues, rng);

		const ineqClues: ClueRef[] = [];
		for (let r = 0; r < size; r += 1) {
			for (let c = 0; c < size - 1; c += 1) {
				ineqClues.push({ kind: 'h', r, c });
			}
		}
		for (let r = 0; r < size - 1; r += 1) {
			for (let c = 0; c < size; c += 1) {
				ineqClues.push({ kind: 'v', r, c });
			}
		}
		shuffleInPlace(ineqClues, rng);

		// Phase 1: Aggressively prune given digits first so inequalities carry real deductive weight
		for (const clue of digitClues) {
			const prev = givens[clue.r][clue.c];
			givens[clue.r][clue.c] = null;
			const deductive = solveDeductively(size, givens, hInequalities, vInequalities);
			if (!deductive.solved) {
				givens[clue.r][clue.c] = prev;
			}
		}

		// Phase 2: Prune redundant inequalities while preserving deductive solvability & minimum count
		let activeIneq = countActiveInequalities(hInequalities, vInequalities);
		for (const clue of ineqClues) {
			if (activeIneq <= minInequalities) break;
			if (clue.kind === 'h') {
				const prev = hInequalities[clue.r][clue.c];
				hInequalities[clue.r][clue.c] = null;
				const deductive = solveDeductively(size, givens, hInequalities, vInequalities);
				if (deductive.solved) {
					activeIneq -= 1;
				} else {
					hInequalities[clue.r][clue.c] = prev;
				}
			} else if (clue.kind === 'v') {
				const prev = vInequalities[clue.r][clue.c];
				vInequalities[clue.r][clue.c] = null;
				const deductive = solveDeductively(size, givens, hInequalities, vInequalities);
				if (deductive.solved) {
					activeIneq -= 1;
				} else {
					vInequalities[clue.r][clue.c] = prev;
				}
			}
		}

		// Verify all hard invariants
		const givenCount = countActiveGivens(givens);
		if (
			activeIneq >= minInequalities &&
			givenCount <= maxGivenDigits + 2 &&
			requiresInequalities({ size, givens }) &&
			countSolutions(size, givens, hInequalities, vInequalities, 2) === 1
		) {
			return {
				id: `futoshiki-${difficulty}-${baseSeed + attempt}`,
				difficulty,
				size,
				givens,
				solution,
				hInequalities,
				vInequalities,
			};
		}
	}

	// Deterministic fallback (should rarely/never trigger, relaxes maxGivenDigits cap)
	const rng = mulberry32(baseSeed ^ 0x9e3779b9);
	const solution = generateLatinSquare(size, rng);
	const hInequalities: InequalitySign[][] = Array.from({ length: size }, (_, r) =>
		Array.from({ length: size - 1 }, (_, c) => (solution[r][c] < solution[r][c + 1] ? '<' : '>')),
	);
	const vInequalities: InequalitySign[][] = Array.from({ length: size - 1 }, (_, r) =>
		Array.from({ length: size }, (_, c) => (solution[r][c] < solution[r + 1][c] ? '<' : '>')),
	);
	const givens: (number | null)[][] = Array.from({ length: size }, (_, r) =>
		Array.from({ length: size }, (_, c) => solution[r][c]),
	);

	const digitClues: ClueRef[] = [];
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			digitClues.push({ kind: 'digit', r, c });
		}
	}
	shuffleInPlace(digitClues, rng);
	for (const clue of digitClues) {
		const prev = givens[clue.r][clue.c];
		givens[clue.r][clue.c] = null;
		if (!solveDeductively(size, givens, hInequalities, vInequalities).solved) {
			givens[clue.r][clue.c] = prev;
		}
	}

	return {
		id: `futoshiki-${difficulty}-${baseSeed}-fallback`,
		difficulty,
		size,
		givens,
		solution,
		hInequalities,
		vInequalities,
	};
}
