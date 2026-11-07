import type { BoardScore, DiceBingoSnapshot, DifficultyLevel, LineEvaluation } from './types.ts';

export interface DiceBingoMedalCheckContext {
	readonly snapshot: DiceBingoSnapshot;
	readonly boardScore: BoardScore;
}

export const TIER_SCORE_THRESHOLDS: Record<
	DifficultyLevel,
	{
		lucky_guess: number;
		calculated_chaos: number;
		probability_defier: number;
		dice_whisperer: number;
	}
> = {
	easy: {
		lucky_guess: 40,
		calculated_chaos: 60,
		probability_defier: 80,
		dice_whisperer: 100,
	},
	medium: {
		lucky_guess: 100,
		calculated_chaos: 140,
		probability_defier: 180,
		dice_whisperer: 220,
	},
	hard: {
		lucky_guess: 90,
		calculated_chaos: 125,
		probability_defier: 160,
		dice_whisperer: 190,
	},
};

/**
 * Checks whether 5 of a kind was scored on any line.
 */
export function checkYahtzeeWrongGame(lines: LineEvaluation[]): boolean {
	return lines.some((l) => l.hand === 'five_of_a_kind');
}

/**
 * Checks whether 3 or more 2s or 12s were placed in a single 0-point row or column.
 */
export function checkTheLandfill(lines: LineEvaluation[]): boolean {
	for (const line of lines) {
		if (line.direction !== 'row' && line.direction !== 'col') continue;
		// Allow at most 1 point (the unavoidable pair from duplicate 2s/12s)
		if (line.score > 1) continue;
		const extremeCount = line.values.filter((v) => v === 2 || v === 12).length;
		if (extremeCount >= 3) {
			return true;
		}
	}
	return false;
}

/**
 * Checks whether 7 was placed at center position (2, 2) on a 5x5 board.
 */
export function checkDeadCenter(snapshot: DiceBingoSnapshot): boolean {
	if (snapshot.difficulty === 'easy') return false;
	const centerCell = snapshot.board[2]?.[2];
	return centerCell?.value === 7;
}

/**
 * Checks whether combined diagonal score exceeds combined row score.
 */
export function checkDiagonallyGifted(boardScore: BoardScore): boolean {
	return boardScore.diagonalScore > boardScore.rowScore;
}

/**
 * Checks whether any completed straight contains both 2 and 12.
 */
export function checkAgainstAllOdds(lines: LineEvaluation[]): boolean {
	return lines.some(
		(l) =>
			(l.hand === 'straight_no_seven' || l.hand === 'straight_with_seven') &&
			l.values.includes(2) &&
			l.values.includes(12),
	);
}

/**
 * Checks whether game completed without scoring any straights or full houses.
 */
export function checkTheHoarder(lines: LineEvaluation[]): boolean {
	const excludedHands = new Set(['straight_no_seven', 'straight_with_seven', 'straight_four', 'full_house']);
	return !lines.some((l) => excludedHands.has(l.hand));
}

/**
 * Checks whether a high-value hand (Straight, Full House, 4/5 Kind) was completed on the final turn.
 */
export function checkClutchFinish(snapshot: DiceBingoSnapshot, lines: LineEvaluation[]): boolean {
	if (snapshot.currentTurn !== snapshot.maxTurns) return false;
	const lastMove = snapshot.moveHistory[snapshot.moveHistory.length - 1];
	if (!lastMove) return false;

	const highValueHands = new Set([
		'five_of_a_kind',
		'straight_no_seven',
		'straight_with_seven',
		'straight_four',
		'full_house',
		'four_of_a_kind',
	]);

	// Find lines intersecting the last move coordinate
	const intersectingLines = lines.filter((l) =>
		l.coords.some((c) => c.row === lastMove.coord.row && c.col === lastMove.coord.col),
	);

	return intersectingLines.some((l) => highValueHands.has(l.hand));
}

/**
 * Evaluates all feat medals achieved in the round.
 */
export function evaluateRoundFeats(context: DiceBingoMedalCheckContext): string[] {
	const feats: string[] = [];
	const { snapshot, boardScore } = context;

	if (checkYahtzeeWrongGame(boardScore.lines)) feats.push('yahtzee_wrong_game');
	if (checkTheLandfill(boardScore.lines)) feats.push('the_landfill');
	if (checkDeadCenter(snapshot)) feats.push('dead_center');
	if (checkDiagonallyGifted(boardScore)) feats.push('diagonally_gifted');
	if (checkAgainstAllOdds(boardScore.lines)) feats.push('against_all_odds');
	if (checkTheHoarder(boardScore.lines)) feats.push('the_hoarder');
	if (checkClutchFinish(snapshot, boardScore.lines)) feats.push('clutch_finish');
	if (boardScore.cleanSweep) feats.push('clean_sweep');

	return feats;
}
