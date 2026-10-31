import { createGameStorage } from '@arcade/lib-storage';
import {
	type ActiveGameSnapshot,
	DEFAULT_UNTANGLE_SETTINGS,
	type DifficultyLevel,
	type UntangleSettings,
} from './types.ts';

const storage = createGameStorage('untangle');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

export interface DifficultyProgress {
	readonly completedCount: number;
	readonly bestTime?: number;
	readonly bestMoves?: number;
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

async function saveProgress(progress: ProgressMap): Promise<void> {
	try {
		await storage.set(PROGRESS_KEY, progress);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}

export async function recordPuzzleCompletion(
	difficulty: DifficultyLevel,
	elapsedSeconds: number,
	movesCount: number,
): Promise<{ isNewBestTime: boolean; isNewBestMoves: boolean }> {
	const progress = await loadProgress();
	const existing = progress[difficulty];
	const isNewBestTime = existing?.bestTime === undefined || elapsedSeconds < existing.bestTime;
	const isNewBestMoves = existing?.bestMoves === undefined || movesCount < existing.bestMoves;

	progress[difficulty] = {
		completedCount: (existing?.completedCount ?? 0) + 1,
		bestTime: isNewBestTime ? elapsedSeconds : existing?.bestTime,
		bestMoves: isNewBestMoves ? movesCount : existing?.bestMoves,
		lastPlayed: Date.now(),
	};

	await saveProgress(progress);
	return { isNewBestTime, isNewBestMoves };
}

export async function resetProgress(): Promise<void> {
	try {
		await storage.remove(PROGRESS_KEY);
		await storage.remove(ACTIVE_GAME_KEY);
	} catch {
		// Ignore storage errors
	}
}

export async function loadActiveGame(): Promise<ActiveGameSnapshot | null> {
	try {
		return await storage.get<ActiveGameSnapshot>(ACTIVE_GAME_KEY);
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: ActiveGameSnapshot): Promise<void> {
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

export async function loadSettings(): Promise<UntangleSettings> {
	try {
		const saved = await storage.get<UntangleSettings>(SETTINGS_KEY);
		return { ...DEFAULT_UNTANGLE_SETTINGS, ...(saved || {}) };
	} catch {
		return DEFAULT_UNTANGLE_SETTINGS;
	}
}

export async function saveSettings(settings: UntangleSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage errors
	}
}
