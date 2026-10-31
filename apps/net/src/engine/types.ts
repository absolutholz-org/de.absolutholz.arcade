export const DIR_NONE = 0;
export const DIR_NORTH = 1; // 1 << 0 (N)
export const DIR_EAST = 2; // 1 << 1 (E)
export const DIR_SOUTH = 4; // 1 << 2 (S)
export const DIR_WEST = 8; // 1 << 3 (W)

export type Direction = 1 | 2 | 4 | 8;
export type PortMask = number; // bitmask from 0 to 15

export const ALL_DIRECTIONS: readonly Direction[] = [DIR_NORTH, DIR_EAST, DIR_SOUTH, DIR_WEST];

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
	[DIR_NORTH]: DIR_SOUTH,
	[DIR_EAST]: DIR_WEST,
	[DIR_SOUTH]: DIR_NORTH,
	[DIR_WEST]: DIR_EAST,
};

export const DIRECTION_DELTAS: Record<Direction, { readonly dr: number; readonly dc: number }> = {
	[DIR_NORTH]: { dr: -1, dc: 0 },
	[DIR_EAST]: { dr: 0, dc: 1 },
	[DIR_SOUTH]: { dr: 1, dc: 0 },
	[DIR_WEST]: { dr: 0, dc: -1 },
};

export type TileShape = 'endpoint' | 'straight' | 'corner' | 'tee' | 'cross' | 'empty';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
	readonly rows: number;
	readonly cols: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
	easy: { rows: 5, cols: 5 },
	medium: { rows: 7, cols: 7 },
	hard: { rows: 9, cols: 9 },
	expert: { rows: 11, cols: 11 },
};

export interface Cell {
	readonly id: string;
	readonly row: number;
	readonly col: number;
	readonly isRoot: boolean;
	readonly solutionMask: PortMask;
	readonly currentMask: PortMask;
	readonly rotation: number; // Visual angle in degrees (e.g. 0, 90, 180, 270)
	readonly isPowered: boolean;
	readonly isLocked: boolean;
}

export interface Board {
	readonly rows: number;
	readonly cols: number;
	readonly rootRow: number;
	readonly rootCol: number;
	readonly grid: readonly (readonly Cell[])[];
}

export interface Move {
	readonly row: number;
	readonly col: number;
	readonly previousMask: PortMask;
	readonly newMask: PortMask;
	readonly previousRotation: number;
	readonly newRotation: number;
}

export interface GameSnapshot {
	readonly difficulty: Difficulty;
	readonly rows: number;
	readonly cols: number;
	readonly rootRow: number;
	readonly rootCol: number;
	readonly cells: readonly {
		readonly row: number;
		readonly col: number;
		readonly solutionMask: PortMask;
		readonly currentMask: PortMask;
		readonly rotation: number;
		readonly isLocked: boolean;
	}[];
	readonly movesCount: number;
	readonly elapsedTimeSeconds: number;
	readonly isSolved: boolean;
	readonly timestamp: number;
}
