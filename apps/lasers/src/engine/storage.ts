import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { DEFAULT_LASERS_SETTINGS, type Difficulty, type GameSnapshot, type LasersSettings } from './types.ts';

const storage = createGameStorage('lasers');

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

export async function loadSettings(): Promise<LasersSettings> {
	try {
		const saved = await storage.get<LasersSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_LASERS_SETTINGS, ...saved } : DEFAULT_LASERS_SETTINGS;
	} catch {
		return DEFAULT_LASERS_SETTINGS;
	}
}

export async function saveSettings(settings: LasersSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await getLastGameConfig<{ difficulty: Difficulty }>('lasers', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await saveLastGameConfig('lasers', config, storage);
	} catch {
		// Ignore storage write errors
	}
}

export async function recordLasersRoundStats(params: {
	difficulty: Difficulty;
	playTimeSeconds: number;
	movesCount: number;
	parMoves: number;
	hintsUsed: number;
	undosUsed: number;
}): Promise<void> {
	const isParOrBetter = params.movesCount <= params.parMoves && params.hintsUsed === 0;
	try {
		await recordGameStats({
			gameId: 'lasers',
			won: true,
			bucketKey: params.difficulty,
			playTimeSeconds: params.playTimeSeconds,
			moves: params.movesCount,
			isFlawless: isParOrBetter,
			customMetrics: {
				parMoves: params.parMoves,
				hintsUsed: params.hintsUsed,
				undosUsed: params.undosUsed,
				parWins: isParOrBetter ? 1 : 0,
			},
		});
	} catch {
		// Ignore storage write errors
	}
}
