import { createGameStorage } from '@arcade/lib-storage';
import {
	DEFAULT_GAME_SETTINGS,
	type Difficulty,
	type GameSettings,
	type GameSnapshot,
	INITIAL_SUDOKU_STATS,
	type ProgressMap,
	type SudokuStats,
} from './types';

const storage = createGameStorage('sudoku');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';
const STATS_KEY = 'stats';
const LAST_CONFIG_KEY = 'lastConfig';

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
	} catch {
		// Ignore storage write errors
	}
}

export async function recordPuzzleCompletion(
	puzzleId: string,
	elapsedSeconds: number,
): Promise<{ isNewBestTime: boolean }> {
	const progress = await loadProgress();
	const existing = progress[puzzleId];
	const isNewBest = !existing?.bestTime || elapsedSeconds < existing.bestTime;

	progress[puzzleId] = {
		completed: true,
		bestTime: isNewBest ? elapsedSeconds : existing?.bestTime,
		lastPlayed: Date.now(),
	};

	await saveProgress(progress);
	return { isNewBestTime: isNewBest };
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

export async function loadStats(): Promise<SudokuStats> {
	try {
		const stats = await storage.get<SudokuStats>(STATS_KEY);
		return stats ? { ...INITIAL_SUDOKU_STATS, ...stats } : INITIAL_SUDOKU_STATS;
	} catch {
		return INITIAL_SUDOKU_STATS;
	}
}

export async function saveStats(stats: SudokuStats): Promise<void> {
	try {
		await storage.set(STATS_KEY, stats);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadSettings(): Promise<GameSettings> {
	try {
		const saved = await storage.get<GameSettings>(SETTINGS_KEY);
		return saved ? { ...DEFAULT_GAME_SETTINGS, ...saved } : DEFAULT_GAME_SETTINGS;
	} catch {
		return DEFAULT_GAME_SETTINGS;
	}
}

export async function saveSettings(settings: GameSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadLastConfig(): Promise<{ difficulty: Difficulty } | null> {
	try {
		return await storage.get<{ difficulty: Difficulty }>(LAST_CONFIG_KEY);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: { difficulty: Difficulty }): Promise<void> {
	try {
		await storage.set(LAST_CONFIG_KEY, config);
	} catch {
		// Ignore storage write errors
	}
}
