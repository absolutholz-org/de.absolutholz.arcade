import type { Difficulty } from '../../engine/types';

export interface SudokuGameHeaderProps {
	difficulty: Difficulty;
	elapsedSeconds: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onOpenSettings: () => void;
}
