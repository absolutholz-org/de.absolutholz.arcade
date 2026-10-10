import type { Difficulty } from '../../engine/types';

export interface QueensGameHeaderProps {
	difficulty: Difficulty;
	puzzleId: string;
	tokenCount: number;
	totalTokens: number;
	elapsedSeconds: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onOpenSettings: () => void;
}
