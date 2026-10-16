import { type EncodedPuzzle, decodePuzzle } from './puzzleCodec.ts';
import puzzlesData from './puzzles.data.json' with { type: 'json' };
import type { Difficulty, QueensPuzzle } from './types.ts';

export const QUEENS_PUZZLES: readonly QueensPuzzle[] = (puzzlesData as EncodedPuzzle[]).map(decodePuzzle);

export function getPuzzleById(id: string): QueensPuzzle | undefined {
	return QUEENS_PUZZLES.find((p) => p.id === id);
}

export function getPuzzlesByDifficulty(difficulty: Difficulty): QueensPuzzle[] {
	return QUEENS_PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getNextPuzzle(currentId: string): QueensPuzzle | undefined {
	const idx = QUEENS_PUZZLES.findIndex((p) => p.id === currentId);
	if (idx >= 0 && idx < QUEENS_PUZZLES.length - 1) {
		return QUEENS_PUZZLES[idx + 1];
	}
	return undefined;
}
