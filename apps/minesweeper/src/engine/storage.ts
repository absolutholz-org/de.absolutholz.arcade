import { createGameStorage } from '@arcade/lib-storage';
import {
	type BoardSizeId,
	DEFAULT_MINESWEEPER_SETTINGS,
	type DifficultyId,
	type GameSnapshot,
	type HighScoreEntry,
	type MinesweeperSettings,
} from './types';

const storage = createGameStorage('minesweeper');

export async function loadActiveGame(): Promise<GameSnapshot | null> {
	try {
		return await storage.get<GameSnapshot>('activeGame');
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: GameSnapshot | null): Promise<void> {
	try {
		if (snapshot === null) {
			await storage.remove('activeGame');
		} else {
			await storage.set('activeGame', snapshot);
		}
	} catch {
		// Ignore storage write errors (e.g. storage quota)
	}
}

export async function loadSettings(): Promise<MinesweeperSettings> {
	try {
		const saved = await storage.get<MinesweeperSettings>('settings');
		return saved ? { ...DEFAULT_MINESWEEPER_SETTINGS, ...saved } : DEFAULT_MINESWEEPER_SETTINGS;
	} catch {
		return DEFAULT_MINESWEEPER_SETTINGS;
	}
}

export async function saveSettings(settings: MinesweeperSettings): Promise<void> {
	try {
		await storage.set('settings', settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadHighScores(): Promise<HighScoreEntry[]> {
	try {
		const scores = await storage.get<HighScoreEntry[]>('highScores');
		return scores ?? [];
	} catch {
		return [];
	}
}

export async function recordHighScore(entry: HighScoreEntry): Promise<{
	position: number;
	updatedScores: HighScoreEntry[];
}> {
	try {
		const allScores = await loadHighScores();
		// Group scores for the same board size and difficulty
		const matching = allScores
			.filter((s) => s.size === entry.size && s.difficulty === entry.difficulty)
			.sort((a, b) => a.seconds - b.seconds);

		// Find insertion position
		let position = matching.findIndex((s) => entry.seconds <= s.seconds);
		if (position === -1) {
			position = matching.length;
		}

		// Keep up to 10 best times per size & difficulty
		const otherScores = allScores.filter((s) => !(s.size === entry.size && s.difficulty === entry.difficulty));
		const newMatching = [...matching.slice(0, position), entry, ...matching.slice(position)].slice(0, 10);

		const updatedScores = [...otherScores, ...newMatching];
		await storage.set('highScores', updatedScores);

		return { position, updatedScores };
	} catch {
		return { position: -1, updatedScores: [] };
	}
}

export async function loadLastConfig(): Promise<{
	size: BoardSizeId;
	difficulty: DifficultyId;
} | null> {
	try {
		return await storage.get<{ size: BoardSizeId; difficulty: DifficultyId }>('lastConfig');
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: {
	size: BoardSizeId;
	difficulty: DifficultyId;
}): Promise<void> {
	try {
		await storage.set('lastConfig', config);
	} catch {
		// Ignore storage write errors
	}
}
