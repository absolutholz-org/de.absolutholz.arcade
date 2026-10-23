import type { DifficultyLevel } from '../../engine/types.js';

export interface WaterSortHeaderProps {
	difficulty: DifficultyLevel;
	seed: number;
	elapsedSeconds: number;
	moves: number;
	completedTubes: number;
	totalColorTubes: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onOpenSettings: () => void;
}
