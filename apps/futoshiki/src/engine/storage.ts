import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { DEFAULT_FUTOSHIKI_SETTINGS, type Difficulty, type FutoshikiSettings, type GameSnapshot } from './types.ts';

const storage = createGameStorage('futoshiki');

const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

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
		// Ignore storage write errors
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch {
		// Ignore storage errors
	}
}

export async function loadSettings(): Promise<FutoshikiSettings> {
	try {
		const saved = await storage.get<FutoshikiSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_FUTOSHIKI_SETTINGS, ...saved } : DEFAULT_FUTOSHIKI_SETTINGS;
	} catch {
		return DEFAULT_FUTOSHIKI_SETTINGS;
	}
}

export async function saveSettings(settings: FutoshikiSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await getLastGameConfig<{ difficulty: Difficulty }>('futoshiki', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await saveLastGameConfig('futoshiki', config, storage);
	} catch {
		// Ignore storage write errors
	}
}

export async function recordFutoshikiRoundStats(params: {
	difficulty: Difficulty;
	won: boolean;
	playTimeSeconds: number;
	movesCount: number;
	hintsUsed: number;
	mistakesCount: number;
}): Promise<void> {
	try {
		await recordGameStats({
			gameId: 'futoshiki',
			won: params.won,
			bucketKey: params.difficulty,
			playTimeSeconds: params.playTimeSeconds,
			moves: params.movesCount,
			isFlawless: params.won && params.hintsUsed === 0 && params.mistakesCount === 0,
			customMetrics: {
				hintsUsed: params.hintsUsed,
				mistakesCount: params.mistakesCount,
			},
		});
	} catch {
		// Ignore storage write errors
	}
}
