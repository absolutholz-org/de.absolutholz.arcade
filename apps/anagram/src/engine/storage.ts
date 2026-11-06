import { createGameStorage, getLastGameConfig, saveLastGameConfig } from '@arcade/lib-storage';
import type {
	AnagramSettings,
	DifficultyLevel,
	GameMode,
	GameSnapshot,
	LanguageCode,
	LevelProgress,
	ProgressMap,
} from './types.ts';

const storage = createGameStorage('anagram');

export interface AnagramGameConfig {
	vocab: LanguageCode;
	mode: GameMode;
	difficulty: DifficultyLevel;
}

const PROGRESS_KEY = 'levelProgress';
const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

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

export async function loadSettings(): Promise<AnagramSettings> {
	try {
		return (await storage.get<AnagramSettings>(SETTINGS_KEY)) || {};
	} catch {
		return {};
	}
}

export async function saveSettings(settings: AnagramSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}

export async function loadLastConfig(): Promise<AnagramGameConfig | null> {
	try {
		return await getLastGameConfig<AnagramGameConfig>('anagram', storage);
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: AnagramGameConfig): Promise<void> {
	try {
		await saveLastGameConfig('anagram', config, storage);
	} catch {
		// Ignore storage errors in restricted contexts
	}
}
