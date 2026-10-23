import type { Board, DifficultyLevel, Move } from '../types.ts';
import presetsData from './presets.data.json' with { type: 'json' };

export interface PresetPuzzleDefinition {
	readonly id: string;
	readonly difficulty: DifficultyLevel;
	readonly level: number;
	readonly board: Board;
	readonly parMoves: number;
	readonly solution: readonly Move[];
}

export type PresetCatalog = Record<DifficultyLevel, readonly PresetPuzzleDefinition[]>;

export const PRESET_CATALOG: PresetCatalog = presetsData as unknown as PresetCatalog;

/**
 * Returns the predefined preset puzzle for the given difficulty and level (1-10).
 * Defaults to level 1 if out of range.
 */
export function getPreset(difficulty: DifficultyLevel, level: number): PresetPuzzleDefinition {
	const list = PRESET_CATALOG[difficulty] ?? PRESET_CATALOG.easy;
	const safeIndex = Math.max(0, Math.min(list.length - 1, level - 1));
	return list[safeIndex];
}

/**
 * Finds a preset puzzle by composite ID (e.g. 'medium-6').
 */
export function getPresetById(id: string): PresetPuzzleDefinition | undefined {
	for (const list of Object.values(PRESET_CATALOG)) {
		const found = list.find((p) => p.id === id);
		if (found) return found;
	}
	return undefined;
}

/**
 * Returns all predefined presets for a given difficulty tier.
 */
export function getPresetsByDifficulty(difficulty: DifficultyLevel): readonly PresetPuzzleDefinition[] {
	return PRESET_CATALOG[difficulty] ?? PRESET_CATALOG.easy;
}
