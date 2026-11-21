export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface DifficultyConfig {
	readonly size: number;
	readonly minMirrors: number;
	readonly maxMirrors: number;
}

export const DIFFICULTY_CONFIG: Readonly<Record<Difficulty, DifficultyConfig>> = {
	easy: { size: 4, minMirrors: 4, maxMirrors: 6 },
	medium: { size: 5, minMirrors: 7, maxMirrors: 10 },
	hard: { size: 6, minMirrors: 10, maxMirrors: 14 },
	expert: { size: 7, minMirrors: 15, maxMirrors: 20 },
};

export type MirrorType = '/' | '\\';

export const MONSTER_TYPES = ['ghost', 'vampire', 'zombie'] as const;
export type MonsterType = (typeof MONSTER_TYPES)[number];

export type EdgeSide = 'top' | 'right' | 'bottom' | 'left';
export const EDGE_SIDES: readonly EdgeSide[] = ['top', 'right', 'bottom', 'left'] as const;

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface MonsterCounts {
	readonly ghost: number;
	readonly vampire: number;
	readonly zombie: number;
}

export interface EdgeClues {
	readonly top: readonly number[];
	readonly right: readonly number[];
	readonly bottom: readonly number[];
	readonly left: readonly number[];
}

export interface RayStep {
	readonly row: number;
	readonly col: number;
	readonly enterDir: Direction;
	readonly exitDir: Direction;
	readonly hasReflected: boolean;
	readonly isMirror: boolean;
	readonly mirrorType: MirrorType | null;
}

export interface RayPath {
	readonly clueId: string;
	readonly side: EdgeSide;
	readonly index: number;
	readonly steps: readonly RayStep[];
}

export interface UndeadPuzzle {
	readonly id: string;
	readonly difficulty: Difficulty;
	readonly size: number;
	readonly mirrors: readonly (readonly (MirrorType | null)[])[];
	readonly clues: EdgeClues;
	readonly inventory: MonsterCounts;
	readonly solution: readonly (readonly (MonsterType | null)[])[];
}

export interface UndeadCell {
	readonly row: number;
	readonly col: number;
	readonly mirror: MirrorType | null;
	readonly monster: MonsterType | null;
	readonly notes: readonly MonsterType[];
}

export interface UndeadBoard {
	readonly size: number;
	readonly cells: readonly (readonly UndeadCell[])[];
	readonly clues: EdgeClues;
	readonly inventory: MonsterCounts;
}

export type ClueStatus = 'incomplete' | 'satisfied' | 'error';

export interface ClueEvaluation {
	readonly clueId: string;
	readonly side: EdgeSide;
	readonly index: number;
	readonly target: number;
	readonly visibleCount: number;
	readonly minPossible: number;
	readonly maxPossible: number;
	readonly allFilled: boolean;
	readonly status: ClueStatus;
}

export interface ValidationResult {
	readonly placedCounts: MonsterCounts;
	readonly overLimit: Readonly<Record<MonsterType, boolean>>;
	readonly clues: Readonly<Record<string, ClueEvaluation>>;
	readonly errorClueIds: ReadonlySet<string>;
	readonly hasErrors: boolean;
	readonly emptySlotCount: number;
	readonly isSolved: boolean;
}

export interface UndeadSettings extends Record<string, unknown> {
	readonly highlightErrors: boolean;
	readonly showRayPreview: boolean;
	readonly showClueProgress: boolean;
	readonly autoMarkCompletedClues: boolean;
}

export const DEFAULT_UNDEAD_SETTINGS: UndeadSettings = {
	highlightErrors: true,
	showRayPreview: true,
	showClueProgress: false,
	autoMarkCompletedClues: false,
};

export interface GameSnapshot {
	readonly puzzle: UndeadPuzzle;
	readonly placements: readonly (readonly (MonsterType | null)[])[];
	readonly notes: readonly (readonly (readonly MonsterType[])[])[];
	readonly completedClues: readonly string[];
	readonly elapsedSeconds: number;
	readonly movesCount: number;
	readonly mistakesCount: number;
	readonly updatedAt: number;
}

export function getClueId(side: EdgeSide, index: number): string {
	return `${side}-${index}`;
}
