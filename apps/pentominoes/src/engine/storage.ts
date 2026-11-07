import { createGameStorage, getLastGameConfig, recordGameStats, saveLastGameConfig } from '@arcade/lib-storage';
import { DEFAULT_PENTOMINOES_SETTINGS, type PentominoesSettings } from '../config/settings.ts';
import type { Difficulty, PentominoesLastConfig, PentominoesProgress, PentominoesSaveState } from './types.ts';

const storage = createGameStorage('pentominoes');

const ACTIVE_GAME_KEY = 'activeGame';
const PROGRESS_KEY = 'progress';
const SETTINGS_KEY = 'settings';

const DEFAULT_PROGRESS: PentominoesProgress = {
	completedLevelIds: [],
	bestTimeByLevel: {},
	winsByDifficulty: {
		easy: 0,
		medium: 0,
		hard: 0,
		expert: 0,
	},
};

export async function loadActiveGame(): Promise<PentominoesSaveState | null> {
	try {
		return await storage.get<PentominoesSaveState>(ACTIVE_GAME_KEY);
	} catch {
		return null;
	}
}

export async function saveActiveGame(state: PentominoesSaveState): Promise<void> {
	try {
		await storage.set(ACTIVE_GAME_KEY, state);
	} catch {
		// Ignore storage failures in private browsing contexts
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch {
		// Ignore storage failures
	}
}

export async function loadProgress(): Promise<PentominoesProgress> {
	try {
		const saved = await storage.get<PentominoesProgress>(PROGRESS_KEY);
		if (!saved) {
			return DEFAULT_PROGRESS;
		}
		return {
			completedLevelIds: saved.completedLevelIds ?? [],
			bestTimeByLevel: saved.bestTimeByLevel ?? {},
			winsByDifficulty: {
				...DEFAULT_PROGRESS.winsByDifficulty,
				...(saved.winsByDifficulty ?? {}),
			},
		};
	} catch {
		return DEFAULT_PROGRESS;
	}
}

export async function recordCompletedLevel(
	levelId: string,
	difficulty: Difficulty,
	elapsedSeconds: number,
	movesCount = 0,
): Promise<PentominoesProgress> {
	const current = await loadProgress();
	const completedSet = new Set(current.completedLevelIds);
	completedSet.add(levelId);

	const prevBest = current.bestTimeByLevel[levelId];
	const nextBest = prevBest === undefined ? elapsedSeconds : Math.min(prevBest, elapsedSeconds);

	const updated: PentominoesProgress = {
		completedLevelIds: [...completedSet],
		bestTimeByLevel: {
			...current.bestTimeByLevel,
			[levelId]: nextBest,
		},
		winsByDifficulty: {
			...current.winsByDifficulty,
			[difficulty]: (current.winsByDifficulty[difficulty] ?? 0) + 1,
		},
	};

	try {
		await storage.set(PROGRESS_KEY, updated);
	} catch {
		// Ignore storage errors
	}

	void recordGameStats({
		gameId: 'pentominoes',
		won: true,
		bucketKey: difficulty,
		playTimeSeconds: elapsedSeconds,
		moves: movesCount,
	});

	return updated;
}

export async function loadSettings(): Promise<PentominoesSettings> {
	try {
		const saved = await storage.get<PentominoesSettings>(SETTINGS_KEY);
		return {
			...DEFAULT_PENTOMINOES_SETTINGS,
			...(saved ?? {}),
		};
	} catch {
		return DEFAULT_PENTOMINOES_SETTINGS;
	}
}

export async function saveSettings(settings: PentominoesSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch {
		// Ignore storage errors
	}
}

export async function loadLastConfig(): Promise<PentominoesLastConfig | null> {
	try {
		return await getLastGameConfig<PentominoesLastConfig>('pentominoes');
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: PentominoesLastConfig): Promise<void> {
	try {
		await saveLastGameConfig('pentominoes', config);
	} catch {
		// Ignore storage errors
	}
}
