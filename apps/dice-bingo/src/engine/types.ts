export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GridCoord {
	readonly row: number;
	readonly col: number;
}

export interface Cell extends GridCoord {
	readonly value: number | null;
	readonly isObstacle: boolean;
}

export type Board = Cell[][];

export type HandType5 =
	| 'five_of_a_kind'
	| 'straight_no_seven'
	| 'straight_with_seven'
	| 'full_house'
	| 'four_of_a_kind'
	| 'three_of_a_kind'
	| 'two_pair'
	| 'one_pair'
	| 'none';

export type HandType4 = 'four_of_a_kind' | 'straight_four' | 'three_of_a_kind' | 'two_pair' | 'one_pair' | 'none';

export type HandType = HandType5 | HandType4;

export type LineDirection = 'row' | 'col' | 'main_diagonal' | 'anti_diagonal';

export interface LineEvaluation {
	readonly direction: LineDirection;
	readonly index: number;
	readonly coords: GridCoord[];
	readonly values: number[];
	readonly hand: HandType;
	readonly basePoints: number;
	readonly multiplier: number;
	readonly score: number;
}

export interface BoardScore {
	readonly lines: LineEvaluation[];
	readonly totalScore: number;
	readonly rowScore: number;
	readonly colScore: number;
	readonly diagonalScore: number;
	readonly cleanSweep: boolean;
}

export interface DiceRoll {
	readonly dice: [number, number];
	readonly sum: number;
}

export type GamePhase = 'ready_to_roll' | 'rolling' | 'placing' | 'game_over';

export interface MoveRecord {
	readonly turn: number;
	readonly coord: GridCoord;
	readonly roll: DiceRoll;
	readonly completedHand?: HandType;
}

export interface DiceBingoSnapshot {
	readonly difficulty: DifficultyLevel;
	readonly board: Board;
	readonly currentRoll: DiceRoll | null;
	readonly currentTurn: number;
	readonly maxTurns: number;
	readonly phase: GamePhase;
	readonly moveHistory: MoveRecord[];
	readonly lastHandScored?: HandType;
	readonly isComplete: boolean;
	readonly finalScore?: number;
	readonly startedAt: number;
	readonly completedAt?: number;
}
