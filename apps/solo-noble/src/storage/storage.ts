import { createGameStorage } from '@arcade/lib-storage';
import type { BoardLayoutId, CoordinateKey, GameStatus, GameVariant } from '../engine/types.js';

export interface BestRecord {
	minPegs: number;
	moves: number;
	won: boolean;
	timestamp: number;
}

export interface UserPreferences {
	layoutId: BoardLayoutId;
	variant: GameVariant;
}

export interface ActiveGameSnapshot {
	layoutId: BoardLayoutId;
	variant: GameVariant;
	board: Record<CoordinateKey, boolean>;
	elapsedSeconds: number;
	pegsRemaining: number;
	movesCount: number;
	status: GameStatus;
	timestamp: number;
}

const storage = createGameStorage('solo-noble');

const PREFERENCES_KEY = 'preferences';
const RECORDS_KEY = 'records';
const ACTIVE_GAME_KEY = 'active_game';

export async function loadPreferences(): Promise<UserPreferences> {
	const saved = await storage.get<UserPreferences>(PREFERENCES_KEY);
	return saved ?? { layoutId: 'english', variant: 'classic-central' };
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
	await storage.set(PREFERENCES_KEY, prefs);
}

export async function loadRecords(): Promise<Record<string, BestRecord>> {
	const saved = await storage.get<Record<string, BestRecord>>(RECORDS_KEY);
	return saved ?? {};
}

export async function updateRecord(
	layoutId: BoardLayoutId,
	variant: GameVariant,
	pegsRemaining: number,
	moves: number,
	won: boolean,
): Promise<void> {
	const records = await loadRecords();
	const key = `${layoutId}_${variant}`;
	const existing = records[key];

	if (
		!existing ||
		pegsRemaining < existing.minPegs ||
		(pegsRemaining === existing.minPegs && moves < existing.moves)
	) {
		records[key] = {
			minPegs: pegsRemaining,
			moves,
			won,
			timestamp: Date.now(),
		};
		await storage.set(RECORDS_KEY, records);
	}
}

export async function loadActiveGame(): Promise<ActiveGameSnapshot | null> {
	return storage.get<ActiveGameSnapshot>(ACTIVE_GAME_KEY);
}

export async function saveActiveGame(snapshot: ActiveGameSnapshot): Promise<void> {
	await storage.set(ACTIVE_GAME_KEY, snapshot);
}

export async function clearActiveGame(): Promise<void> {
	await storage.remove(ACTIVE_GAME_KEY);
}
