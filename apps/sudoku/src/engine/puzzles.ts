import puzzlesData from './puzzles.data.json' with { type: 'json' };
import type { Difficulty, SudokuGrid } from './types';

export interface EncodedSudokuPuzzle {
	id: string;
	difficulty: Difficulty;
	index: number;
	clues: string;
	solution: string;
}

export interface SudokuPuzzleDefinition {
	id: string;
	difficulty: Difficulty;
	index: number;
	clues: number[][];
	solution: number[][];
}

export function decodeBoardString(str: string): number[][] {
	const board: number[][] = [];
	for (let r = 0; r < 9; r++) {
		const row: number[] = [];
		for (let c = 0; c < 9; c++) {
			row.push(Number.parseInt(str[r * 9 + c], 10) || 0);
		}
		board.push(row);
	}
	return board;
}

export function createGridFromClues(clues: number[][]): SudokuGrid {
	return clues.map((row, r) =>
		row.map((val, c) => ({
			row: r,
			col: c,
			block: Math.floor(r / 3) * 3 + Math.floor(c / 3),
			value: val > 0 ? val : null,
			isClue: val > 0,
			notes: Array(9).fill(false),
		})),
	);
}

const ENCODED_PUZZLES = puzzlesData as EncodedSudokuPuzzle[];

export const SUDOKU_PUZZLES: SudokuPuzzleDefinition[] = ENCODED_PUZZLES.map((enc) => ({
	id: enc.id,
	difficulty: enc.difficulty,
	index: enc.index,
	clues: decodeBoardString(enc.clues),
	solution: decodeBoardString(enc.solution),
}));

export function getPuzzlesByDifficulty(difficulty: Difficulty): SudokuPuzzleDefinition[] {
	return SUDOKU_PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getPuzzleById(id: string): SudokuPuzzleDefinition | undefined {
	return SUDOKU_PUZZLES.find((p) => p.id === id);
}

export function getNextPuzzle(currentId: string): SudokuPuzzleDefinition | undefined {
	const idx = SUDOKU_PUZZLES.findIndex((p) => p.id === currentId);
	if (idx >= 0 && idx < SUDOKU_PUZZLES.length - 1) {
		return SUDOKU_PUZZLES[idx + 1];
	}
	return undefined;
}
