import type { DifficultyLevel } from '../../engine/types.js';

export interface HashiGameHeaderProps {
	difficulty: DifficultyLevel;
	puzzleId?: string;
	satisfiedCount: number;
	totalIslands: number;
	elapsedSeconds: number;
	isPaused: boolean;
	gameMode: 'standard' | 'zen';
	onTogglePause: () => void;
	onOpenSettings: () => void;
	onBackToLobby?: () => void;
}
