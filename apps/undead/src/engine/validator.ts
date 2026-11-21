import { isMonsterVisible, traceAllRays } from './raycast.ts';
import {
	type ClueEvaluation,
	type ClueStatus,
	EDGE_SIDES,
	type MonsterCounts,
	type MonsterType,
	type RayPath,
	type UndeadBoard,
	type UndeadCell,
	type UndeadPuzzle,
	type ValidationResult,
	getClueId,
} from './types.ts';

export function createBoardFromPuzzle(
	puzzle: UndeadPuzzle,
	placements: readonly (readonly (MonsterType | null)[])[],
	notes: readonly (readonly (readonly MonsterType[])[])[],
): UndeadBoard {
	const cells: UndeadCell[][] = [];
	for (let r = 0; r < puzzle.size; r += 1) {
		const rowCells: UndeadCell[] = [];
		for (let c = 0; c < puzzle.size; c += 1) {
			const mirror = puzzle.mirrors[r]?.[c] ?? null;
			rowCells.push({
				row: r,
				col: c,
				mirror,
				monster: mirror === null ? (placements[r]?.[c] ?? null) : null,
				notes: mirror === null ? (notes[r]?.[c] ?? []) : [],
			});
		}
		cells.push(rowCells);
	}

	return {
		size: puzzle.size,
		cells,
		clues: puzzle.clues,
		inventory: puzzle.inventory,
	};
}

export function countPlacedMonsters(
	mirrors: readonly (readonly (string | null)[])[],
	placements: readonly (readonly (MonsterType | null)[])[],
): { readonly counts: MonsterCounts; readonly emptySlotCount: number } {
	let ghost = 0;
	let vampire = 0;
	let zombie = 0;
	let emptySlotCount = 0;

	const size = mirrors.length;
	for (let r = 0; r < size; r += 1) {
		for (let c = 0; c < size; c += 1) {
			if (mirrors[r]?.[c] !== null) continue;
			const m = placements[r]?.[c] ?? null;
			if (m === 'ghost') ghost += 1;
			else if (m === 'vampire') vampire += 1;
			else if (m === 'zombie') zombie += 1;
			else emptySlotCount += 1;
		}
	}

	return {
		counts: { ghost, vampire, zombie },
		emptySlotCount,
	};
}

/**
 * Evaluates all edge clues and inventory constraints for a given board state.
 */
export function validateBoard(
	puzzle: UndeadPuzzle,
	placements: readonly (readonly (MonsterType | null)[])[],
	precomputedRays?: Readonly<Record<string, RayPath>>,
): ValidationResult {
	const rays = precomputedRays ?? traceAllRays(puzzle.mirrors);
	const { counts: placedCounts, emptySlotCount } = countPlacedMonsters(puzzle.mirrors, placements);

	const overLimit: Record<MonsterType, boolean> = {
		ghost: placedCounts.ghost > puzzle.inventory.ghost,
		vampire: placedCounts.vampire > puzzle.inventory.vampire,
		zombie: placedCounts.zombie > puzzle.inventory.zombie,
	};

	const clues: Record<string, ClueEvaluation> = {};
	const errorClueIds = new Set<string>();
	let allCluesSatisfied = true;

	for (const side of EDGE_SIDES) {
		const sideClues = puzzle.clues[side];
		for (let i = 0; i < puzzle.size; i += 1) {
			const clueId = getClueId(side, i);
			const target = sideClues[i] ?? 0;
			const ray = rays[clueId];

			let visibleCount = 0;
			// Aggregate direct & reflected visits for each empty cell along this ray
			const emptyVisits = new Map<number, { direct: number; reflected: number }>();

			if (ray) {
				for (const step of ray.steps) {
					if (step.isMirror) continue;
					const m = placements[step.row]?.[step.col] ?? null;
					if (m !== null) {
						if (isMonsterVisible(m, step.hasReflected)) {
							visibleCount += 1;
						}
					} else {
						const cellKey = step.row * puzzle.size + step.col;
						const prev = emptyVisits.get(cellKey) ?? { direct: 0, reflected: 0 };
						if (step.hasReflected) {
							prev.reflected += 1;
						} else {
							prev.direct += 1;
						}
						emptyVisits.set(cellKey, prev);
					}
				}
			}

			let minAdditional = 0;
			let maxAdditional = 0;
			for (const { direct, reflected } of emptyVisits.values()) {
				// Contributions for ghost=reflected, vampire=direct, zombie=direct+reflected
				minAdditional += Math.min(direct, reflected);
				maxAdditional += direct + reflected;
			}

			const minPossible = visibleCount + minAdditional;
			const maxPossible = visibleCount + maxAdditional;
			const allFilled = emptyVisits.size === 0;

			let status: ClueStatus = 'incomplete';
			if (visibleCount > target || minPossible > target || maxPossible < target) {
				status = 'error';
				errorClueIds.add(clueId);
				allCluesSatisfied = false;
			} else if (allFilled) {
				if (visibleCount === target) {
					status = 'satisfied';
				} else {
					status = 'error';
					errorClueIds.add(clueId);
					allCluesSatisfied = false;
				}
			} else {
				allCluesSatisfied = false;
			}

			clues[clueId] = {
				clueId,
				side,
				index: i,
				target,
				visibleCount,
				minPossible,
				maxPossible,
				allFilled,
				status,
			};
		}
	}

	const hasInventoryError = overLimit.ghost || overLimit.vampire || overLimit.zombie;
	const hasErrors = hasInventoryError || errorClueIds.size > 0;
	const inventoryExact =
		placedCounts.ghost === puzzle.inventory.ghost &&
		placedCounts.vampire === puzzle.inventory.vampire &&
		placedCounts.zombie === puzzle.inventory.zombie;

	const isSolved = emptySlotCount === 0 && inventoryExact && allCluesSatisfied && !hasErrors;

	return {
		placedCounts,
		overLimit,
		clues,
		errorClueIds,
		hasErrors,
		emptySlotCount,
		isSolved,
	};
}
