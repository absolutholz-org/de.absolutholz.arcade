import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { type ColorMapSettings, DEFAULT_COLOR_MAP_SETTINGS, type Difficulty, type GameSnapshot } from './types.ts';

const storage = createGameStorage('color-map');

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

export async function loadSettings(): Promise<ColorMapSettings> {
	try {
		const saved = await storage.get<ColorMapSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_COLOR_MAP_SETTINGS, ...saved } : DEFAULT_COLOR_MAP_SETTINGS;
	} catch {
		return DEFAULT_COLOR_MAP_SETTINGS;
	}
}

export async function saveSettings(settings: ColorMapSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await getLastGameConfig<{ difficulty: Difficulty }>('color-map', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await saveLastGameConfig('color-map', config, storage);
	} catch {
		// Ignore storage write errors
	}
}

export async function recordColorMapRoundStats(params: {
	difficulty: Difficulty;
	won: boolean;
	playTimeSeconds: number;
	movesCount: number;
	mistakesCount: number;
}): Promise<void> {
	try {
		await recordGameStats({
			gameId: 'color-map',
			won: params.won,
			bucketKey: params.difficulty,
			playTimeSeconds: params.playTimeSeconds,
			moves: params.movesCount,
			isFlawless: params.won && params.mistakesCount === 0,
			customMetrics: {
				mistakesCount: params.mistakesCount,
			},
		});
	} catch {
		// Ignore storage write errors
	}
}
