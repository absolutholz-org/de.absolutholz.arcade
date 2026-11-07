import type {
	Board,
	BoardScore,
	GridCoord,
	HandType,
	HandType4,
	HandType5,
	LineDirection,
	LineEvaluation,
} from './types.ts';

export const HAND_POINTS_5: Record<HandType5, number> = {
	five_of_a_kind: 10,
	straight_no_seven: 12,
	straight_with_seven: 8,
	full_house: 8,
	four_of_a_kind: 6,
	three_of_a_kind: 3,
	two_pair: 3,
	one_pair: 1,
	none: 0,
};

export const HAND_POINTS_4: Record<HandType4, number> = {
	four_of_a_kind: 8,
	straight_four: 6,
	three_of_a_kind: 3,
	two_pair: 2,
	one_pair: 1,
	none: 0,
};

function getFrequencies(values: number[]): Map<number, number> {
	const freqs = new Map<number, number>();
	for (const val of values) {
		freqs.set(val, (freqs.get(val) ?? 0) + 1);
	}
	return freqs;
}

/**
 * Checks if a set of distinct values forms a 5-number straight.
 * Supports standard consecutive sequences (e.g. 2,3,4,5,6 or 8,9,10,11,12)
 * as well as wrap-around sequences over 2d6 domain [2..12] (e.g. 11,12,2,3,4).
 */
export function isStraight5(values: number[]): boolean {
	if (values.length !== 5) return false;
	const sorted = [...values].sort((a, b) => a - b);
	const unique = new Set(sorted);
	if (unique.size !== 5) return false;

	// Standard consecutive check
	let isConsecutive = true;
	for (let i = 1; i < 5; i++) {
		if (sorted[i] !== sorted[i - 1] + 1) {
			isConsecutive = false;
			break;
		}
	}
	if (isConsecutive) return true;

	// Circular wrap-around over domain [2..12] (11 values: 2=0, ..., 12=10)
	// Map values 2..12 to 0..10
	const mod11 = sorted.map((v) => (v - 2) % 11).sort((a, b) => a - b);
	// In circular range of size 11, 5 consecutive values have adjacent diffs == 1 except at wrap point where diff == 7 (11 - 4)
	let diffGaps = 0;
	let singleWrapGap = 0;
	for (let i = 1; i < 5; i++) {
		const diff = mod11[i] - mod11[i - 1];
		if (diff === 1) continue;
		diffGaps++;
		singleWrapGap = diff;
	}
	// If 4 adjacent steps are 1, it's standard straight (already checked).
	// If exactly one gap and wrap around from end to start is 1: (mod11[0] + 11 - mod11[4] == 1)
	if (diffGaps === 0 && mod11[0] + 11 - mod11[4] === 7) {
		return true;
	}
	if (diffGaps === 1 && mod11[0] + 11 - mod11[4] === 1) {
		return true;
	}

	return false;
}

/**
 * Checks if a set of distinct values forms a 4-number straight.
 */
export function isStraight4(values: number[]): boolean {
	if (values.length !== 4) return false;
	const sorted = [...values].sort((a, b) => a - b);
	const unique = new Set(sorted);
	if (unique.size !== 4) return false;

	let isConsecutive = true;
	for (let i = 1; i < 4; i++) {
		if (sorted[i] !== sorted[i - 1] + 1) {
			isConsecutive = false;
			break;
		}
	}
	if (isConsecutive) return true;

	// Wrap-around 4 consecutive
	const mod11 = sorted.map((v) => (v - 2) % 11).sort((a, b) => a - b);
	let diffGaps = 0;
	for (let i = 1; i < 4; i++) {
		if (mod11[i] - mod11[i - 1] !== 1) diffGaps++;
	}
	if (diffGaps === 1 && mod11[0] + 11 - mod11[3] === 1) {
		return true;
	}

	return false;
}

/**
 * Classifies a completed 5-number hand with strict precedence.
 */
export function evaluateHand5(values: number[]): HandType5 {
	if (values.length !== 5) return 'none';

	const freqs = getFrequencies(values);
	const counts = Array.from(freqs.values()).sort((a, b) => b - a);

	// Five of a kind (10 pts)
	if (counts[0] === 5) {
		return 'five_of_a_kind';
	}

	// Straights
	if (isStraight5(values)) {
		if (values.includes(7)) {
			// Straight with 7 (8 pts) vs Full House (8 pts) vs Four of a Kind (6 pts)
			// A straight has counts [1, 1, 1, 1, 1], so it cannot be Full House or Four of a Kind.
			// Precedence: Straight with 7 = 8 pts
			return 'straight_with_seven';
		}
		// Straight without 7 (12 pts) - highest scoring hand!
		return 'straight_no_seven';
	}

	// Full house (8 pts: 3 of a kind + pair)
	if (counts[0] === 3 && counts[1] === 2) {
		return 'full_house';
	}

	// Four of a kind (6 pts)
	if (counts[0] === 4) {
		return 'four_of_a_kind';
	}

	// Three of a kind (3 pts)
	if (counts[0] === 3) {
		return 'three_of_a_kind';
	}

	// Two pair (3 pts)
	if (counts[0] === 2 && counts[1] === 2) {
		return 'two_pair';
	}

	// One pair (1 pt)
	if (counts[0] === 2) {
		return 'one_pair';
	}

	return 'none';
}

/**
 * Classifies a completed 4-number hand with strict precedence.
 */
export function evaluateHand4(values: number[]): HandType4 {
	if (values.length !== 4) return 'none';

	const freqs = getFrequencies(values);
	const counts = Array.from(freqs.values()).sort((a, b) => b - a);

	// Four of a kind (8 pts)
	if (counts[0] === 4) {
		return 'four_of_a_kind';
	}

	// 4-Number Straight (6 pts)
	if (isStraight4(values)) {
		return 'straight_four';
	}

	// Three of a kind (3 pts)
	if (counts[0] === 3) {
		return 'three_of_a_kind';
	}

	// Two pair (2 pts)
	if (counts[0] === 2 && counts[1] === 2) {
		return 'two_pair';
	}

	// One pair (1 pt)
	if (counts[0] === 2) {
		return 'one_pair';
	}

	return 'none';
}

/**
 * Evaluates a single line of cells, automatically handling obstacles and diagonal multipliers.
 */
export function evaluateLine(
	direction: LineDirection,
	index: number,
	coords: GridCoord[],
	board: Board,
): LineEvaluation {
	const cells = coords.map((c) => board[c.row][c.col]);
	const playableCells = cells.filter((c) => !c.isObstacle);
	const isFull = playableCells.every((c) => c.value !== null);

	const isDiagonal = direction === 'main_diagonal' || direction === 'anti_diagonal';
	const multiplier = isDiagonal ? 2 : 1;

	if (!isFull) {
		return {
			direction,
			index,
			coords,
			values: playableCells.map((c) => c.value).filter((v): v is number => v !== null),
			hand: 'none',
			basePoints: 0,
			multiplier,
			score: 0,
		};
	}

	const values = playableCells.map((c) => c.value as number);
	let hand: HandType = 'none';
	let basePoints = 0;

	if (values.length === 5) {
		const hand5 = evaluateHand5(values);
		hand = hand5;
		basePoints = HAND_POINTS_5[hand5];
	} else if (values.length === 4) {
		const hand4 = evaluateHand4(values);
		hand = hand4;
		basePoints = HAND_POINTS_4[hand4];
	}

	return {
		direction,
		index,
		coords,
		values,
		hand,
		basePoints,
		multiplier,
		score: basePoints * multiplier,
	};
}

/**
 * Evaluates all rows, columns, and 2 diagonals on the board.
 */
export function evaluateBoard(board: Board): BoardScore {
	const size = board.length;
	const lines: LineEvaluation[] = [];

	// Rows
	for (let r = 0; r < size; r++) {
		const coords: GridCoord[] = [];
		for (let c = 0; c < size; c++) {
			coords.push({ row: r, col: c });
		}
		lines.push(evaluateLine('row', r, coords, board));
	}

	// Columns
	for (let c = 0; c < size; c++) {
		const coords: GridCoord[] = [];
		for (let r = 0; r < size; r++) {
			coords.push({ row: r, col: c });
		}
		lines.push(evaluateLine('col', c, coords, board));
	}

	// Main Diagonal
	const mainDiagCoords: GridCoord[] = [];
	for (let i = 0; i < size; i++) {
		mainDiagCoords.push({ row: i, col: i });
	}
	lines.push(evaluateLine('main_diagonal', 0, mainDiagCoords, board));

	// Anti-Diagonal
	const antiDiagCoords: GridCoord[] = [];
	for (let i = 0; i < size; i++) {
		antiDiagCoords.push({ row: i, col: size - 1 - i });
	}
	lines.push(evaluateLine('anti_diagonal', 1, antiDiagCoords, board));

	let rowScore = 0;
	let colScore = 0;
	let diagonalScore = 0;

	for (const line of lines) {
		if (line.direction === 'row') rowScore += line.score;
		else if (line.direction === 'col') colScore += line.score;
		else diagonalScore += line.score;
	}

	const totalScore = rowScore + colScore + diagonalScore;
	const cleanSweep = lines.every((line) => line.score > 0);

	return {
		lines,
		totalScore,
		rowScore,
		colScore,
		diagonalScore,
		cleanSweep,
	};
}
