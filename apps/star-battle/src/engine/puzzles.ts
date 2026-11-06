import { type EncodedPuzzle, decodePuzzle } from './puzzleCodec.ts';
import puzzlesData from './puzzles.data.json' with { type: 'json' };
import type { Difficulty, StarBattlePuzzle } from './types.ts';

export const STAR_BATTLE_PUZZLES: readonly StarBattlePuzzle[] = (puzzlesData as EncodedPuzzle[]).map(decodePuzzle);
export const QUEENS_PUZZLES = STAR_BATTLE_PUZZLES;

export function getPuzzleById(id: string): StarBattlePuzzle | undefined {
	return STAR_BATTLE_PUZZLES.find((p) => p.id === id);
}

export function getPuzzlesByDifficulty(difficulty: Difficulty): StarBattlePuzzle[] {
	return STAR_BATTLE_PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getNextPuzzle(currentId: string): StarBattlePuzzle | undefined {
	const idx = STAR_BATTLE_PUZZLES.findIndex((p) => p.id === currentId);
	if (idx >= 0 && idx < STAR_BATTLE_PUZZLES.length - 1) {
		return STAR_BATTLE_PUZZLES[idx + 1];
	}
	return undefined;
}
