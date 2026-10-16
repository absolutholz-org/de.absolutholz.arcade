import { createGameStorage } from '@arcade/lib-storage';
import { DEFAULT_SETTINGS, type GameSnapshot, type ProgressMap, type TracksSettings } from './types.ts';

const storage = createGameStorage('tracks');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

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

export async function recordPuzzleCompletion(
	puzzleId: string,
	elapsedSeconds: number,
	movesCount?: number,
): Promise<{ isNewBestTime: boolean; isNewBestMoves: boolean }> {
	const progress = await loadProgress();
	const existing = progress[puzzleId];
	const isNewBestTime = !existing?.bestTime || elapsedSeconds < existing.bestTime;
	const isNewBestMoves = movesCount !== undefined && (!existing?.bestMoves || movesCount < existing.bestMoves);

	progress[puzzleId] = {
		completed: true,
		bestTime: isNewBestTime ? elapsedSeconds : existing?.bestTime,
		bestMoves: movesCount !== undefined ? (isNewBestMoves ? movesCount : existing?.bestMoves) : existing?.bestMoves,
		lastPlayed: Date.now(),
	};

	await saveProgress(progress);
	return { isNewBestTime, isNewBestMoves };
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

export async function loadSettings(): Promise<TracksSettings> {
	try {
		const saved = await storage.get<TracksSettings>(SETTINGS_KEY);
		return { ...DEFAULT_SETTINGS, ...(saved || {}) };
	} catch {
		return DEFAULT_SETTINGS;
	}
}

export async function saveSettings(settings: TracksSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage errors
	}
}
