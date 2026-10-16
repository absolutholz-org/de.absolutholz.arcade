import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_FILE = join(__dirname, '../src/engine/puzzles.data.json');

// Sudoku solver and generator logic
function cloneBoard(b) {
	return b.map((r) => [...r]);
}

function isValidPlacement(board, row, col, num) {
	for (let c = 0; c < 9; c++) {
		if (board[row][c] === num) return false;
	}
	for (let r = 0; r < 9; r++) {
		if (board[r][col] === num) return false;
	}
	const startR = Math.floor(row / 3) * 3;
	const startC = Math.floor(col / 3) * 3;
	for (let r = 0; r < 3; r++) {
		for (let c = 0; c < 3; c++) {
			if (board[startR + r][startC + c] === num) return false;
		}
	}
	return true;
}

function countSolutions(board, limit = 2) {
	let count = 0;
	function solve(r = 0, c = 0) {
		if (r === 9) {
			count++;
			return count >= limit;
		}
		const nextR = c === 8 ? r + 1 : r;
		const nextC = c === 8 ? 0 : c + 1;
		if (board[r][c] !== 0) {
			return solve(nextR, nextC);
		}
		for (let num = 1; num <= 9; num++) {
			if (isValidPlacement(board, r, c, num)) {
				board[r][c] = num;
				if (solve(nextR, nextC)) return true;
				board[r][c] = 0;
			}
		}
		return false;
	}
	solve(0, 0);
	return count;
}

function shuffle(array) {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

function generateSolvedBoard() {
	const board = Array.from({ length: 9 }, () => Array(9).fill(0));
	function fill() {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
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

function getSymmetricPairs() {
	const pairs = [];
	for (let r = 0; r < 5; r++) {
		const maxCol = r === 4 ? 5 : 9;
		for (let c = 0; c < maxCol; c++) {
			pairs.push([r, c, 8 - r, 8 - c]);
		}
	}
	return shuffle(pairs);
}

const TARGET_CLUE_COUNTS = {
	easy: 38,
	medium: 32,
	hard: 28,
	veryHard: 25,
	insane: 23,
	inhuman: 21,
};

function generateSudokuPuzzle(difficulty) {
	const solution = generateSolvedBoard();
	const board = cloneBoard(solution);
	const targetClues = TARGET_CLUE_COUNTS[difficulty];
	let currentClues = 81;
	const pairs = getSymmetricPairs();

	for (const [r1, c1, r2, c2] of pairs) {
		if (currentClues <= targetClues) break;
		const val1 = board[r1][c1];
		const val2 = board[r2][c2];
		if (val1 === 0) continue;

		board[r1][c1] = 0;
		if (r1 !== r2 || c1 !== c2) board[r2][c2] = 0;

		const copy = cloneBoard(board);
		const solutions = countSolutions(copy, 2);
		if (solutions === 1) {
			currentClues -= r1 === r2 && c1 === c2 ? 1 : 2;
		} else {
			board[r1][c1] = val1;
			if (r1 !== r2 || c1 !== c2) board[r2][c2] = val2;
		}
	}

	const cluesStr = board.flat().join('');
	const solStr = solution.flat().join('');
	return { clues: cluesStr, solution: solStr };
}

const DIFFICULTIES = ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'];
const PUZZLES_PER_TIER = 6;
const allPuzzles = [];

console.log('Generating Sudoku preset catalog...');
for (const diff of DIFFICULTIES) {
	console.log(`Generating ${PUZZLES_PER_TIER} puzzles for ${diff}...`);
	for (let i = 1; i <= PUZZLES_PER_TIER; i++) {
		const { clues, solution } = generateSudokuPuzzle(diff);
		allPuzzles.push({
			id: `${diff}-${i}`,
			difficulty: diff,
			index: i,
			clues,
			solution,
		});
	}
}

writeFileSync(OUTPUT_FILE, `${JSON.stringify(allPuzzles, null, '\t')}\n`, 'utf-8');
console.log(`Successfully generated ${allPuzzles.length} puzzles in ${OUTPUT_FILE}`);
