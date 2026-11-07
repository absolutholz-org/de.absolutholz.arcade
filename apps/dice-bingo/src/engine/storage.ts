import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { DEFAULT_DICE_BINGO_SETTINGS, type DiceBingoSettings } from '../config/settings.ts';
import type { DiceBingoSnapshot, DifficultyLevel } from './types.ts';

const storage = createGameStorage('dice-bingo');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

export interface DifficultyProgress {
	readonly completedCount: number;
	readonly bestScore?: number;
	readonly bestTime?: number;
	readonly lastPlayed?: number;
}

export type ProgressMap = Partial<Record<DifficultyLevel, DifficultyProgress>>;

export async function loadProgress(): Promise<ProgressMap> {
	try {
		const data = await storage.get<ProgressMap>(PROGRESS_KEY);
		return data || {};
	} catch {
		return {};
	}
}

export async function saveProgress(progress: ProgressMap): Promise<void> {
	try {
		await storage.set(PROGRESS_KEY, progress);
	} catch (error) {
		console.error('Failed to save Dice Bingo progress:', error);
	}
}

export async function loadActiveGame(): Promise<DiceBingoSnapshot | null> {
	try {
		return await storage.get<DiceBingoSnapshot>(ACTIVE_GAME_KEY);
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: DiceBingoSnapshot): Promise<void> {
	try {
		await storage.set(ACTIVE_GAME_KEY, snapshot);
	} catch (error) {
		console.error('Failed to save active Dice Bingo game:', error);
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch (error) {
		console.error('Failed to clear active Dice Bingo game:', error);
	}
}

export async function loadSettings(): Promise<DiceBingoSettings> {
	try {
		const data = await storage.get<DiceBingoSettings>(SETTINGS_KEY);
		return { ...DEFAULT_DICE_BINGO_SETTINGS, ...data };
	} catch {
		return DEFAULT_DICE_BINGO_SETTINGS;
	}
}

export async function saveSettings(settings: DiceBingoSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch (error) {
		console.error('Failed to save Dice Bingo settings:', error);
	}
}

export async function saveLastDifficulty(difficulty: DifficultyLevel): Promise<void> {
	await saveLastGameConfig('dice-bingo', { difficulty });
}

export async function loadLastDifficulty(): Promise<DifficultyLevel> {
	const config = await getLastGameConfig<{ difficulty?: DifficultyLevel }>('dice-bingo');
	return config?.difficulty ?? 'medium';
}

export async function recordDiceBingoRoundResult(
	difficulty: DifficultyLevel,
	score: number,
	playTimeSeconds: number,
): Promise<void> {
	// 1. Record stats in centralized telemetry
	await recordGameStats({
		gameId: 'dice-bingo',
		won: true,
		score,
		playTimeSeconds,
		bucketKey: difficulty,
	});

	// 2. Update local difficulty progress
	const progress = await loadProgress();
	const current = progress[difficulty] ?? { completedCount: 0 };
	const updated: DifficultyProgress = {
		completedCount: current.completedCount + 1,
		bestScore: current.bestScore !== undefined ? Math.max(current.bestScore, score) : score,
		bestTime: current.bestTime !== undefined ? Math.min(current.bestTime, playTimeSeconds) : playTimeSeconds,
		lastPlayed: Date.now(),
	};

	progress[difficulty] = updated;
	await saveProgress(progress);
}
