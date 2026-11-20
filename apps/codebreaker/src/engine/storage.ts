import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { type CodebreakerSettings, DEFAULT_CODEBREAKER_SETTINGS, type Difficulty, type GameSnapshot } from './types.ts';

const storage = createGameStorage('codebreaker');

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

export async function loadSettings(): Promise<CodebreakerSettings> {
	try {
		const saved = await storage.get<CodebreakerSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_CODEBREAKER_SETTINGS, ...saved } : DEFAULT_CODEBREAKER_SETTINGS;
	} catch {
		return DEFAULT_CODEBREAKER_SETTINGS;
	}
}

export async function saveSettings(settings: CodebreakerSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await getLastGameConfig<{ difficulty: Difficulty }>('codebreaker', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await saveLastGameConfig('codebreaker', config, storage);
	} catch {
		// Ignore storage write errors
	}
}

export async function recordCodebreakerRoundStats(params: {
	difficulty: Difficulty;
	won: boolean;
	playTimeSeconds: number;
	guessesUsed: number;
	hintsUsed: number;
}): Promise<void> {
	try {
		await recordGameStats({
			gameId: 'codebreaker',
			won: params.won,
			bucketKey: params.difficulty,
			playTimeSeconds: params.playTimeSeconds,
			moves: params.guessesUsed,
			isFlawless: params.won && params.hintsUsed === 0 && params.guessesUsed <= 4,
			customMetrics: {
				hintsUsed: params.hintsUsed,
				guessesUsed: params.guessesUsed,
			},
		});
	} catch {
		// Ignore storage write errors
	}
}
