import { createGameStorage } from '@arcade/lib-storage';
import type { DifficultyLevel, GameSnapshot, ProgressMap } from './types.ts';

const storage = createGameStorage('watersort');

const PROGRESS_KEY = 'puzzleProgress';
const ACTIVE_GAME_KEY = 'activeGame';

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

export async function recordRoundResult(
	difficulty: DifficultyLevel,
	elapsedSeconds: number,
	moves: number,
	seed?: number,
): Promise<{ isNewBestTime: boolean; isNewBestMoves: boolean }> {
	const progress = await loadProgress();

	const updateEntry = (key: string) => {
		const existing = progress[key];
		const isNewBestTime = !existing?.bestTime || elapsedSeconds < existing.bestTime;
		const isNewBestMoves = !existing?.bestMoves || moves < existing.bestMoves;

		progress[key] = {
			completed: true,
			bestTime: isNewBestTime ? elapsedSeconds : existing?.bestTime,
			bestMoves: isNewBestMoves ? moves : existing?.bestMoves,
			lastPlayed: Date.now(),
		};

		return { isNewBestTime, isNewBestMoves };
	};

	const result = updateEntry(difficulty);
	if (seed !== undefined) {
		updateEntry(`${difficulty}-${seed}`);
	}

	await saveProgress(progress);
	return result;
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
