import { traceRay } from './raycast.ts';
import { EDGE_SIDES, type EdgeClues, type MirrorType, type MonsterCounts, type MonsterType } from './types.ts';

const BIT_GHOST = 1;
const BIT_VAMPIRE = 2;
const BIT_ZOMBIE = 4;
const BIT_ALL = BIT_GHOST | BIT_VAMPIRE | BIT_ZOMBIE;

interface RaySlotConstraint {
	readonly slotIndex: number;
	readonly direct: number;
	readonly reflected: number;
}

interface CompiledRay {
	readonly target: number;
	readonly entries: readonly RaySlotConstraint[];
}

export interface SolverInput {
	readonly size: number;
	readonly mirrors: readonly (readonly (MirrorType | null)[])[];
	readonly clues: EdgeClues;
	readonly inventory: MonsterCounts;
}

export interface SolveResult {
	readonly count: number;
	readonly solution: readonly (readonly (MonsterType | null)[])[] | null;
	readonly aborted: boolean;
}

function bitToMonster(bit: number): MonsterType {
	if (bit === BIT_GHOST) return 'ghost';
	if (bit === BIT_VAMPIRE) return 'vampire';
	return 'zombie';
}

function bitCount(mask: number): number {
	return (mask & 1) + ((mask >> 1) & 1) + ((mask >> 2) & 1);
}

function slotContribution(entry: RaySlotConstraint, bit: number): number {
	if (bit === BIT_GHOST) return entry.reflected;
	if (bit === BIT_VAMPIRE) return entry.direct;
	return entry.direct + entry.reflected;
}

function slotMinMax(entry: RaySlotConstraint, mask: number): { readonly min: number; readonly max: number } {
	let min = Number.POSITIVE_INFINITY;
	let max = -1;

	if ((mask & BIT_GHOST) !== 0) {
		const c = entry.reflected;
		if (c < min) min = c;
		if (c > max) max = c;
	}
	if ((mask & BIT_VAMPIRE) !== 0) {
		const c = entry.direct;
		if (c < min) min = c;
		if (c > max) max = c;
	}
	if ((mask & BIT_ZOMBIE) !== 0) {
		const c = entry.direct + entry.reflected;
		if (c < min) min = c;
		if (c > max) max = c;
	}

	return { min, max };
}

/**
 * Deterministic constraint-propagation + MRV backtracking solver for Undead.
 * Finds up to `maxSolutions` valid monster assignments matching all 4N edge clues
 * and exact monster inventory counts.
 */
export function solveUndead(input: SolverInput, maxSolutions = 2, maxNodes = Number.POSITIVE_INFINITY): SolveResult {
	const { size, mirrors, clues, inventory } = input;

	// Index all playable (non-mirror) cells
	const slotCoords: { readonly row: number; readonly col: number }[] = [];
	const coordToSlot = new Int16Array(size * size).fill(-1);

	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			if (mirrors[r]?.[c] === null) {
				const idx = slotCoords.length;
				slotCoords.push({ row: r, col: c });
				coordToSlot[r * size + c] = idx;
			}
		}
	}

	const numSlots = slotCoords.length;
	const totalInventory = inventory.ghost + inventory.vampire + inventory.zombie;
	if (totalInventory !== numSlots) {
		return { count: 0, solution: null, aborted: false };
	}

	// Compile all 4N rays into slot-indexed constraints and track per-slot ray incidence
	const compiledRays: CompiledRay[] = [];
	const slotIncidence = new Uint16Array(numSlots);

	for (const side of EDGE_SIDES) {
		const sideClues = clues[side];
		for (let i = 0; i < size; i += 1) {
			const target = sideClues[i] ?? 0;
			const ray = traceRay(mirrors, side, i);
			const visitMap = new Map<number, { direct: number; reflected: number }>();

			for (const step of ray.steps) {
				if (step.isMirror) continue;
				const sIdx = coordToSlot[step.row * size + step.col] ?? -1;
				if (sIdx < 0) continue;
				const prev = visitMap.get(sIdx) ?? { direct: 0, reflected: 0 };
				if (step.hasReflected) {
					prev.reflected += 1;
				} else {
					prev.direct += 1;
				}
				visitMap.set(sIdx, prev);
			}

			const entries: RaySlotConstraint[] = [];
			for (const [slotIndex, visits] of visitMap.entries()) {
				entries.push({
					slotIndex,
					direct: visits.direct,
					reflected: visits.reflected,
				});
				slotIncidence[slotIndex] = (slotIncidence[slotIndex] ?? 0) + 1;
			}

			// Immediate consistency check for rays that hit zero slots
			if (entries.length === 0) {
				if (target !== 0) {
					return { count: 0, solution: null, aborted: false };
				}
				continue;
			}

			compiledRays.push({ target, entries });
		}
	}

	const initialDomains = new Uint8Array(numSlots).fill(BIT_ALL);
	const initialAssigned = new Uint8Array(numSlots); // 0 = unassigned, else single bit
	let solutionCount = 0;
	let firstSolution: (MonsterType | null)[][] | null = null;
	let nodesVisited = 0;
	let aborted = false;

	function assignSlot(
		domains: Uint8Array,
		assigned: Uint8Array,
		rem: Int16Array,
		slotIdx: number,
		bit: number,
	): boolean {
		const currentAssigned = assigned[slotIdx] ?? 0;
		if (currentAssigned !== 0) {
			return currentAssigned === bit;
		}
		if (((domains[slotIdx] ?? 0) & bit) === 0) {
			return false;
		}
		const mIdx = bit === BIT_GHOST ? 0 : bit === BIT_VAMPIRE ? 1 : 2;
		const nextRem = (rem[mIdx] ?? 0) - 1;
		if (nextRem < 0) {
			return false;
		}
		rem[mIdx] = nextRem;
		domains[slotIdx] = bit;
		assigned[slotIdx] = bit;
		return true;
	}

	function propagate(domains: Uint8Array, assigned: Uint8Array, rem: Int16Array): boolean {
		let changed = true;

		while (changed) {
			changed = false;

			// 1. Inventory bounds & singleton assignment
			let possibleGhost = 0;
			let possibleVampire = 0;
			let possibleZombie = 0;

			for (let s = 0; s < numSlots; s += 1) {
				if ((assigned[s] ?? 0) !== 0) continue;
				let mask = domains[s] ?? 0;

				if ((rem[0] ?? 0) === 0 && (mask & BIT_GHOST) !== 0) {
					mask &= ~BIT_GHOST;
					domains[s] = mask;
					changed = true;
				}
				if ((rem[1] ?? 0) === 0 && (mask & BIT_VAMPIRE) !== 0) {
					mask &= ~BIT_VAMPIRE;
					domains[s] = mask;
					changed = true;
				}
				if ((rem[2] ?? 0) === 0 && (mask & BIT_ZOMBIE) !== 0) {
					mask &= ~BIT_ZOMBIE;
					domains[s] = mask;
					changed = true;
				}

				if (mask === 0) return false;

				if (bitCount(mask) === 1) {
					if (!assignSlot(domains, assigned, rem, s, mask)) return false;
					changed = true;
					continue;
				}

				if ((mask & BIT_GHOST) !== 0) possibleGhost += 1;
				if ((mask & BIT_VAMPIRE) !== 0) possibleVampire += 1;
				if ((mask & BIT_ZOMBIE) !== 0) possibleZombie += 1;
			}

			const remG = rem[0] ?? 0;
			const remV = rem[1] ?? 0;
			const remZ = rem[2] ?? 0;

			if (possibleGhost < remG || possibleVampire < remV || possibleZombie < remZ) {
				return false;
			}

			// Force slots if remaining count equals exact number of possible slots for a monster type
			if (remG > 0 && possibleGhost === remG) {
				for (let s = 0; s < numSlots; s += 1) {
					if ((assigned[s] ?? 0) === 0 && ((domains[s] ?? 0) & BIT_GHOST) !== 0) {
						if (!assignSlot(domains, assigned, rem, s, BIT_GHOST)) return false;
						changed = true;
					}
				}
				if (changed) continue;
			}

			if (remV > 0 && possibleVampire === remV) {
				for (let s = 0; s < numSlots; s += 1) {
					if ((assigned[s] ?? 0) === 0 && ((domains[s] ?? 0) & BIT_VAMPIRE) !== 0) {
						if (!assignSlot(domains, assigned, rem, s, BIT_VAMPIRE)) return false;
						changed = true;
					}
				}
				if (changed) continue;
			}

			if (remZ > 0 && possibleZombie === remZ) {
				for (let s = 0; s < numSlots; s += 1) {
					if ((assigned[s] ?? 0) === 0 && ((domains[s] ?? 0) & BIT_ZOMBIE) !== 0) {
						if (!assignSlot(domains, assigned, rem, s, BIT_ZOMBIE)) return false;
						changed = true;
					}
				}
				if (changed) continue;
			}

			// 2. Per-ray bounds propagation
			for (let r = 0; r < compiledRays.length; r += 1) {
				const ray = compiledRays[r];
				if (!ray) continue;
				const entries = ray.entries;
				let sumMin = 0;
				let sumMax = 0;

				for (let e = 0; e < entries.length; e += 1) {
					const entry = entries[e];
					if (!entry) continue;
					const mask = domains[entry.slotIndex] ?? 0;
					if (mask === 0) return false;
					const mm = slotMinMax(entry, mask);
					sumMin += mm.min;
					sumMax += mm.max;
				}

				if (sumMin > ray.target || sumMax < ray.target) {
					return false;
				}

				// Prune invalid domain values on unassigned slots along this ray
				for (let e = 0; e < entries.length; e += 1) {
					const entry = entries[e];
					if (!entry) continue;
					const s = entry.slotIndex;
					if ((assigned[s] ?? 0) !== 0) continue;

					const oldMask = domains[s] ?? 0;
					const mm = slotMinMax(entry, oldMask);
					const otherMin = sumMin - mm.min;
					const otherMax = sumMax - mm.max;

					let newMask = oldMask;
					for (const bit of [BIT_GHOST, BIT_VAMPIRE, BIT_ZOMBIE]) {
						if ((newMask & bit) === 0) continue;
						const c = slotContribution(entry, bit);
						if (otherMin + c > ray.target || otherMax + c < ray.target) {
							newMask &= ~bit;
						}
					}

					if (newMask === 0) return false;
					if (newMask !== oldMask) {
						domains[s] = newMask;
						changed = true;
						if (bitCount(newMask) === 1) {
							if (!assignSlot(domains, assigned, rem, s, newMask)) return false;
						}
					}
				}
			}
		}

		return true;
	}

	function search(domains: Uint8Array, assigned: Uint8Array, rem: Int16Array): void {
		if (solutionCount >= maxSolutions || aborted) return;
		nodesVisited += 1;
		if (nodesVisited > maxNodes) {
			aborted = true;
			return;
		}

		if (!propagate(domains, assigned, rem)) {
			return;
		}

		// Pick MRV unassigned slot (smallest domain size, tie-break by highest ray incidence)
		let bestSlot = -1;
		let bestDomainSize = 4;
		let bestIncidence = -1;

		for (let s = 0; s < numSlots; s += 1) {
			if ((assigned[s] ?? 0) !== 0) continue;
			const dSize = bitCount(domains[s] ?? 0);
			const inc = slotIncidence[s] ?? 0;
			if (dSize < bestDomainSize || (dSize === bestDomainSize && inc > bestIncidence)) {
				bestSlot = s;
				bestDomainSize = dSize;
				bestIncidence = inc;
			}
		}

		if (bestSlot === -1) {
			// All slots assigned — verify inventory is exhausted
			if ((rem[0] ?? 0) !== 0 || (rem[1] ?? 0) !== 0 || (rem[2] ?? 0) !== 0) {
				return;
			}
			solutionCount += 1;
			if (firstSolution === null) {
				const grid: (MonsterType | null)[][] = Array.from({ length: size }, () =>
					Array.from({ length: size }, () => null),
				);
				for (let s = 0; s < numSlots; s += 1) {
					const coord = slotCoords[s];
					const bit = assigned[s] ?? 0;
					if (coord && bit !== 0) {
						const rowArr = grid[coord.row];
						if (rowArr) {
							rowArr[coord.col] = bitToMonster(bit);
						}
					}
				}
				firstSolution = grid;
			}
			return;
		}

		const mask = domains[bestSlot] ?? 0;
		for (const bit of [BIT_GHOST, BIT_VAMPIRE, BIT_ZOMBIE]) {
			if ((mask & bit) === 0) continue;
			if (solutionCount >= maxSolutions) return;

			const nextDomains = new Uint8Array(domains);
			const nextAssigned = new Uint8Array(assigned);
			const nextRem = new Int16Array(rem);

			if (assignSlot(nextDomains, nextAssigned, nextRem, bestSlot, bit)) {
				search(nextDomains, nextAssigned, nextRem);
			}
		}
	}

	const initialRem = new Int16Array([inventory.ghost, inventory.vampire, inventory.zombie]);
	search(initialDomains, initialAssigned, initialRem);

	return {
		count: solutionCount,
		solution: firstSolution,
		aborted,
	};
}

export function countSolutions(input: SolverInput, limit = 2, maxNodes = Number.POSITIVE_INFINITY): number {
	const result = solveUndead(input, limit, maxNodes);
	if (result.aborted) return -1;
	return result.count;
}
