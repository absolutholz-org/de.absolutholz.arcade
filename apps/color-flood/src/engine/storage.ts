import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { type ColorFloodSettings, DEFAULT_COLOR_FLOOD_SETTINGS } from '../config/settings.ts';
import type { Difficulty, GameSnapshot } from './types.ts';

const storage = createGameStorage('color-flood');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';
const LIFETIME_STATS_KEY = 'lifetimeStats';

export interface DifficultyProgress {
	readonly completedCount: number;
	readonly bestMoves?: number;
	readonly bestTime?: number;
	readonly lastPlayed?: number;
}

export interface ColorFloodLifetimeStats {
	readonly tierWins: Partial<Record<Difficulty, boolean>>;
	readonly lifetimeCellsFlooded: number;
	readonly maxSingleMoveDelta: number;
}

export type ProgressMap = Partial<Record<Difficulty, DifficultyProgress>>;

export async function loadLifetimeStats(): Promise<ColorFloodLifetimeStats> {
	try {
		const data = await storage.get<ColorFloodLifetimeStats>(LIFETIME_STATS_KEY);
		return {
			tierWins: data?.tierWins ?? {},
			lifetimeCellsFlooded: data?.lifetimeCellsFlooded ?? 0,
			maxSingleMoveDelta: data?.maxSingleMoveDelta ?? 0,
		};
	} catch {
		return {
			tierWins: {},
			lifetimeCellsFlooded: 0,
			maxSingleMoveDelta: 0,
		};
	}
}

export async function loadProgress(): Promise<ProgressMap> {
	try {
		const data = await storage.get<ProgressMap>(PROGRESS_KEY);
		return data || {};
	} catch {
		return {};
	}
}

async function saveProgress(progress: ProgressMap): Promise<void> {
	try {
		await storage.set(PROGRESS_KEY, progress);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}

export async function recordRoundCompletion(
	difficulty: Difficulty,
	movesCount: number,
	elapsedSeconds: number,
	won: boolean,
	cellsFlooded = 0,
	singleMoveDelta = 0,
): Promise<{ isNewBestMoves: boolean; lifetimeStats: ColorFloodLifetimeStats }> {
	const progress = await loadProgress();
	const existing = progress[difficulty];
	const isNewBestMoves = won && (existing?.bestMoves === undefined || movesCount < existing.bestMoves);

	if (won) {
		progress[difficulty] = {
			completedCount: (existing?.completedCount ?? 0) + 1,
			bestMoves: isNewBestMoves ? movesCount : existing?.bestMoves,
			bestTime:
				existing?.bestTime === undefined || elapsedSeconds < existing.bestTime
					? elapsedSeconds
					: existing.bestTime,
			lastPlayed: Date.now(),
		};
		await saveProgress(progress);
	}

	const lifetime = await loadLifetimeStats();
	const updatedTierWins = { ...lifetime.tierWins };
	if (won) {
		updatedTierWins[difficulty] = true;
	}
	const updatedLifetime: ColorFloodLifetimeStats = {
		tierWins: updatedTierWins,
		lifetimeCellsFlooded: lifetime.lifetimeCellsFlooded + Math.max(0, cellsFlooded),
		maxSingleMoveDelta: Math.max(lifetime.maxSingleMoveDelta, singleMoveDelta),
	};

	try {
		await storage.set(LIFETIME_STATS_KEY, updatedLifetime);
	} catch {
		// Ignore storage errors in restricted contexts
	}

	void recordGameStats({
		gameId: 'color-flood',
		won,
		bucketKey: difficulty,
		playTimeSeconds: elapsedSeconds,
		moves: movesCount,
	});

	return { isNewBestMoves, lifetimeStats: updatedLifetime };
}

export async function loadActiveGame(): Promise<GameSnapshot | null> {
	try {
		return await storage.get<GameSnapshot>(ACTIVE_GAME_KEY);
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: GameSnapshot): Promise<void> {
	try {
		await storage.set(ACTIVE_GAME_KEY, snapshot);
	} catch {
		// Ignore storage errors
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch {
		// Ignore storage errors
	}
}

export async function loadSettings(): Promise<ColorFloodSettings> {
	try {
		const saved = await storage.get<ColorFloodSettings>(SETTINGS_KEY);
		return { ...DEFAULT_COLOR_FLOOD_SETTINGS, ...(saved || {}) };
	} catch {
		return DEFAULT_COLOR_FLOOD_SETTINGS;
	}
}

export async function saveSettings(settings: ColorFloodSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage errors
	}
}

export interface ColorFloodGameConfig {
	readonly difficulty: Difficulty;
	readonly size: number;
	readonly colorCount: number;
}

export async function loadLastConfig(): Promise<ColorFloodGameConfig | null> {
	try {
		return await getLastGameConfig<ColorFloodGameConfig>('color-flood', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: ColorFloodGameConfig): Promise<void> {
	try {
		await saveLastGameConfig('color-flood', config, storage);
	} catch {
		// Ignore storage errors
	}
}
