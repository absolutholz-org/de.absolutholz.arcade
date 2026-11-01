export const STANDARD_DIE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const;

export type StandardDieSides = (typeof STANDARD_DIE_SIDES)[number];

export const DEFAULT_DIE_SIDES: StandardDieSides = 6;
export const DEFAULT_DICE_COUNT = 2;
export const MIN_DICE_COUNT = 1;
export const MAX_DICE_COUNT = 20;

const STANDARD_DIE_SIDES_SET: ReadonlySet<number> = new Set<number>(STANDARD_DIE_SIDES);

export function isStandardDieSides(value: number): value is StandardDieSides {
	return STANDARD_DIE_SIDES_SET.has(value);
}

/**
 * Normalized random number generator returning a float in [0, 1).
 */
export type RandomGenerator = () => number;

export interface DieState {
	id: string;
	sides: StandardDieSides;
	value: number;
	isHeld: boolean;
	isRolling: boolean;
}

export interface RollHistoryEntry {
	timestamp: number;
	dice: DieState[];
	total: number;
}

export interface DiceEngineOptions {
	count?: number;
	sides?: StandardDieSides;
}

export interface RollDiceResult {
	dice: DieState[];
	total: number;
}

export interface DiceStats {
	total: number;
	min: number;
	max: number;
	counts: Record<number, number>;
}

export interface ParsedDiceNotation {
	count: number;
	sides: StandardDieSides;
	modifier: number;
}
