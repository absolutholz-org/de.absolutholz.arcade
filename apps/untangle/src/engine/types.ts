export interface Point {
	readonly x: number;
	readonly y: number;
}

export interface Vertex {
	readonly id: string;
	readonly x: number;
	readonly y: number;
	readonly targetX: number;
	readonly targetY: number;
}

export type Edge = readonly [string, string];

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['easy', 'medium', 'hard'];

export interface DifficultyConfig {
	readonly minVertices: number;
	readonly maxVertices: number;
	readonly minEdges: number;
	readonly maxEdges: number;
	readonly minInitialCrossings: number;
	readonly minDistance: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	easy: {
		minVertices: 6,
		maxVertices: 8,
		minEdges: 10,
		maxEdges: 12,
		minInitialCrossings: 3,
		minDistance: 0.18,
	},
	medium: {
		minVertices: 10,
		maxVertices: 14,
		minEdges: 18,
		maxEdges: 24,
		minInitialCrossings: 8,
		minDistance: 0.13,
	},
	hard: {
		minVertices: 16,
		maxVertices: 22,
		minEdges: 30,
		maxEdges: 40,
		minInitialCrossings: 16,
		minDistance: 0.095,
	},
};

export interface BoardState {
	readonly difficulty: DifficultyLevel;
	readonly seed: number;
	readonly vertices: readonly Vertex[];
	readonly edges: readonly Edge[];
	readonly moveCount: number;
}

export interface IntersectionSummary {
	readonly intersectionCount: number;
	readonly intersectingEdgeIndices: ReadonlySet<number>;
	readonly nodeCrossingCounts: Readonly<Record<string, number>>;
	readonly nodeDegreeCounts: Readonly<Record<string, number>>;
	readonly isSolved: boolean;
}

export interface HistoryState {
	readonly past: readonly BoardState[];
	readonly present: BoardState;
	readonly future: readonly BoardState[];
}

export interface UntangleSettings extends Record<string, unknown> {
	casualMode: boolean;
	gameMode: 'standard' | 'casual';
	highlightIntersectingEdges: boolean;
	showCrossingCounter: boolean;
}

export const DEFAULT_UNTANGLE_SETTINGS: UntangleSettings = {
	casualMode: false,
	gameMode: 'standard',
	highlightIntersectingEdges: true,
	showCrossingCounter: true,
};

export interface ActiveGameSnapshot {
	readonly board: BoardState;
	readonly historyPast?: readonly BoardState[];
	readonly historyFuture?: readonly BoardState[];
	readonly elapsedSeconds: number;
	readonly undoUsed: boolean;
	readonly updatedAt: number;
}
