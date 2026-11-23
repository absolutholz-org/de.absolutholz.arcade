export type Direction = 'N' | 'E' | 'S' | 'W';

export type MirrorOrientation = '/' | '\\';

export type PrimaryColor = 'red' | 'green' | 'blue';

export type BeamColor = 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'white';

export type CellKind =
	| 'empty'
	| 'emitter'
	| 'mirror'
	| 'fixed-mirror'
	| 'splitter'
	| 'fixed-splitter'
	| 'wall'
	| 'target';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'] as const;

export interface DifficultyConfig {
	readonly id: Difficulty;
	readonly rows: number;
	readonly cols: number;
	readonly emitters: number;
	readonly targets: number;
	readonly splitters: number;
	readonly fixedMirrors: number;
	readonly minRotatableMirrors: number;
	readonly maxRotatableMirrors: number;
	readonly walls: number;
	readonly decoys: number;
	readonly colorMixing: boolean;
}

export const DIFFICULTY_CONFIGS: Readonly<Record<Difficulty, DifficultyConfig>> = {
	easy: {
		id: 'easy',
		rows: 5,
		cols: 5,
		emitters: 1,
		targets: 1,
		splitters: 0,
		fixedMirrors: 0,
		minRotatableMirrors: 3,
		maxRotatableMirrors: 4,
		walls: 2,
		decoys: 0,
		colorMixing: false,
	},
	medium: {
		id: 'medium',
		rows: 7,
		cols: 7,
		emitters: 1,
		targets: 2,
		splitters: 1,
		fixedMirrors: 2,
		minRotatableMirrors: 5,
		maxRotatableMirrors: 7,
		walls: 4,
		decoys: 0,
		colorMixing: false,
	},
	hard: {
		id: 'hard',
		rows: 8,
		cols: 8,
		emitters: 2,
		targets: 3,
		splitters: 1,
		fixedMirrors: 2,
		minRotatableMirrors: 5,
		maxRotatableMirrors: 8,
		walls: 4,
		decoys: 0,
		colorMixing: true,
	},
	expert: {
		id: 'expert',
		rows: 9,
		cols: 9,
		emitters: 2,
		targets: 4,
		splitters: 2,
		fixedMirrors: 2,
		minRotatableMirrors: 6,
		maxRotatableMirrors: 9,
		walls: 5,
		decoys: 3,
		colorMixing: true,
	},
};

export interface CellCoord {
	readonly row: number;
	readonly col: number;
}

export interface LaserCell {
	readonly row: number;
	readonly col: number;
	readonly kind: CellKind;
	readonly direction?: Direction;
	readonly color?: BeamColor;
	readonly orientation?: MirrorOrientation;
	readonly solutionOrientation?: MirrorOrientation;
	readonly isDecoy?: boolean;
}

export type LaserGrid = readonly (readonly LaserCell[])[];

export interface LaserPuzzle {
	readonly seed: number;
	readonly difficulty: Difficulty;
	readonly rows: number;
	readonly cols: number;
	readonly initialGrid: LaserGrid;
	readonly parMoves: number;
	readonly targetCount: number;
}

export interface BeamSegment {
	readonly fromRow: number;
	readonly fromCol: number;
	readonly toRow: number;
	readonly toCol: number;
	readonly color: BeamColor;
	readonly colorMask: number;
	readonly direction: Direction;
}

export interface TargetStatus {
	readonly row: number;
	readonly col: number;
	readonly requiredColor: BeamColor;
	readonly receivedColor: BeamColor | null;
	readonly receivedMask: number;
	readonly isLit: boolean;
}

export interface RaytraceResult {
	readonly segments: readonly BeamSegment[];
	readonly targets: readonly TargetStatus[];
	readonly litTargetCount: number;
	readonly totalTargetCount: number;
	readonly isSolved: boolean;
	readonly terminatedByLoopGuard: boolean;
}

export interface LasersSettings extends Record<string, unknown> {
	readonly showColorSymbols: boolean;
	readonly showParCounter: boolean;
}

export const DEFAULT_LASERS_SETTINGS: LasersSettings = {
	showColorSymbols: true,
	showParCounter: true,
};

export interface GameSnapshot {
	readonly seed: number;
	readonly difficulty: Difficulty;
	readonly rows: number;
	readonly cols: number;
	readonly grid: LaserGrid;
	readonly initialGrid: LaserGrid;
	readonly parMoves: number;
	readonly movesCount: number;
	readonly hintsUsed: number;
	readonly undosUsed: number;
	readonly elapsedSeconds: number;
	readonly status: 'playing' | 'solved';
}

export const COLOR_MASKS: Readonly<Record<BeamColor, number>> = {
	red: 1,
	green: 2,
	yellow: 3,
	blue: 4,
	magenta: 5,
	cyan: 6,
	white: 7,
};

export const MASK_TO_COLOR: Readonly<Record<number, BeamColor>> = {
	1: 'red',
	2: 'green',
	3: 'yellow',
	4: 'blue',
	5: 'magenta',
	6: 'cyan',
	7: 'white',
};

/**
 * Distinct non-color geometric symbols paired with each optical channel (WCAG 1.4.1 / BITV 2.0).
 */
export const COLOR_SYMBOLS: Readonly<Record<BeamColor, string>> = {
	red: '●',
	blue: '▲',
	green: '■',
	magenta: '◆',
	yellow: '★',
	cyan: '✚',
	white: '✦',
};

export function isRotatableCell(cell: LaserCell): boolean {
	return cell.kind === 'mirror' || cell.kind === 'splitter';
}

export function toggleOrientation(orientation: MirrorOrientation): MirrorOrientation {
	return orientation === '/' ? '\\' : '/';
}
