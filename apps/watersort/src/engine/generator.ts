import { getPreset } from './presets/index.ts';
import { solve } from './solver.ts';
import { type Board, DIFFICULTY_CONFIG, type DifficultyLevel, type Move, TUBE_CAPACITY } from './types.ts';
import { applyPour, getLegalMoves, getTopRunLength, isSolved, isTubeComplete } from './validator.ts';

const RANDOM_CANDIDATE_LIMIT = 5;
const MIN_OPENING_MOVES = 3;
const CERTIFICATION_MAX_EVALUATIONS = 8000;
const CERTIFICATION_MAX_MILLIS = 80;
const CERTIFICATION_HEURISTIC_WEIGHT = 2;
const MIN_CERTIFIED_SOLUTION_LENGTH: Record<DifficultyLevel, number> = {
	easy: 8,
	medium: 14,
	hard: 20,
	expert: 28,
};

const SCRAMBLE_STEPS_PER_COLOR = 40;
const TABU_LENGTH = 4;
const BACKTRACK_STEPS = 3;
const MAX_BACKTRACKS = 400;
const MAX_SCRAMBLE_ATTEMPTS = 20;

interface Puzzle {
	board: Board;
	/** Forward pours that solve `board`. */
	solution: Move[];
}

interface ReverseStep {
	/** The forward pour this step undoes. */
	forwardMove: Move;
	board: Board;
}

function createSeededRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let mixed = state;
		mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
		mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
		return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
	};
}

function createBoardKey(board: Board): string {
	return board.map((tube) => tube.join(',')).join('|');
}

function countEmptyTubes(board: Board): number {
	return board.filter((tube) => tube.length === 0).length;
}

function createEmptyTubes(count: number): number[][] {
	return Array.from({ length: count }, () => []);
}

function shuffle<T>(items: T[], random: () => number): T[] {
	for (let index = items.length - 1; index > 0; index--) {
		const swapIndex = Math.floor(random() * (index + 1));
		[items[index], items[swapIndex]] = [items[swapIndex], items[index]];
	}
	return items;
}

function createRandomBoard(colorCount: number, emptyTubes: number, random: () => number): Board {
	const segments = shuffle(
		Array.from({ length: colorCount * TUBE_CAPACITY }, (_, index) => Math.floor(index / TUBE_CAPACITY)),
		random,
	);
	return [
		...Array.from({ length: colorCount }, (_, tubeIndex) =>
			segments.slice(tubeIndex * TUBE_CAPACITY, (tubeIndex + 1) * TUBE_CAPACITY),
		),
		...createEmptyTubes(emptyTubes),
	];
}

function hasRunOfThree(tube: readonly number[]): boolean {
	return tube.some((color, index) => index >= 2 && color === tube[index - 1] && color === tube[index - 2]);
}

/** Cheap rejection of boards that are nearly solved or start with almost no moves, before spending solver time. */
function passesOpeningFilter(board: Board): boolean {
	return !board.some(hasRunOfThree) && getLegalMoves(board).length >= MIN_OPENING_MOVES;
}

/**
 * Random fill certified by the solver. Only the evaluation count bounds the search (no wall-clock limit),
 * so the same seed yields the same puzzle on every machine.
 */
function generateCertifiedPuzzle(
	difficulty: DifficultyLevel,
	colorCount: number,
	emptyTubes: number,
	random: () => number,
): Puzzle | null {
	for (let candidate = 0; candidate < RANDOM_CANDIDATE_LIMIT; candidate++) {
		const board = createRandomBoard(colorCount, emptyTubes, random);
		if (!passesOpeningFilter(board)) {
			continue;
		}
		const { status, moves } = solve(board, {
			maxEvaluations: CERTIFICATION_MAX_EVALUATIONS,
			maxMillis: CERTIFICATION_MAX_MILLIS,
			heuristicWeight: CERTIFICATION_HEURISTIC_WEIGHT,
		});
		if (status === 'solved' && moves.length >= MIN_CERTIFIED_SOLUTION_LENGTH[difficulty]) {
			return { board, solution: moves };
		}
	}
	return null;
}

/**
 * Every way to un-pour 1..n segments from the top of one tube onto another. A candidate is kept only if
 * replaying its forward pour reproduces the current board exactly, so the recorded solution is always
 * playable by `applyPour`.
 */
function listReverseSteps(board: Board): ReverseStep[] {
	const steps: ReverseStep[] = [];
	const boardKey = createBoardKey(board);

	board.forEach((giver, to) => {
		if (giver.length === 0) {
			return;
		}
		const color = giver[giver.length - 1];
		const topRunLength = getTopRunLength(giver);

		board.forEach((receiver, from) => {
			if (from === to) {
				return;
			}
			const maxCount = Math.min(topRunLength, TUBE_CAPACITY - receiver.length);
			for (let count = 1; count <= maxCount; count++) {
				const isPointlessSwap = receiver.length === 0 && count === giver.length;
				if (isPointlessSwap) {
					continue;
				}
				const candidate = board.map((tube, index) => {
					if (index === to) {
						return tube.slice(0, tube.length - count);
					}
					if (index === from) {
						return [...tube, ...Array<number>(count).fill(color)];
					}
					return tube;
				});
				const forwardMove = { from, to };
				if (createBoardKey(applyPour(candidate, forwardMove)) === boardKey) {
					steps.push({ forwardMove, board: candidate });
				}
			}
		});
	});

	return steps;
}

function isAcceptableScramble(board: Board, colorCount: number, emptyTubes: number): boolean {
	return (
		countEmptyTubes(board) === emptyTubes &&
		!isSolved(board) &&
		board.filter(isTubeComplete).length <= Math.floor(colorCount / 4)
	);
}

/**
 * Random walk away from the solved board. A short tabu window stops the walk from undoing itself, and a
 * dead end (a board no pour can lead to) backs the walk up a few steps instead of ending it. The result
 * is the deepest visited board that has the configured number of empty tubes.
 */
function scramble(colorCount: number, emptyTubes: number, random: () => number): Puzzle {
	const targetDepth = SCRAMBLE_STEPS_PER_COLOR * colorCount;
	const solvedBoard: Board = [
		...Array.from({ length: colorCount }, (_, color) => Array<number>(TUBE_CAPACITY).fill(color)),
		...createEmptyTubes(emptyTubes),
	];
	const boards: Board[] = [solvedBoard];
	const reverseMoves: Move[] = [];
	let deepest: Puzzle = { board: solvedBoard, solution: [] };
	let backtracks = 0;

	while (reverseMoves.length < targetDepth && backtracks < MAX_BACKTRACKS) {
		const recentKeys = new Set(boards.slice(-TABU_LENGTH).map(createBoardKey));
		const steps = listReverseSteps(boards[boards.length - 1]).filter(
			(step) => !recentKeys.has(createBoardKey(step.board)),
		);

		if (steps.length === 0) {
			backtracks++;
			const stepsToDrop = Math.min(BACKTRACK_STEPS, reverseMoves.length);
			if (stepsToDrop === 0) {
				break;
			}
			reverseMoves.length -= stepsToDrop;
			boards.length -= stepsToDrop;
			continue;
		}

		const step = steps[Math.floor(random() * steps.length)];
		boards.push(step.board);
		reverseMoves.push(step.forwardMove);
		if (reverseMoves.length > deepest.solution.length && isAcceptableScramble(step.board, colorCount, emptyTubes)) {
			deepest = { board: step.board, solution: [...reverseMoves].reverse() };
		}
	}

	return deepest;
}

/** Last resort so generation always terminates: solvable by construction, though shallower than certified boards. */
function generateByReverseScramble(colorCount: number, emptyTubes: number, random: () => number): Puzzle {
	let puzzle = scramble(colorCount, emptyTubes, random);
	for (let attempt = 1; attempt < MAX_SCRAMBLE_ATTEMPTS && puzzle.solution.length === 0; attempt++) {
		puzzle = scramble(colorCount, emptyTubes, random);
	}
	return puzzle;
}

/** Deterministic for a given difficulty and seed, and always solvable. */
export function generatePuzzle(difficulty: DifficultyLevel, seed: number): Puzzle {
	if (seed >= 1 && seed <= 10) {
		const preset = getPreset(difficulty, seed);
		return {
			board: preset.board,
			solution: [...preset.solution],
		};
	}

	const { colorCount, emptyTubes } = DIFFICULTY_CONFIG[difficulty];
	const random = createSeededRandom(seed);
	return (
		generateCertifiedPuzzle(difficulty, colorCount, emptyTubes, random) ??
		generateByReverseScramble(colorCount, emptyTubes, random)
	);
}
