import { createGameStorage } from '@arcade/lib-storage';
import { recordGameStats } from '@arcade/lib-storage/stats';
import { DEFAULT_TICTACTOE_SETTINGS, type TicTacToeSettings } from '../config/settings.ts';
import type { TicTacToeState } from './types.ts';

const storage = createGameStorage('tictactoe');

const ACTIVE_GAME_KEY = 'activeGame';
const SETTINGS_KEY = 'settings';

export async function loadActiveGame(): Promise<TicTacToeState | null> {
	try {
		return await storage.get<TicTacToeState>(ACTIVE_GAME_KEY);
	} catch {
		return null;
	}
}

export async function saveActiveGame(snapshot: TicTacToeState): Promise<void> {
	try {
		await storage.set(ACTIVE_GAME_KEY, snapshot);
	} catch (error) {
		console.error('Failed to save active Tic-Tac-Toe match:', error);
	}
}

export async function clearActiveGame(): Promise<void> {
	try {
		await storage.remove(ACTIVE_GAME_KEY);
	} catch (error) {
		console.error('Failed to clear active Tic-Tac-Toe match:', error);
	}
}

export async function loadSettings(): Promise<TicTacToeSettings> {
	try {
		const data = await storage.get<TicTacToeSettings>(SETTINGS_KEY);
		return { ...DEFAULT_TICTACTOE_SETTINGS, ...data };
	} catch {
		return DEFAULT_TICTACTOE_SETTINGS;
	}
}

export async function saveSettings(settings: TicTacToeSettings): Promise<void> {
	try {
		await storage.set(SETTINGS_KEY, settings);
	} catch (error) {
		console.error('Failed to save Tic-Tac-Toe settings:', error);
	}
}

export async function recordTicTacToeRoundResult({
	won,
	playTimeSeconds,
	moves,
}: {
	won: boolean;
	playTimeSeconds: number;
	moves: number;
}): Promise<void> {
	try {
		await recordGameStats({
			gameId: 'tictactoe',
			won,
			playTimeSeconds,
			moves,
			bucketKey: 'standard',
			customMetrics: {
				passAndPlayWins: won ? 1 : 0,
				draws: !won ? 1 : 0,
			},
		});
	} catch (error) {
		console.error('Failed to record Tic-Tac-Toe stats:', error);
	}
}
