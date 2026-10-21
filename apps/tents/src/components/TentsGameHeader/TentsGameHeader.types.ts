import type { DifficultyLevel } from '../../engine/types.ts';

export interface TentsGameHeaderProps {
	difficulty: DifficultyLevel;
	puzzleId: string;
	placedTents: number;
	totalTrees: number;
	satisfiedLines: number;
	totalLines: number;
	elapsedSeconds: number;
	mistakesCount: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onOpenSettings: () => void;
}
