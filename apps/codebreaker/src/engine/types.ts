export type Difficulty = 'easy' | 'medium' | 'hard';

export type PegColorId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PegColorKey = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'teal' | 'pink';

export type PegSymbol = 'circle' | 'triangle' | 'square' | 'diamond' | 'star' | 'cross' | 'ring' | 'hexagon';

export interface PegColorSpec {
	readonly id: PegColorId;
	readonly key: PegColorKey;
	readonly symbol: PegSymbol;
	readonly numberLabel: string;
}

export const PEG_COLORS: readonly PegColorSpec[] = [
	{ id: 0, key: 'red', symbol: 'circle', numberLabel: '1' },
	{ id: 1, key: 'blue', symbol: 'triangle', numberLabel: '2' },
	{ id: 2, key: 'green', symbol: 'square', numberLabel: '3' },
	{ id: 3, key: 'yellow', symbol: 'diamond', numberLabel: '4' },
	{ id: 4, key: 'purple', symbol: 'star', numberLabel: '5' },
	{ id: 5, key: 'orange', symbol: 'cross', numberLabel: '6' },
	{ id: 6, key: 'teal', symbol: 'ring', numberLabel: '7' },
	{ id: 7, key: 'pink', symbol: 'hexagon', numberLabel: '8' },
] as const;

export interface DifficultyConfig {
	readonly difficulty: Difficulty;
	readonly codeLength: number;
	readonly colorCount: number;
	readonly maxAttempts: number;
}

export const DIFFICULTY_CONFIGS: Readonly<Record<Difficulty, DifficultyConfig>> = {
	easy: {
		difficulty: 'easy',
		codeLength: 4,
		colorCount: 6,
		maxAttempts: 10,
	},
	medium: {
		difficulty: 'medium',
		codeLength: 4,
		colorCount: 8,
		maxAttempts: 10,
	},
	hard: {
		difficulty: 'hard',
		codeLength: 5,
		colorCount: 8,
		maxAttempts: 12,
	},
} as const;

export const DIFFICULTY_ORDER: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const;

export function isDifficulty(value: unknown): value is Difficulty {
	return value === 'easy' || value === 'medium' || value === 'hard';
}

export interface CodeRuleConfig {
	readonly codeLength: number;
	readonly colorCount: number;
	readonly allowDuplicates: boolean;
}

export interface FeedbackResult {
	readonly exact: number;
	readonly partial: number;
}

export interface GuessRow {
	readonly guess: readonly PegColorId[];
	readonly feedback: FeedbackResult;
}

export type DraftRow = readonly (PegColorId | null)[];

export type GameStatus = 'playing' | 'won' | 'lost';

export type HintResult =
	| { readonly kind: 'contradiction'; readonly conflictingRowIndex: number }
	| { readonly kind: 'duplicate-disallowed' }
	| { readonly kind: 'suggestion'; readonly slotIndex: number; readonly colorId: PegColorId }
	| { readonly kind: 'consistent-complete' };

export interface CodebreakerSettings {
	showColorShapes: boolean;
	showColorNumbers: boolean;
	autoAdvanceSlot: boolean;
	allowDuplicates: boolean;
	[key: string]: unknown;
}

export const DEFAULT_CODEBREAKER_SETTINGS: CodebreakerSettings = {
	showColorShapes: false,
	showColorNumbers: false,
	autoAdvanceSlot: true,
	allowDuplicates: false,
};

export interface GameSnapshot {
	readonly difficulty: Difficulty;
	readonly allowDuplicates: boolean;
	readonly secret: readonly PegColorId[];
	readonly history: readonly GuessRow[];
	readonly draft: DraftRow;
	readonly selectedSlot: number;
	readonly elapsedSeconds: number;
	readonly hintsUsed: number;
	readonly status: GameStatus;
	readonly updatedAt: number;
}
