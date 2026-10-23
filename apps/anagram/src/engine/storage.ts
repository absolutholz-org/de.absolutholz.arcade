import { createGameStorage } from '@arcade/lib-storage';
import type { DifficultyLevel, GameSnapshot, LevelProgress, ProgressMap } from './types.ts';

const storage = createGameStorage('anagram');

const PROGRESS_KEY = 'levelProgress';
const ACTIVE_GAME_KEY = 'activeGame';

export async function loadProgress(): Promise<ProgressMap> {
	try {
		return (await storage.get<ProgressMap>(PROGRESS_KEY)) || {};
	} catch {
		return {};
	}
}

export async function recordRoundResult(
	difficulty: DifficultyLevel,
	result: { cleared: boolean; mastered: boolean; score: number; elapsedSeconds: number },
): Promise<{ isNewBestScore: boolean }> {
	const progress = await loadProgress();
	const existing: LevelProgress | undefined = progress[difficulty];
	const isNewBestScore = result.cleared && result.score > (existing?.bestScore ?? 0);

	progress[difficulty] = {
		completed: Boolean(existing?.completed) || result.cleared,
		mastered: Boolean(existing?.mastered) || result.mastered,
		bestScore: isNewBestScore ? result.score : existing?.bestScore,
		bestTimeSeconds:
			result.mastered && (!existing?.bestTimeSeconds || result.elapsedSeconds < existing.bestTimeSeconds)
				? result.elapsedSeconds
				: existing?.bestTimeSeconds,
	};

	try {
		await storage.set(PROGRESS_KEY, progress);
	} catch {
		// Ignore storage errors in restricted contexts
	}
	return { isNewBestScore };
}

export async function loadActiveGame(): Promise<GameSnapshot | null> {
	try {
		return (await storage.get<GameSnapshot>(ACTIVE_GAME_KEY)) || null;
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: GameSnapshot): Promise<void> {
	try {
		await storage.set(ACTIVE_GAME_KEY, snapshot);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}
