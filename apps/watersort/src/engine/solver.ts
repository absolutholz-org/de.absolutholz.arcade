import type { Board, Move } from './types.ts';
import { applyPour, getLegalMoves, isSolved } from './validator.ts';

const DEFAULT_MAX_EVALUATIONS = 2500;
const DEFAULT_MAX_MILLIS = 75;

interface SolveOptions {
	maxEvaluations?: number;
	maxMillis?: number;
	/** 1 keeps A* optimal; larger values trade optimality for speed. */
	heuristicWeight?: number;
}

/**
 * `solved`: `moves` is a full solution (optimal when the weight is 1).
 * `budget`: search stopped early; `moves` leads to the most promising state found so far.
 * `unsolvable`: the reachable state space was exhausted without a solution.
 */
interface SolveResult {
	status: 'solved' | 'unsolvable' | 'budget';
	moves: Move[];
}

interface SearchNode {
	board: Board;
	cost: number;
	heuristic: number;
	parent: SearchNode | null;
	move: Move | null;
}

/**
 * Every color boundary inside a tube needs at least one pour to resolve, and a pour removes at most
 * one boundary, so this count never overestimates the remaining pours.
 */
function estimateRemainingPours(board: Board): number {
	let boundaries = 0;
	for (const tube of board) {
		for (let index = 1; index < tube.length; index++) {
			if (tube[index] !== tube[index - 1]) {
				boundaries++;
			}
		}
	}
	return boundaries;
}

/** Tubes are interchangeable, so equivalent boards share one key regardless of tube order. */
function createCanonicalKey(board: Board): string {
	return board
		.map((tube) => tube.map((color) => String.fromCharCode(97 + color)).join(''))
		.sort()
		.join('|');
}

function createNode(board: Board, cost: number, parent: SearchNode | null, move: Move | null): SearchNode {
	return { board, cost, heuristic: estimateRemainingPours(board), parent, move };
}

function extractMoves(node: SearchNode): Move[] {
	const moves: Move[] = [];
	for (let current: SearchNode | null = node; current?.move; current = current.parent) {
		moves.push(current.move);
	}
	return moves.reverse();
}

function createNodeHeap(weight: number) {
	const items: SearchNode[] = [];
	const priority = (node: SearchNode) => node.cost + weight * node.heuristic;
	const isBefore = (a: SearchNode, b: SearchNode) => {
		const priorityA = priority(a);
		const priorityB = priority(b);
		return priorityA !== priorityB ? priorityA < priorityB : a.heuristic < b.heuristic;
	};
	const swap = (a: number, b: number) => {
		[items[a], items[b]] = [items[b], items[a]];
	};

	return {
		get size() {
			return items.length;
		},
		push(node: SearchNode) {
			items.push(node);
			let index = items.length - 1;
			while (index > 0) {
				const parentIndex = (index - 1) >> 1;
				if (!isBefore(items[index], items[parentIndex])) {
					break;
				}
				swap(index, parentIndex);
				index = parentIndex;
			}
		},
		pop(): SearchNode | undefined {
			const top = items[0];
			const last = items.pop();
			if (top === undefined || last === undefined) {
				return undefined;
			}
			if (items.length > 0) {
				items[0] = last;
				let index = 0;
				while (true) {
					const left = index * 2 + 1;
					const right = left + 1;
					let best = index;
					if (left < items.length && isBefore(items[left], items[best])) {
						best = left;
					}
					if (right < items.length && isBefore(items[right], items[best])) {
						best = right;
					}
					if (best === index) {
						break;
					}
					swap(index, best);
					index = best;
				}
			}
			return top;
		},
	};
}

export function solve(board: Board, options: SolveOptions = {}): SolveResult {
	if (isSolved(board)) {
		return { status: 'solved', moves: [] };
	}

	const maxEvaluations = options.maxEvaluations ?? DEFAULT_MAX_EVALUATIONS;
	const maxMillis = options.maxMillis ?? DEFAULT_MAX_MILLIS;
	const startedAt = performance.now();

	const root = createNode(board, 0, null, null);
	const open = createNodeHeap(options.heuristicWeight ?? 1);
	open.push(root);
	const lowestCostByState = new Map<string, number>([[createCanonicalKey(board), 0]]);
	let mostPromising = root;
	let evaluations = 0;

	while (open.size > 0) {
		if (evaluations >= maxEvaluations || performance.now() - startedAt > maxMillis) {
			return { status: 'budget', moves: extractMoves(mostPromising) };
		}

		const node = open.pop() as SearchNode;
		if (isSolved(node.board)) {
			return { status: 'solved', moves: extractMoves(node) };
		}
		evaluations++;

		for (const move of getLegalMoves(node.board)) {
			const nextBoard = applyPour(node.board, move);
			const key = createCanonicalKey(nextBoard);
			const nextCost = node.cost + 1;
			const knownCost = lowestCostByState.get(key);
			if (knownCost !== undefined && knownCost <= nextCost) {
				continue;
			}
			lowestCostByState.set(key, nextCost);
			const child = createNode(nextBoard, nextCost, node, move);
			if (child.heuristic < mostPromising.heuristic) {
				mostPromising = child;
			}
			open.push(child);
		}
	}

	return { status: 'unsolvable', moves: [] };
}

/**
 * Optimal next pour when the search budget allows; otherwise the first step toward the most promising
 * state found, falling back to any legal pour.
 */
export function suggestHint(board: Board, options: SolveOptions = {}): Move | null {
	const { moves } = solve(board, options);
	return moves[0] ?? getLegalMoves(board)[0] ?? null;
}
