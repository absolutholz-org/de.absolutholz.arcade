export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'] as const;

export interface DifficultyConfig {
	readonly size: number;
	readonly minInequalities: number;
	readonly initialInequalityRatio: number;
	readonly initialGivenRatio: number;
	readonly maxGivenDigits: number;
}

export const DIFFICULTY_CONFIG: Readonly<Record<Difficulty, DifficultyConfig>> = {
	easy: {
		size: 4,
		minInequalities: 3,
		initialInequalityRatio: 0.55,
		initialGivenRatio: 0.35,
		maxGivenDigits: 4,
	},
	medium: {
		size: 5,
		minInequalities: 5,
		initialInequalityRatio: 0.52,
		initialGivenRatio: 0.28,
		maxGivenDigits: 5,
	},
	hard: {
		size: 6,
		minInequalities: 8,
		initialInequalityRatio: 0.5,
		initialGivenRatio: 0.22,
		maxGivenDigits: 6,
	},
	expert: {
		size: 7,
		minInequalities: 11,
		initialInequalityRatio: 0.48,
		initialGivenRatio: 0.2,
		maxGivenDigits: 7,
	},
};

/**
 * Inequality sign between two adjacent cells:
 * - Horizontal `hInequalities[r][c]`: compares (r, c) and (r, c + 1).
 *   '<' means left < right; '>' means left > right.
 * - Vertical `vInequalities[r][c]`: compares (r, c) and (r + 1, c).
 *   '<' means top < bottom (renders as ∧); '>' means top > bottom (renders as ∨).
 */
export type InequalitySign = '<' | '>' | null;

export interface Cell {
	readonly row: number;
	readonly col: number;
	readonly value: number | null;
	readonly given: boolean;
	readonly notes: readonly number[];
}

export interface FutoshikiPuzzle {
	readonly id: string;
	readonly difficulty: Difficulty;
	readonly size: number;
	readonly givens: readonly (readonly (number | null)[])[];
	readonly solution: readonly (readonly number[])[];
	readonly hInequalities: readonly (readonly InequalitySign[])[];
	readonly vInequalities: readonly (readonly InequalitySign[])[];
}

export interface FutoshikiBoard {
	readonly size: number;
	readonly cells: readonly (readonly Cell[])[];
	readonly hInequalities: readonly (readonly InequalitySign[])[];
	readonly vInequalities: readonly (readonly InequalitySign[])[];
}

export interface ConflictResult {
	readonly duplicateCells: ReadonlySet<string>;
	readonly violatedHorizontal: ReadonlySet<string>;
	readonly violatedVertical: ReadonlySet<string>;
	readonly hasConflicts: boolean;
}

export type DeductionTechnique = 'naked-single' | 'hidden-single-row' | 'hidden-single-col' | 'inequality-bound';

export interface HintStep {
	readonly row: number;
	readonly col: number;
	readonly value: number;
	readonly technique: DeductionTechnique;
}

export interface CellInequalityRelations {
	readonly left?: 'greater' | 'less';
	readonly right?: 'greater' | 'less';
	readonly above?: 'greater' | 'less';
	readonly below?: 'greater' | 'less';
}

export interface FutoshikiSettings extends Record<string, unknown> {
	highlightPeerCells: boolean;
	highlightPeerDigits: boolean;
	highlightErrors: boolean;
	autoClearNotes: boolean;
}

export const DEFAULT_FUTOSHIKI_SETTINGS: FutoshikiSettings = {
	highlightPeerCells: true,
	highlightPeerDigits: true,
	highlightErrors: true,
	autoClearNotes: false,
};

export interface GameSnapshot {
	readonly puzzle: FutoshikiPuzzle;
	readonly values: readonly (readonly (number | null)[])[];
	readonly notes: readonly (readonly (readonly number[])[])[];
	readonly elapsedSeconds: number;
	readonly movesCount: number;
	readonly hintsUsed: number;
	readonly mistakesCount: number;
	readonly updatedAt: number;
}
