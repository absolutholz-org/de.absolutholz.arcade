export type ColorIndex = 0 | 1 | 2 | 3;

export const ALL_COLORS: readonly ColorIndex[] = [0, 1, 2, 3] as const;

export const COLOR_SHAPES: Readonly<Record<ColorIndex, string>> = {
	0: '●',
	1: '▲',
	2: '■',
	3: '◆',
};

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'] as const;

export interface DifficultyConfig {
	readonly gridSize: number;
	readonly minRegions: number;
	readonly maxRegions: number;
	readonly minClueRatio: number;
	readonly maxClueRatio: number;
	readonly minRegionCells: number;
}

export const DIFFICULTY_CONFIGS: Readonly<Record<Difficulty, DifficultyConfig>> = {
	easy: {
		gridSize: 12,
		minRegions: 10,
		maxRegions: 12,
		minClueRatio: 0.4,
		maxClueRatio: 0.45,
		minRegionCells: 5,
	},
	medium: {
		gridSize: 16,
		minRegions: 16,
		maxRegions: 18,
		minClueRatio: 0.33,
		maxClueRatio: 0.38,
		minRegionCells: 6,
	},
	hard: {
		gridSize: 24,
		minRegions: 28,
		maxRegions: 32,
		minClueRatio: 0.25,
		maxClueRatio: 0.3,
		minRegionCells: 8,
	},
	expert: {
		gridSize: 32,
		minRegions: 45,
		maxRegions: 50,
		minClueRatio: 0.2,
		maxClueRatio: 0.25,
		minRegionCells: 9,
	},
};

export interface GridCoord {
	readonly row: number;
	readonly col: number;
}

export interface RegionBoundingBox {
	readonly minRow: number;
	readonly maxRow: number;
	readonly minCol: number;
	readonly maxCol: number;
}

export interface RegionInfo {
	readonly id: number;
	readonly cellCount: number;
	readonly neighbors: readonly number[];
	/** Center of the deepest interior cell for placing glyphs, locks, and candidate dots */
	readonly labelAnchor: GridCoord;
	/** Distance in cells from labelAnchor to the nearest region boundary (>= 1) */
	readonly anchorRadius: number;
	readonly boundingBox: RegionBoundingBox;
}

export interface ColorMapPuzzle {
	readonly id: string;
	readonly seed: number;
	readonly difficulty: Difficulty;
	readonly gridSize: number;
	/** gridSize × gridSize matrix mapping each cell to its region ID (0..regions.length - 1) */
	readonly regionGrid: readonly (readonly number[])[];
	readonly regions: readonly RegionInfo[];
	/** Pre-filled locked region colors (null means unlocked / blank at start) */
	readonly givens: readonly (ColorIndex | null)[];
	/** Complete valid 4-coloring solution indexed by region ID */
	readonly solution: readonly ColorIndex[];
}

export interface ColorMapBoardState {
	readonly colors: readonly (ColorIndex | null)[];
	readonly candidates: readonly (readonly ColorIndex[])[];
}

export interface ConflictSummary {
	/** Region IDs currently participating in at least one adjacent color conflict */
	readonly conflictingRegions: ReadonlySet<number>;
	/** Sorted pair keys (`"${a}-${b}"` where a < b) of conflicting adjacent region pairs */
	readonly conflictingPairs: ReadonlySet<string>;
	readonly hasConflicts: boolean;
}

export interface ColorMapSettings extends Record<string, unknown> {
	readonly highlightConflicts: boolean;
	readonly showColorblindShapes: boolean;
	readonly autoClearCandidates: boolean;
}

export const DEFAULT_COLOR_MAP_SETTINGS: ColorMapSettings = {
	highlightConflicts: true,
	showColorblindShapes: true,
	autoClearCandidates: true,
};

export interface GameSnapshot {
	readonly puzzle: ColorMapPuzzle;
	readonly colors: readonly (ColorIndex | null)[];
	readonly candidates: readonly (readonly ColorIndex[])[];
	readonly elapsedSeconds: number;
	readonly movesCount: number;
	readonly mistakesCount: number;
	readonly updatedAt: number;
}
