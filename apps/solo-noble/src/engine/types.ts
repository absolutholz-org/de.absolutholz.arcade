export type BoardLayoutId = 'english' | 'european' | 'triangular' | 'diamond' | 'wiegleb';

export type GameVariant = 'classic-central' | 'clear-out' | 'custom-start';

export type GameStatus = 'ready' | 'playing' | 'stuck' | 'won';

export interface Coordinate {
	row: number;
	col: number;
}

export type CoordinateKey = `${number},${number}`;

export interface Jump {
	from: CoordinateKey;
	jumped: CoordinateKey;
	to: CoordinateKey;
}

export interface BoardLayoutDefinition {
	id: BoardLayoutId;
	name: string;
	gridWidth: number;
	gridHeight: number;
	holes: Coordinate[];
	centerHole: Coordinate;
	jumpVectors: [number, number][];
}

export interface CompiledBoardLayout {
	definition: BoardLayoutDefinition;
	holeKeys: Set<CoordinateKey>;
	centerKey: CoordinateKey;
	allJumps: Jump[];
	jumpsFrom: Map<CoordinateKey, Jump[]>;
	jumpsBetween: Map<`${CoordinateKey}->${CoordinateKey}`, Jump>;
}

export interface SoloNobleState {
	layoutId: BoardLayoutId;
	variant: GameVariant;
	status: GameStatus;
	board: Record<CoordinateKey, boolean>;
	pegCount: number;
	moveCount: number;
	initialEmptyKey: CoordinateKey | null;
}
