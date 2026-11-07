import { getPlacementCells, getUniqueOrientations } from './pieces.ts';
import type { PieceId, Placement } from './types.ts';

export interface SolveOptions {
	readonly existingPlacements?: ReadonlyArray<Placement>;
	readonly maxSolutions?: number;
	readonly maxNodes?: number;
}

export interface SolveResult {
	readonly solvable: boolean;
	readonly solutionCount: number;
	readonly firstSolution: ReadonlyArray<Placement> | null;
}

/**
 * Donald Knuth's Dancing Links (DLX) Algorithm X for Polyomino Exact Cover.
 * Uses Spatial MRV column selection on uncovered board cells while pruning dead-end columns.
 */
export function solveExactCover(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	pieceIds: ReadonlyArray<PieceId>,
	options: SolveOptions = {},
): SolveResult {
	const existing = options.existingPlacements ?? [];
	const maxSolutions = options.maxSolutions ?? 1;
	const maxNodes = options.maxNodes ?? 250_000;

	const rows = mask.length;
	const cols = mask[0]?.length ?? 0;

	const placedPieceSet = new Set<PieceId>();
	const coveredCellKeys = new Set<string>();

	for (const placement of existing) {
		if (placedPieceSet.has(placement.pieceId)) {
			return { solvable: false, solutionCount: 0, firstSolution: null };
		}
		placedPieceSet.add(placement.pieceId);
		const cells = getPlacementCells(placement);
		for (const cell of cells) {
			if (
				cell.row < 0 ||
				cell.row >= rows ||
				cell.col < 0 ||
				cell.col >= cols ||
				mask[cell.row]?.[cell.col] !== 1
			) {
				return { solvable: false, solutionCount: 0, firstSolution: null };
			}
			const key = `${cell.row},${cell.col}`;
			if (coveredCellKeys.has(key)) {
				return { solvable: false, solutionCount: 0, firstSolution: null };
			}
			coveredCellKeys.add(key);
		}
	}

	const remainingPieces = pieceIds.filter((id) => !placedPieceSet.has(id));
	const uncoveredCells: Array<{ readonly row: number; readonly col: number }> = [];
	const cellIndexByKey = new Map<string, number>();

	for (let r = 0; r < rows; r += 1) {
		for (let c = 0; c < cols; c += 1) {
			if (mask[r]?.[c] === 1) {
				const key = `${r},${c}`;
				if (!coveredCellKeys.has(key)) {
					cellIndexByKey.set(key, uncoveredCells.length);
					uncoveredCells.push({ row: r, col: c });
				}
			}
		}
	}

	if (remainingPieces.length === 0 && uncoveredCells.length === 0) {
		return {
			solvable: true,
			solutionCount: 1,
			firstSolution: [...existing],
		};
	}

	const pieceCount = remainingPieces.length;
	const totalColumns = pieceCount + uncoveredCells.length;

	const candidatePlacements: Placement[] = [];
	const candidateRows: number[][] = [];

	for (let pIdx = 0; pIdx < remainingPieces.length; pIdx += 1) {
		const pieceId = remainingPieces[pIdx];
		if (!pieceId) {
			continue;
		}
		const orientations = getUniqueOrientations(pieceId);
		for (const shape of orientations) {
			const maxAnchorRow = rows - shape.height;
			const maxAnchorCol = cols - shape.width;
			for (let r = 0; r <= maxAnchorRow; r += 1) {
				for (let c = 0; c <= maxAnchorCol; c += 1) {
					let fits = true;
					const colIndices: number[] = [pIdx + 1];
					for (const cell of shape.cells) {
						const boardRow = r + cell.row;
						const boardCol = c + cell.col;
						const cellIdx = cellIndexByKey.get(`${boardRow},${boardCol}`);
						if (cellIdx === undefined) {
							fits = false;
							break;
						}
						colIndices.push(pieceCount + 1 + cellIdx);
					}
					if (fits) {
						candidatePlacements.push({
							pieceId,
							anchor: { row: r, col: c },
							rotation: shape.rotation,
							flipped: shape.flipped,
						});
						candidateRows.push(colIndices);
					}
				}
			}
		}
	}

	const maxNodeCount = totalColumns + 1 + candidateRows.length * 6 + 4;
	const left = new Int32Array(maxNodeCount);
	const right = new Int32Array(maxNodeCount);
	const up = new Int32Array(maxNodeCount);
	const down = new Int32Array(maxNodeCount);
	const colHeader = new Int32Array(maxNodeCount);
	const rowId = new Int32Array(maxNodeCount);
	const colSize = new Int32Array(totalColumns + 1);

	for (let i = 0; i <= totalColumns; i += 1) {
		left[i] = i === 0 ? totalColumns : i - 1;
		right[i] = i === totalColumns ? 0 : i + 1;
		up[i] = i;
		down[i] = i;
		colHeader[i] = i;
		colSize[i] = 0;
	}

	let nodeCursor = totalColumns + 1;

	for (let rIdx = 0; rIdx < candidateRows.length; rIdx += 1) {
		const colsInRow = candidateRows[rIdx];
		if (!colsInRow || colsInRow.length === 0) {
			continue;
		}
		const firstNode = nodeCursor;
		for (let i = 0; i < colsInRow.length; i += 1) {
			const c = colsInRow[i] ?? 0;
			const node = nodeCursor;
			nodeCursor += 1;

			rowId[node] = rIdx;
			colHeader[node] = c;

			const prevInRow = i === 0 ? firstNode + colsInRow.length - 1 : node - 1;
			const nextInRow = i === colsInRow.length - 1 ? firstNode : node + 1;
			left[node] = prevInRow;
			right[node] = nextInRow;

			const colUp = up[c] ?? c;
			up[node] = colUp;
			down[node] = c;
			down[colUp] = node;
			up[c] = node;
			colSize[c] = (colSize[c] ?? 0) + 1;
		}
	}

	function cover(c: number): void {
		const l = left[c] ?? 0;
		const r = right[c] ?? 0;
		right[l] = r;
		left[r] = l;

		for (let i = down[c] ?? c; i !== c; i = down[i] ?? c) {
			for (let j = right[i] ?? i; j !== i; j = right[j] ?? i) {
				const u = up[j] ?? j;
				const d = down[j] ?? j;
				const ch = colHeader[j] ?? 0;
				down[u] = d;
				up[d] = u;
				colSize[ch] = (colSize[ch] ?? 1) - 1;
			}
		}
	}

	function uncover(c: number): void {
		for (let i = up[c] ?? c; i !== c; i = up[i] ?? c) {
			for (let j = left[i] ?? i; j !== i; j = left[j] ?? i) {
				const ch = colHeader[j] ?? 0;
				const u = up[j] ?? j;
				const d = down[j] ?? j;
				colSize[ch] = (colSize[ch] ?? 0) + 1;
				down[u] = j;
				up[d] = j;
			}
		}
		const l = left[c] ?? 0;
		const r = right[c] ?? 0;
		right[l] = c;
		left[r] = c;
	}

	const solutionRows: number[] = [];
	let solutionCount = 0;
	let firstSolution: ReadonlyArray<Placement> | null = null;
	let nodesVisited = 0;

	function search(): void {
		if (solutionCount >= maxSolutions || nodesVisited >= maxNodes) {
			return;
		}
		if (right[0] === 0) {
			solutionCount += 1;
			if (!firstSolution) {
				const solvedPlacements: Placement[] = [...existing];
				for (const rIdx of solutionRows) {
					const placement = candidatePlacements[rIdx];
					if (placement) {
						solvedPlacements.push(placement);
					}
				}
				firstSolution = solvedPlacements;
			}
			return;
		}

		nodesVisited += 1;

		let chosenCellCol = -1;
		let minCellSize = Number.POSITIVE_INFINITY;
		let chosenAnyCol = -1;
		let minAnySize = Number.POSITIVE_INFINITY;

		for (let c = right[0] ?? 0; c !== 0; c = right[c] ?? 0) {
			const sz = colSize[c] ?? 0;
			if (sz === 0) {
				return;
			}
			if (sz < minAnySize) {
				minAnySize = sz;
				chosenAnyCol = c;
			}
			if (c > pieceCount && sz < minCellSize) {
				minCellSize = sz;
				chosenCellCol = c;
			}
		}

		const chosenCol = chosenCellCol !== -1 ? chosenCellCol : chosenAnyCol;
		if (chosenCol === -1) {
			return;
		}

		cover(chosenCol);

		for (let rNode = down[chosenCol] ?? chosenCol; rNode !== chosenCol; rNode = down[rNode] ?? chosenCol) {
			solutionRows.push(rowId[rNode] ?? 0);

			for (let j = right[rNode] ?? rNode; j !== rNode; j = right[j] ?? rNode) {
				cover(colHeader[j] ?? 0);
			}

			search();

			for (let j = left[rNode] ?? rNode; j !== rNode; j = left[j] ?? rNode) {
				uncover(colHeader[j] ?? 0);
			}

			solutionRows.pop();

			if (solutionCount >= maxSolutions || nodesVisited >= maxNodes) {
				break;
			}
		}

		uncover(chosenCol);
	}

	search();

	return {
		solvable: solutionCount > 0,
		solutionCount,
		firstSolution,
	};
}

export function findHintPlacement(
	mask: ReadonlyArray<ReadonlyArray<number>>,
	pieceIds: ReadonlyArray<PieceId>,
	existingPlacements: ReadonlyArray<Placement>,
): Placement | null {
	const directResult = solveExactCover(mask, pieceIds, {
		existingPlacements,
		maxSolutions: 1,
	});

	if (directResult.solvable && directResult.firstSolution) {
		const placedSet = new Set(existingPlacements.map((p) => p.pieceId));
		const nextPlacement = directResult.firstSolution.find((p) => !placedSet.has(p.pieceId));
		if (nextPlacement) {
			return nextPlacement;
		}
	}

	const cleanResult = solveExactCover(mask, pieceIds, {
		existingPlacements: [],
		maxSolutions: 1,
	});
	if (cleanResult.solvable && cleanResult.firstSolution) {
		const placedSet = new Set(existingPlacements.map((p) => p.pieceId));
		return cleanResult.firstSolution.find((p) => !placedSet.has(p.pieceId)) ?? cleanResult.firstSolution[0] ?? null;
	}

	return null;
}
