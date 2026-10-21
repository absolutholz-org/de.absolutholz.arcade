import type { DifficultyLevel, PuzzleDefinition } from '../types.ts';

/**
 * Compact, diff-friendly tuple representation of a preset puzzle:
 * - `trees`: array of `[row, col]` pairs
 * - `rowClues`: array of required tent counts per row
 * - `colClues`: array of required tent counts per col
 * - `solution`: array of `[row, col]` pairs
 */
export interface CompactPreset {
	id: string;
	difficulty: DifficultyLevel;
	size: number;
	trees: [number, number][];
	rowClues: number[];
	colClues: number[];
	solution: [number, number][];
}

export const COMPACT_PRESETS: readonly CompactPreset[] = [
	{
		id: 'easy-1',
		difficulty: 'easy',
		size: 6,
		trees: [
			[1, 2],
			[3, 2],
			[4, 2],
			[4, 5],
			[5, 4],
		],
		rowClues: [1, 0, 1, 0, 1, 2],
		colClues: [0, 1, 2, 1, 0, 1],
		solution: [
			[0, 2],
			[2, 2],
			[4, 1],
			[5, 3],
			[5, 5],
		],
	},
	{
		id: 'easy-2',
		difficulty: 'easy',
		size: 6,
		trees: [
			[0, 0],
			[2, 2],
			[3, 2],
			[4, 2],
			[5, 5],
		],
		rowClues: [0, 1, 1, 1, 1, 1],
		colClues: [1, 1, 1, 1, 0, 1],
		solution: [
			[1, 0],
			[2, 3],
			[3, 1],
			[4, 5],
			[5, 2],
		],
	},
	{
		id: 'medium-1',
		difficulty: 'medium',
		size: 8,
		trees: [
			[0, 0],
			[1, 2],
			[1, 7],
			[2, 5],
			[3, 7],
			[4, 3],
			[4, 6],
			[7, 1],
		],
		rowClues: [0, 1, 3, 0, 2, 1, 0, 1],
		colClues: [2, 0, 1, 1, 1, 1, 0, 2],
		solution: [
			[1, 0],
			[2, 2],
			[2, 4],
			[2, 7],
			[4, 5],
			[4, 7],
			[5, 3],
			[7, 0],
		],
	},
	{
		id: 'medium-2',
		difficulty: 'medium',
		size: 8,
		trees: [
			[0, 5],
			[2, 2],
			[3, 2],
			[3, 6],
			[5, 1],
			[5, 5],
			[6, 0],
			[7, 3],
		],
		rowClues: [1, 1, 0, 2, 0, 1, 2, 1],
		colClues: [2, 0, 1, 2, 1, 2, 0, 0],
		solution: [
			[0, 4],
			[1, 2],
			[3, 3],
			[3, 5],
			[5, 0],
			[6, 3],
			[6, 5],
			[7, 0],
		],
	},
	{
		id: 'hard-1',
		difficulty: 'hard',
		size: 10,
		trees: [
			[0, 2],
			[0, 3],
			[2, 1],
			[2, 7],
			[3, 2],
			[3, 5],
			[4, 1],
			[5, 5],
			[5, 9],
			[6, 3],
			[8, 5],
			[9, 9],
		],
		rowClues: [2, 1, 1, 0, 3, 0, 3, 0, 2, 0],
		colClues: [2, 1, 2, 0, 1, 2, 1, 1, 0, 2],
		solution: [
			[0, 1],
			[0, 4],
			[1, 7],
			[2, 0],
			[4, 0],
			[4, 2],
			[4, 5],
			[6, 2],
			[6, 5],
			[6, 9],
			[8, 6],
			[8, 9],
		],
	},
	{
		id: 'hard-2',
		difficulty: 'hard',
		size: 10,
		trees: [
			[0, 0],
			[1, 6],
			[1, 8],
			[2, 7],
			[4, 0],
			[5, 5],
			[6, 5],
			[7, 0],
			[7, 1],
			[9, 3],
			[9, 6],
			[9, 9],
		],
		rowClues: [1, 2, 0, 1, 1, 1, 1, 2, 1, 2],
		colClues: [2, 1, 1, 0, 2, 1, 1, 2, 0, 2],
		solution: [
			[0, 6],
			[1, 0],
			[1, 9],
			[3, 7],
			[4, 1],
			[5, 4],
			[6, 0],
			[7, 2],
			[7, 5],
			[8, 9],
			[9, 4],
			[9, 7],
		],
	},
	{
		id: 'expert-1',
		difficulty: 'expert',
		size: 12,
		trees: [
			[0, 0],
			[0, 11],
			[1, 1],
			[1, 7],
			[2, 4],
			[2, 7],
			[3, 6],
			[3, 11],
			[4, 9],
			[5, 1],
			[6, 11],
			[9, 2],
			[9, 3],
			[9, 4],
			[9, 10],
			[10, 4],
			[10, 7],
			[10, 9],
		],
		rowClues: [1, 4, 0, 3, 1, 1, 1, 0, 1, 2, 2, 2],
		colClues: [2, 1, 1, 1, 2, 2, 1, 2, 0, 2, 2, 2],
		solution: [
			[0, 10],
			[1, 0],
			[1, 2],
			[1, 4],
			[1, 6],
			[3, 5],
			[3, 7],
			[3, 9],
			[4, 11],
			[5, 0],
			[6, 10],
			[8, 4],
			[9, 1],
			[9, 11],
			[10, 3],
			[10, 5],
			[11, 7],
			[11, 9],
		],
	},
	{
		id: 'expert-2',
		difficulty: 'expert',
		size: 12,
		trees: [
			[0, 6],
			[1, 7],
			[2, 1],
			[2, 2],
			[3, 1],
			[3, 7],
			[4, 6],
			[4, 10],
			[5, 1],
			[5, 5],
			[6, 8],
			[6, 9],
			[7, 0],
			[8, 4],
			[8, 5],
			[8, 8],
			[11, 3],
			[11, 10],
		],
		rowClues: [2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1],
		colClues: [3, 1, 0, 2, 2, 2, 0, 3, 2, 0, 1, 2],
		solution: [
			[0, 5],
			[0, 7],
			[1, 1],
			[2, 3],
			[2, 7],
			[3, 0],
			[4, 7],
			[4, 11],
			[5, 0],
			[5, 4],
			[6, 10],
			[7, 4],
			[7, 8],
			[8, 0],
			[9, 5],
			[9, 8],
			[10, 3],
			[11, 11],
		],
	},
];

/**
 * Decodes a CompactPreset into a full PuzzleDefinition.
 */
export function decodePreset(preset: CompactPreset): PuzzleDefinition {
	return {
		id: preset.id,
		difficulty: preset.difficulty,
		size: preset.size,
		trees: preset.trees.map(([row, col]) => ({ row, col })),
		rowClues: [...preset.rowClues],
		colClues: [...preset.colClues],
		solution: preset.solution.map(([row, col]) => ({ row, col })),
	};
}

export const PRESET_PUZZLES: readonly PuzzleDefinition[] = COMPACT_PRESETS.map(decodePreset);

export function getPresetById(id: string): PuzzleDefinition | undefined {
	return PRESET_PUZZLES.find((p) => p.id === id);
}

export function getPresetsByDifficulty(difficulty: DifficultyLevel): PuzzleDefinition[] {
	return PRESET_PUZZLES.filter((p) => p.difficulty === difficulty);
}

export function getNextPreset(currentId: string): PuzzleDefinition | undefined {
	const idx = PRESET_PUZZLES.findIndex((p) => p.id === currentId);
	if (idx >= 0 && idx < PRESET_PUZZLES.length - 1) {
		return PRESET_PUZZLES[idx + 1];
	}
	return undefined;
}
