export type PieceId =
	| 'F'
	| 'I'
	| 'L'
	| 'N'
	| 'P'
	| 'T'
	| 'U'
	| 'V'
	| 'W'
	| 'X'
	| 'Y'
	| 'Z'
	| 'I4'
	| 'O4'
	| 'T4'
	| 'L4'
	| 'Z4'
	| 'I3'
	| 'V3';

export type Rotation = 0 | 90 | 180 | 270;

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type LevelCategory = 'penta-ladder' | 'full-set-60' | 'custom-silhouette';

export interface Coordinate {
	readonly row: number;
	readonly col: number;
}

export interface PolyominoDefinition {
	readonly id: PieceId;
	readonly label: string;
	readonly size: 3 | 4 | 5;
	readonly baseCells: ReadonlyArray<Coordinate>;
	readonly colorIndex: number;
}

export interface TransformedShape {
	readonly rotation: Rotation;
	readonly flipped: boolean;
	readonly cells: ReadonlyArray<Coordinate>;
	readonly width: number;
	readonly height: number;
	readonly labelCell: Coordinate;
	readonly key: string;
}

export interface Placement {
	readonly pieceId: PieceId;
	readonly anchor: Coordinate;
	readonly rotation: Rotation;
	readonly flipped: boolean;
}

export interface ActivePieceSelection {
	readonly pieceId: PieceId;
	readonly rotation: Rotation;
	readonly flipped: boolean;
}

export type InvalidPlacementReason = 'out-of-bounds' | 'void-cell' | 'overlap' | 'duplicate-piece';

export interface PlacementValidationResult {
	readonly valid: boolean;
	readonly reason?: InvalidPlacementReason;
	readonly occupiedCells: ReadonlyArray<Coordinate>;
}

export interface LevelDefinition {
	readonly id: string;
	readonly difficulty: Difficulty;
	readonly category: LevelCategory;
	readonly rows: number;
	readonly cols: number;
	readonly mask: ReadonlyArray<ReadonlyArray<number>>;
	readonly pieceIds: ReadonlyArray<PieceId>;
}

export interface PentominoesSaveState {
	readonly levelId: string;
	readonly mode: 'curated' | 'procedural';
	readonly difficulty: Difficulty;
	readonly seed: number;
	readonly mask: ReadonlyArray<ReadonlyArray<number>>;
	readonly pieceIds: ReadonlyArray<PieceId>;
	readonly placements: ReadonlyArray<Placement>;
	readonly moveCount: number;
	readonly hintsUsed: number;
	readonly undoCount: number;
	readonly elapsedSeconds: number;
	readonly updatedAt: string;
}

export interface PentominoesProgress {
	readonly completedLevelIds: ReadonlyArray<string>;
	readonly bestTimeByLevel: Readonly<Record<string, number>>;
	readonly winsByDifficulty: Readonly<Record<Difficulty, number>>;
}

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'] as const;

export interface PentominoesLastConfig {
	readonly difficulty?: Difficulty;
	readonly levelId?: string;
	readonly mode?: 'curated' | 'procedural';
}
