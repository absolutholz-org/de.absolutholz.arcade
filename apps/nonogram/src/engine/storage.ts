import { createGameStorage } from '@arcade/lib-storage';
import {
	DEFAULT_NONOGRAM_SETTINGS,
	type DifficultyId,
	type GameSnapshot,
	type NonogramSettings,
	type PuzzleRecord,
} from './types';

const storage = createGameStorage('nonogram');

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

export async function loadSettings(): Promise<NonogramSettings> {
	try {
		const saved = await storage.get<NonogramSettings>('settings');
		return saved ? { ...DEFAULT_NONOGRAM_SETTINGS, ...saved } : DEFAULT_NONOGRAM_SETTINGS;
	} catch {
		return DEFAULT_NONOGRAM_SETTINGS;
	}
}

export async function saveSettings(settings: NonogramSettings): Promise<void> {
	try {
		await storage.set('settings', settings);
	} catch {
		// Ignore storage write errors
	}
}

export async function loadSolvedPuzzles(): Promise<Record<string, PuzzleRecord>> {
	try {
		const records = await storage.get<Record<string, PuzzleRecord>>('solvedPuzzles');
		return records ?? {};
	} catch {
		return {};
	}
}

export async function recordPuzzleCompletion(
	puzzleId: string,
	seconds: number,
	moves: number,
): Promise<{ isNewBestTime: boolean; record: PuzzleRecord }> {
	try {
		const allRecords = await loadSolvedPuzzles();
		const existing = allRecords[puzzleId];

		let isNewBestTime = false;
		let bestTime = seconds;
		let bestMoves = moves;

		if (existing) {
			isNewBestTime = seconds < existing.bestTime;
			bestTime = Math.min(existing.bestTime, seconds);
			bestMoves = Math.min(existing.bestMoves, moves);
		} else {
			isNewBestTime = true;
		}

		const updatedRecord: PuzzleRecord = {
			puzzleId,
			solved: true,
			bestTime,
			bestMoves,
			timestamp: new Date().toISOString(),
		};

		allRecords[puzzleId] = updatedRecord;
		await storage.set('solvedPuzzles', allRecords);

		return { isNewBestTime, record: updatedRecord };
	} catch {
		return {
			isNewBestTime: false,
			record: {
				puzzleId,
				solved: true,
				bestTime: seconds,
				bestMoves: moves,
				timestamp: new Date().toISOString(),
			},
		};
	}
}

export async function loadLastConfig(): Promise<{
	difficulty: DifficultyId;
	puzzleId: string;
} | null> {
	try {
		return await storage.get<{ difficulty: DifficultyId; puzzleId: string }>('lastConfig');
	} catch {
		return null;
	}
}

export async function saveLastConfig(config: {
	difficulty: DifficultyId;
	puzzleId: string;
}): Promise<void> {
	try {
		await storage.set('lastConfig', config);
	} catch {
		// Ignore storage write errors
	}
}
