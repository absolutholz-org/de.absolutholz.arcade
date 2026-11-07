import { PENTOMINO_IDS } from './pieces.ts';
import { solveExactCover } from './solver.ts';
import type { Difficulty, LevelDefinition, PieceId, Placement } from './types.ts';

function createRectMask(rows: number, cols: number): ReadonlyArray<ReadonlyArray<number>> {
	return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1));
}

function parseAsciiMask(lines: ReadonlyArray<string>): ReadonlyArray<ReadonlyArray<number>> {
	return lines.map((line) => Array.from(line).map((ch) => (ch === '#' ? 1 : 0)));
}

export const CURATED_LEVELS: ReadonlyArray<LevelDefinition> = [
	{
		id: 'rect-3x5',
		difficulty: 'easy',
		category: 'penta-ladder',
		rows: 3,
		cols: 5,
		mask: createRectMask(3, 5),
		pieceIds: ['F', 'P', 'U'],
	},
	{
		id: 'rect-4x5',
		difficulty: 'easy',
		category: 'penta-ladder',
		rows: 4,
		cols: 5,
		mask: createRectMask(4, 5),
		pieceIds: ['L', 'N', 'P', 'U'],
	},
	{
		id: 'rect-5x5',
		difficulty: 'easy',
		category: 'penta-ladder',
		rows: 5,
		cols: 5,
		mask: createRectMask(5, 5),
		pieceIds: ['I', 'L', 'N', 'P', 'U'],
	},
	{
		id: 'rect-5x6',
		difficulty: 'medium',
		category: 'penta-ladder',
		rows: 5,
		cols: 6,
		mask: createRectMask(5, 6),
		pieceIds: ['F', 'I', 'L', 'P', 'U', 'X'],
	},
	{
		id: 'rect-5x7',
		difficulty: 'medium',
		category: 'penta-ladder',
		rows: 5,
		cols: 7,
		mask: createRectMask(5, 7),
		pieceIds: ['F', 'L', 'P', 'T', 'U', 'V', 'Y'],
	},
	{
		id: 'rect-5x8',
		difficulty: 'medium',
		category: 'penta-ladder',
		rows: 5,
		cols: 8,
		mask: createRectMask(5, 8),
		pieceIds: ['F', 'I', 'L', 'P', 'T', 'U', 'V', 'Y'],
	},
	{
		id: 'rect-5x9',
		difficulty: 'hard',
		category: 'penta-ladder',
		rows: 5,
		cols: 9,
		mask: createRectMask(5, 9),
		pieceIds: ['F', 'L', 'N', 'P', 'T', 'U', 'V', 'X', 'Y'],
	},
	{
		id: 'rect-5x10',
		difficulty: 'hard',
		category: 'penta-ladder',
		rows: 5,
		cols: 10,
		mask: createRectMask(5, 10),
		pieceIds: ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'X', 'Y'],
	},
	{
		id: 'rect-5x11',
		difficulty: 'hard',
		category: 'penta-ladder',
		rows: 5,
		cols: 11,
		mask: createRectMask(5, 11),
		pieceIds: ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y'],
	},
	{
		id: 'rect-5x12',
		difficulty: 'expert',
		category: 'penta-ladder',
		rows: 5,
		cols: 12,
		mask: createRectMask(5, 12),
		pieceIds: PENTOMINO_IDS,
	},
	{
		id: 'rect-6x10',
		difficulty: 'expert',
		category: 'full-set-60',
		rows: 6,
		cols: 10,
		mask: createRectMask(6, 10),
		pieceIds: PENTOMINO_IDS,
	},
	{
		id: 'rect-8x8-ring',
		difficulty: 'expert',
		category: 'full-set-60',
		rows: 8,
		cols: 8,
		mask: parseAsciiMask([
			'########',
			'########',
			'########',
			'###..###',
			'###..###',
			'########',
			'########',
			'########',
		]),
		pieceIds: PENTOMINO_IDS,
	},
	{
		id: 'rect-8x8-notched',
		difficulty: 'expert',
		category: 'full-set-60',
		rows: 8,
		cols: 8,
		mask: parseAsciiMask([
			'.######.',
			'########',
			'########',
			'########',
			'########',
			'########',
			'########',
			'.######.',
		]),
		pieceIds: PENTOMINO_IDS,
	},
	{
		id: 'silhouette-cross',
		difficulty: 'hard',
		category: 'custom-silhouette',
		rows: 7,
		cols: 7,
		mask: parseAsciiMask(['..###..', '..###..', '#######', '#######', '#######', '..###..', '..###..']),
		pieceIds: ['L4', 'N', 'P', 'T', 'T4', 'U', 'X'],
	},
	{
		id: 'silhouette-staircase',
		difficulty: 'medium',
		category: 'custom-silhouette',
		rows: 5,
		cols: 8,
		mask: parseAsciiMask(['..######', '..######', '########', '########', '########']),
		pieceIds: ['I3', 'O4', 'T4', 'U', 'F', 'L', 'N', 'P'],
	},
	{
		id: 'silhouette-archway',
		difficulty: 'hard',
		category: 'custom-silhouette',
		rows: 5,
		cols: 9,
		mask: parseAsciiMask(['#########', '#########', '#########', '.#.######', '...######']),
		pieceIds: ['F', 'L', 'N', 'P', 'T', 'V', 'X', 'Y'],
	},
];

export function getCuratedLevel(levelId: string): LevelDefinition | undefined {
	return CURATED_LEVELS.find((lvl) => lvl.id === levelId);
}

export function getLevelsByDifficulty(difficulty: Difficulty): ReadonlyArray<LevelDefinition> {
	return CURATED_LEVELS.filter((lvl) => lvl.difficulty === difficulty);
}

export function createSeededRng(seed: number): () => number {
	let state = seed >>> 0 || 1;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function generateProceduralPuzzle(
	difficulty: Difficulty,
	seed: number,
): {
	readonly level: LevelDefinition;
	readonly solution: ReadonlyArray<Placement>;
} {
	const rng = createSeededRng(seed);
	const pool = getLevelsByDifficulty(difficulty);
	const fallback = CURATED_LEVELS[0];
	const chosenTemplate = pool[Math.floor(rng() * pool.length)] ?? fallback;

	const baseSolution = solveExactCover(chosenTemplate.mask, chosenTemplate.pieceIds, {
		maxSolutions: 1,
	});

	if (difficulty === 'easy' || difficulty === 'medium') {
		const candidatePentominoes: ReadonlyArray<PieceId> = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'Y', 'Z'];
		const shuffled = [...candidatePentominoes].sort(() => rng() - 0.5);
		const targetCount = chosenTemplate.pieceIds.length;
		const subset = shuffled.slice(0, targetCount);
		const subsetSolve = solveExactCover(chosenTemplate.mask, subset, {
			maxSolutions: 1,
			maxNodes: 25_000,
		});
		if (subsetSolve.solvable && subsetSolve.firstSolution) {
			return {
				level: {
					...chosenTemplate,
					id: `procedural-${difficulty}-${seed}`,
					pieceIds: subset,
				},
				solution: subsetSolve.firstSolution,
			};
		}
	}

	return {
		level: {
			...chosenTemplate,
			id: `procedural-${difficulty}-${seed}`,
		},
		solution: baseSolution.firstSolution ?? [],
	};
}
