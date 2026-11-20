import type { DeductionTechnique, FutoshikiBoard, FutoshikiPuzzle, HintStep, InequalitySign } from './types.ts';

export interface DeductiveSolveResult {
	readonly solved: boolean;
	readonly contradiction: boolean;
	readonly grid: readonly (readonly (number | null)[])[];
	readonly steps: readonly HintStep[];
}

function fullMask(size: number): number {
	return (1 << size) - 1;
}

function minDigit(mask: number): number {
	if (mask === 0) return 0;
	let d = 1;
	let m = mask;
	while ((m & 1) === 0) {
		m >>= 1;
		d += 1;
	}
	return d;
}

function maxDigit(mask: number, size: number): number {
	for (let d = size; d >= 1; d -= 1) {
		if ((mask & (1 << (d - 1))) !== 0) {
			return d;
		}
	}
	return 0;
}

function singleDigit(mask: number): number | null {
	if (mask === 0 || (mask & (mask - 1)) !== 0) return null;
	return minDigit(mask);
}

function popcount(mask: number): number {
	let count = 0;
	let m = mask;
	while (m !== 0) {
		m &= m - 1;
		count += 1;
	}
	return count;
}

/**
 * Eliminates candidates in `larger` that are <= min(smaller) and
 * eliminates candidates in `smaller` that are >= max(larger).
 * Returns true if either mask changed.
 */
function tightenPair(
	domains: number[][],
	rSmall: number,
	cSmall: number,
	rLarge: number,
	cLarge: number,
	size: number,
	touchedByInequality: boolean[][],
): boolean {
	const smallMask = domains[rSmall][cSmall];
	const largeMask = domains[rLarge][cLarge];
	if (smallMask === 0 || largeMask === 0) return false;

	let changed = false;

	// Any value in large must be strictly greater than min(small)
	const minSmall = minDigit(smallMask);
	// Mask of bits strictly greater than minSmall (digits minSmall + 1 .. size)
	const allowedLarge = fullMask(size) & ~((1 << minSmall) - 1);
	const nextLarge = largeMask & allowedLarge;
	if (nextLarge !== largeMask) {
		domains[rLarge][cLarge] = nextLarge;
		touchedByInequality[rLarge][cLarge] = true;
		changed = true;
	}

	// Any value in small must be strictly less than max(large)
	const maxLarge = maxDigit(domains[rLarge][cLarge], size);
	// Mask of bits strictly less than maxLarge (digits 1 .. maxLarge - 1)
	const allowedSmall = maxLarge > 1 ? (1 << (maxLarge - 1)) - 1 : 0;
	const nextSmall = smallMask & allowedSmall;
	if (nextSmall !== smallMask) {
		domains[rSmall][cSmall] = nextSmall;
		touchedByInequality[rSmall][cSmall] = true;
		changed = true;
	}

	return changed;
}

/**
 * Deterministic human-technique deductive solver for Futoshiki.
 * Uses only logical propagation (no guessing / no backtracking):
 *   1. Peer elimination (row & column uniqueness)
 *   2. Inequality chain & range propagation (min/max domain tightening)
 *   3. Naked singles
 *   4. Hidden singles in rows and columns
 */
export function solveDeductively(
	size: number,
	givens: readonly (readonly (number | null)[])[],
	hInequalities: readonly (readonly InequalitySign[])[],
	vInequalities: readonly (readonly InequalitySign[])[],
): DeductiveSolveResult {
	const allBits = fullMask(size);
	const grid: (number | null)[][] = Array.from({ length: size }, (_, r) =>
		Array.from({ length: size }, (_, c) => givens[r][c]),
	);
	const domains: number[][] = Array.from({ length: size }, (_, r) =>
		Array.from({ length: size }, (_, c) => {
			const v = givens[r][c];
			return v !== null ? 1 << (v - 1) : allBits;
		}),
	);
	const touchedByInequality: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
	const steps: HintStep[] = [];

	const assignCell = (r: number, c: number, value: number, technique?: DeductionTechnique): boolean => {
		const bit = 1 << (value - 1);
		if ((domains[r][c] & bit) === 0) return false;
		grid[r][c] = value;
		domains[r][c] = bit;
		if (technique) {
			steps.push({ row: r, col: c, value, technique });
		}
		for (let i = 0; i < size; i += 1) {
			if (i !== c) {
				domains[r][i] &= ~bit;
				if (domains[r][i] === 0) return false;
			}
			if (i !== r) {
				domains[i][c] &= ~bit;
				if (domains[i][c] === 0) return false;
			}
		}
		return true;
	};

	// Initial peer elimination for givens
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			const val = grid[r][c];
			if (val !== null) {
				if (!assignCell(r, c, val)) {
					return { solved: false, contradiction: true, grid, steps };
				}
			}
		}
	}

	let progress = true;
	while (progress) {
		progress = false;

		// 1. Propagate all inequality bounds to fixed point
		let ineqChanged = true;
		while (ineqChanged) {
			ineqChanged = false;
			for (let r = 0; r < size; r += 1) {
				for (let c = 0; c < size - 1; c += 1) {
					const sign = hInequalities[r][c];
					if (sign === '<') {
						if (tightenPair(domains, r, c, r, c + 1, size, touchedByInequality)) {
							ineqChanged = true;
							progress = true;
						}
					} else if (sign === '>') {
						if (tightenPair(domains, r, c + 1, r, c, size, touchedByInequality)) {
							ineqChanged = true;
							progress = true;
						}
					}
					if (domains[r][c] === 0 || domains[r][c + 1] === 0) {
						return { solved: false, contradiction: true, grid, steps };
					}
				}
			}
			for (let r = 0; r < size - 1; r += 1) {
				for (let c = 0; c < size; c += 1) {
					const sign = vInequalities[r][c];
					if (sign === '<') {
						if (tightenPair(domains, r, c, r + 1, c, size, touchedByInequality)) {
							ineqChanged = true;
							progress = true;
						}
					} else if (sign === '>') {
						if (tightenPair(domains, r + 1, c, r, c, size, touchedByInequality)) {
							ineqChanged = true;
							progress = true;
						}
					}
					if (domains[r][c] === 0 || domains[r + 1][c] === 0) {
						return { solved: false, contradiction: true, grid, steps };
					}
				}
			}
		}

		// 2. Naked singles
		let assigned = false;
		for (let r = 0; r < size; r += 1) {
			for (let c = 0; c < size; c += 1) {
				if (grid[r][c] !== null) continue;
				const digit = singleDigit(domains[r][c]);
				if (digit !== null) {
					const technique: DeductionTechnique = touchedByInequality[r][c]
						? 'inequality-bound'
						: 'naked-single';
					if (!assignCell(r, c, digit, technique)) {
						return { solved: false, contradiction: true, grid, steps };
					}
					progress = true;
					assigned = true;
				}
			}
		}
		if (assigned) continue;

		// 3. Hidden singles in rows
		for (let r = 0; r < size; r += 1) {
			for (let d = 1; d <= size; d += 1) {
				const bit = 1 << (d - 1);
				let alreadyPlaced = false;
				let foundCol = -1;
				let count = 0;
				for (let c = 0; c < size; c += 1) {
					if (grid[r][c] === d) {
						alreadyPlaced = true;
						break;
					}
					if (grid[r][c] === null && (domains[r][c] & bit) !== 0) {
						foundCol = c;
						count += 1;
					}
				}
				if (alreadyPlaced) continue;
				if (count === 0) {
					return { solved: false, contradiction: true, grid, steps };
				}
				if (count === 1 && foundCol !== -1) {
					if (!assignCell(r, foundCol, d, 'hidden-single-row')) {
						return { solved: false, contradiction: true, grid, steps };
					}
					progress = true;
					assigned = true;
				}
			}
		}
		if (assigned) continue;

		// 4. Hidden singles in columns
		for (let c = 0; c < size; c += 1) {
			for (let d = 1; d <= size; d += 1) {
				const bit = 1 << (d - 1);
				let alreadyPlaced = false;
				let foundRow = -1;
				let count = 0;
				for (let r = 0; r < size; r += 1) {
					if (grid[r][c] === d) {
						alreadyPlaced = true;
						break;
					}
					if (grid[r][c] === null && (domains[r][c] & bit) !== 0) {
						foundRow = r;
						count += 1;
					}
				}
				if (alreadyPlaced) continue;
				if (count === 0) {
					return { solved: false, contradiction: true, grid, steps };
				}
				if (count === 1 && foundRow !== -1) {
					if (!assignCell(foundRow, c, d, 'hidden-single-col')) {
						return { solved: false, contradiction: true, grid, steps };
					}
					progress = true;
				}
			}
		}
	}

	let solved = true;
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			if (grid[r][c] === null) {
				solved = false;
				break;
			}
		}
		if (!solved) break;
	}

	return { solved, contradiction: false, grid, steps };
}

/**
 * Counts valid solutions up to `limit` using MRV backtracking + forward checking.
 */
export function countSolutions(
	size: number,
	givens: readonly (readonly (number | null)[])[],
	hInequalities: readonly (readonly InequalitySign[])[],
	vInequalities: readonly (readonly InequalitySign[])[],
	limit = 2,
): number {
	const allBits = fullMask(size);
	const initialDomains: number[][] = Array.from({ length: size }, (_, r) =>
		Array.from({ length: size }, (_, c) => {
			const v = givens[r][c];
			return v !== null ? 1 << (v - 1) : allBits;
		}),
	);
	const dummyTouched: boolean[][] = Array.from({ length: size }, () => Array<boolean>(size).fill(false));

	let solutions = 0;

	function propagate(domains: number[][]): boolean {
		let changed = true;
		while (changed) {
			changed = false;

			// Peer elimination for singletons
			for (let r = 0; r < size; r += 1) {
				for (let c = 0; c < size; c += 1) {
					const mask = domains[r][c];
					if (mask === 0) return false;
					if ((mask & (mask - 1)) === 0) {
						for (let i = 0; i < size; i += 1) {
							if (i !== c && (domains[r][i] & mask) !== 0) {
								domains[r][i] &= ~mask;
								if (domains[r][i] === 0) return false;
								changed = true;
							}
							if (i !== r && (domains[i][c] & mask) !== 0) {
								domains[i][c] &= ~mask;
								if (domains[i][c] === 0) return false;
								changed = true;
							}
						}
					}
				}
			}

			// Inequality tightening
			for (let r = 0; r < size; r += 1) {
				for (let c = 0; c < size - 1; c += 1) {
					const sign = hInequalities[r][c];
					if (sign === '<') {
						if (tightenPair(domains, r, c, r, c + 1, size, dummyTouched)) changed = true;
					} else if (sign === '>') {
						if (tightenPair(domains, r, c + 1, r, c, size, dummyTouched)) changed = true;
					}
					if (domains[r][c] === 0 || domains[r][c + 1] === 0) return false;
				}
			}
			for (let r = 0; r < size - 1; r += 1) {
				for (let c = 0; c < size; c += 1) {
					const sign = vInequalities[r][c];
					if (sign === '<') {
						if (tightenPair(domains, r, c, r + 1, c, size, dummyTouched)) changed = true;
					} else if (sign === '>') {
						if (tightenPair(domains, r + 1, c, r, c, size, dummyTouched)) changed = true;
					}
					if (domains[r][c] === 0 || domains[r + 1][c] === 0) return false;
				}
			}
		}
		return true;
	}

	function search(domains: number[][]): void {
		if (solutions >= limit) return;
		if (!propagate(domains)) return;

		// Pick unassigned cell with Minimum Remaining Values (MRV)
		let bestR = -1;
		let bestC = -1;
		let bestCount = size + 1;

		for (let r = 0; r < size; r += 1) {
			for (let c = 0; c < size; c += 1) {
				const count = popcount(domains[r][c]);
				if (count > 1 && count < bestCount) {
					bestCount = count;
					bestR = r;
					bestC = c;
				}
			}
		}

		if (bestR === -1) {
			solutions += 1;
			return;
		}

		const mask = domains[bestR][bestC];
		for (let d = 1; d <= size; d += 1) {
			const bit = 1 << (d - 1);
			if ((mask & bit) === 0) continue;
			const nextDomains = domains.map((row) => [...row]);
			nextDomains[bestR][bestC] = bit;
			search(nextDomains);
			if (solutions >= limit) return;
		}
	}

	search(initialDomains);
	return solutions;
}

/**
 * Verifies that removing all inequality signs makes the puzzle no longer uniquely solvable
 * as a plain Latin square (i.e. inequalities are strictly required).
 */
export function requiresInequalities(puzzle: Pick<FutoshikiPuzzle, 'size' | 'givens'>): boolean {
	const emptyH: InequalitySign[][] = Array.from({ length: puzzle.size }, () =>
		Array<InequalitySign>(puzzle.size - 1).fill(null),
	);
	const emptyV: InequalitySign[][] = Array.from({ length: puzzle.size - 1 }, () =>
		Array<InequalitySign>(puzzle.size).fill(null),
	);
	return countSolutions(puzzle.size, puzzle.givens, emptyH, emptyV, 2) > 1;
}

/**
 * Returns the next logically deducible move for the current board state.
 * Only uses correct placements on the board so hints are never misled by player mistakes.
 */
export function getNextHint(board: FutoshikiBoard, solution: readonly (readonly number[])[]): HintStep | null {
	const safeGrid: (number | null)[][] = board.cells.map((row, r) =>
		row.map((cell, c) => (cell.value === solution[r][c] ? cell.value : null)),
	);

	const result = solveDeductively(board.size, safeGrid, board.hInequalities, board.vInequalities);
	if (result.steps.length > 0) {
		return result.steps[0];
	}

	// Fallback if all cells are already correctly filled
	return null;
}
