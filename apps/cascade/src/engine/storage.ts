import {
	createGameStorage,
	getGameStats,
	getLastGameConfig,
	recordGameStats,
	saveLastGameConfig,
} from '@arcade/lib-storage';
import { type CascadeSettings, DEFAULT_CASCADE_SETTINGS, type Difficulty, type GameSnapshot } from './types.ts';

const storage = createGameStorage('cascade');

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

export async function loadSettings(): Promise<CascadeSettings> {
	try {
		const saved = await storage.get<CascadeSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_CASCADE_SETTINGS, ...saved } : DEFAULT_CASCADE_SETTINGS;
	} catch {
		return DEFAULT_CASCADE_SETTINGS;
	}
}

export async function saveSettings(settings: CascadeSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await getLastGameConfig<{ difficulty: Difficulty }>('cascade', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await saveLastGameConfig('cascade', config, storage);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadHighScore(difficulty: Difficulty): Promise<number> {
	try {
		const stats = await getGameStats('cascade');
		const bucketScore = stats?.byBucket[difficulty]?.bestScore ?? 0;
		return bucketScore ?? 0;
	} catch {
		return 0;
	}
}

export async function recordCascadeRoundStats(params: {
	difficulty: Difficulty;
	score: number;
	isPerfectClear: boolean;
	playTimeSeconds: number;
	movesCount: number;
	remainingTiles: number;
	maxClusterCleared: number;
}): Promise<void> {
	try {
		await recordGameStats({
			gameId: 'cascade',
			won: true,
			bucketKey: params.difficulty,
			playTimeSeconds: params.playTimeSeconds,
			moves: params.movesCount,
			score: params.score,
			isFlawless: params.isPerfectClear,
			customMetrics: {
				remainingTiles: params.remainingTiles,
				maxClusterCleared: params.maxClusterCleared,
				perfectClear: params.isPerfectClear ? 1 : 0,
			},
		});
	} catch {
		// Ignore storage write errors
	}
}
