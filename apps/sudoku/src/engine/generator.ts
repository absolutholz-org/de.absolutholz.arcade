import { cloneBoard, countSolutions, isValidPlacement } from './solver';
import { type Difficulty, type SudokuGrid, TARGET_CLUE_COUNTS } from './types';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = result[i];
		result[i] = result[j];
		result[j] = temp;
	}
	return result;
}

/**
 * Generates a full, valid 9×9 Sudoku solution board using randomized backtracking.
 */
export function generateSolvedBoard(): number[][] {
	const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

	function fill(): boolean {
		for (let r = 0; r < 9; r += 1) {
			for (let c = 0; c < 9; c += 1) {
				if (board[r][c] === 0) {
					const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
					for (const num of digits) {
						if (isValidPlacement(board, r, c, num)) {
							board[r][c] = num;
							if (fill()) return true;
							board[r][c] = 0;
						}
					}
					return false;
				}
			}
		}
		return true;
	}

	fill();
	return board;
}

/**
 * Generates symmetric coordinate pairs for 180-degree rotational symmetry.
 */
function getSymmetricPairs(): [number, number, number, number][] {
	const pairs: [number, number, number, number][] = [];

	for (let r = 0; r < 5; r += 1) {
		const maxCol = r === 4 ? 5 : 9;
		for (let c = 0; c < maxCol; c += 1) {
			const oppR = 8 - r;
			const oppC = 8 - c;
			pairs.push([r, c, oppR, oppC]);
		}
	}

	return shuffle(pairs);
}

/**
 * Generates a Sudoku puzzle guaranteed to have a unique valid solution,
 * calibrated to the requested difficulty tier.
 */
export function generateSudoku(difficulty: Difficulty): {
	puzzle: SudokuGrid;
	solution: number[][];
} {
	const solution = generateSolvedBoard();
	const board = cloneBoard(solution);
	const targetClues = TARGET_CLUE_COUNTS[difficulty];

	let currentClues = 81;
	const pairs = getSymmetricPairs();

	for (const [r1, c1, r2, c2] of pairs) {
		if (currentClues <= targetClues) {
			break;
		}

		const val1 = board[r1][c1];
		const val2 = board[r2][c2];

		if (val1 === 0) continue;

		board[r1][c1] = 0;
		if (r1 !== r2 || c1 !== c2) {
			board[r2][c2] = 0;
		}

		// Verify uniqueness of the remaining board
		const solutions = countSolutions(board, 2);

		if (solutions === 1) {
			currentClues -= r1 === r2 && c1 === c2 ? 1 : 2;
		} else {
			// Restore if removal produced multiple solutions
			board[r1][c1] = val1;
			if (r1 !== r2 || c1 !== c2) {
				board[r2][c2] = val2;
			}
		}
	}

	// Transform into rich SudokuGrid structure
	const puzzle: SudokuGrid = board.map((row, r) =>
		row.map((val, c) => ({
			row: r,
			col: c,
			block: Math.floor(r / 3) * 3 + Math.floor(c / 3),
			value: val > 0 ? val : null,
			isClue: val > 0,
			notes: Array(9).fill(false),
		})),
	);

	return {
		puzzle,
		solution,
	};
}
