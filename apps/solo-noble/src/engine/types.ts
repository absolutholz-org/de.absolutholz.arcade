/**
 * Supported board layouts for Solo Noble (Peg Solitaire).
 */
export type BoardLayoutId = 'english' | 'european' | 'triangular' | 'diamond' | 'wiegleb';

/**
 * Supported gameplay rule variants.
 */
export type GameVariantId = 'classic-central' | 'clear-out' | 'custom-start';

/**
 * Lifecycle status of the Solo Noble game session.
 */
export type GameStatus = 'ready' | 'playing' | 'stuck' | 'won';

/**
 * 2D row/column coordinate on the board lattice.
 */
export interface Position {
	readonly r: number;
	readonly c: number;
}

/**
 * Direction vector specifying step intervals for jump validation.
 */
export interface JumpVector {
	readonly dr: number;
	readonly dc: number;
}

/**
 * Fully qualified jump triplet: source peg, jumped peg, and target landing hole.
 */
export interface JumpMove {
	readonly from: Position;
	readonly jumped: Position;
	readonly to: Position;
}

/**
 * Geometry definition and precomputed jump graph for a board layout.
 */
export interface BoardDefinition {
	readonly id: BoardLayoutId;
	readonly name: string;
	readonly rowCount: number;
	readonly colCount: number;
	readonly holes: readonly Position[];
	readonly center: Position;
	readonly jumpVectors: readonly JumpVector[];
	readonly validJumps: readonly JumpMove[];
	readonly holeSet: ReadonlySet<string>;
	readonly jumpLookup: ReadonlyMap<string, ReadonlyMap<string, JumpMove>>;
}

/**
 * Configuration options for initializing a SoloNobleEngine instance.
 */
export interface EngineOptions {
	readonly layoutId?: BoardLayoutId;
	readonly variantId?: GameVariantId;
	readonly initialEmpty?: Position;
}

/**
 * Immutable snapshot of the game state for telemetry, UI rendering, or serialization.
 */
export interface SoloNobleSnapshot {
	readonly layoutId: BoardLayoutId;
	readonly variantId: GameVariantId;
	readonly status: GameStatus;
	readonly pegCount: number;
	readonly moveCount: number;
	readonly initialEmpty: Position | null;
	readonly pegs: ReadonlySet<string>;
}
