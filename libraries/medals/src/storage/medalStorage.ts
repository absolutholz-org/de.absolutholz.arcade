import { type GameStorage, createGameStorage } from '@arcade/lib-storage';
import type {
	BaseGameStats,
	BridgesDifficultyStats,
	GameCustomStatsMap,
	GameId,
	GameMedalState,
	MinesweeperDifficultyStats,
	SudokuDifficultyStats,
} from '../types/index.js';

export const MEDALS_STORAGE_KEY = 'medals';
export const CURRENT_SCHEMA_VERSION = 1;

export function createInitialBaseStats(): BaseGameStats {
	return {
		gamesPlayed: 0,
		gamesWon: 0,
		totalPlayTimeSeconds: 0,
		currentStreak: 0,
		bestStreak: 0,
		lastPlayedAt: 0,
	};
}

function createInitialSudokuStats(): GameCustomStatsMap['sudoku'] {
	const createDiff = (): SudokuDifficultyStats => ({
		gamesPlayed: 0,
		gamesWon: 0,
		bestTimeSeconds: null,
		currentStreak: 0,
		bestStreak: 0,
	});

	return {
		difficulties: {
			easy: createDiff(),
			medium: createDiff(),
			hard: createDiff(),
			veryHard: createDiff(),
			insane: createDiff(),
			inhuman: createDiff(),
			expert: createDiff(),
		},
		completedPresetIds: [],
		completedPresetsWithoutHints: [],
	};
}

function createInitialMinesweeperStats(): GameCustomStatsMap['minesweeper'] {
	const createDiff = (): MinesweeperDifficultyStats => ({
		gamesPlayed: 0,
		gamesWon: 0,
		bestTimeSeconds: null,
		currentStreak: 0,
		bestStreak: 0,
	});

	return {
		difficulties: {
			simple: createDiff(),
			medium: createDiff(),
			hard: createDiff(),
			expert: createDiff(),
			beginner: createDiff(),
			intermediate: createDiff(),
		},
		lifetimeSafeTilesCleared: 0,
		currentLossStreak: 0,
	};
}

function createInitialBridgesStats(): GameCustomStatsMap['bridges'] {
	const createDiff = (): BridgesDifficultyStats => ({
		gamesPlayed: 0,
		gamesWon: 0,
		bestTimeSeconds: null,
		currentStreak: 0,
		bestStreak: 0,
	});

	return {
		difficulties: {
			beginner: createDiff(),
			easy: createDiff(),
			medium: createDiff(),
			hard: createDiff(),
			expert: createDiff(),
		},
		completedPresetIds: [],
		currentMediumStreak: 0,
		currentHardStreak: 0,
		bestMediumStreak: 0,
		bestHardStreak: 0,
	};
}

export function createInitialCustomStats<G extends GameId>(gameId: G): GameCustomStatsMap[G] {
	switch (gameId) {
		case 'sudoku':
			return createInitialSudokuStats() as GameCustomStatsMap[G];
		case 'nonogram':
			return { puzzles: {} } as GameCustomStatsMap[G];
		case 'minesweeper':
			return createInitialMinesweeperStats() as GameCustomStatsMap[G];
		case 'queens':
			return { boards: {} } as GameCustomStatsMap[G];
		case 'tracks':
			return {
				grids: {},
				completedPresetIds: [],
				currentMediumStreak: 0,
				currentHardStreak: 0,
				bestMediumStreak: 0,
				bestHardStreak: 0,
			} as unknown as GameCustomStatsMap[G];
		case 'bridges':
			return createInitialBridgesStats() as GameCustomStatsMap[G];
		case 'tents':
			return {
				completedPresetIds: [],
				totalTentsPitched: 0,
				currentMediumStreak: 0,
				currentHardStreak: 0,
				bestMediumStreak: 0,
				bestHardStreak: 0,
			} as unknown as GameCustomStatsMap[G];
		case 'anagram':
			return { totalWordsFound: 0, expertWins: 0 } as GameCustomStatsMap[G];
		default:
			throw new Error(`createInitialCustomStats error: Unknown gameId "${String(gameId)}"`);
	}
}

export function createInitialMedalState<G extends GameId>(gameId: G): GameMedalState<G> {
	return {
		gameId,
		baseStats: createInitialBaseStats(),
		customStats: createInitialCustomStats(gameId),
		unlockedMedals: {},
		medalProgress: {},
		schemaVersion: CURRENT_SCHEMA_VERSION,
		updatedAt: 0,
	};
}

/**
 * Retrieves the atomic medal state document from local storage for a specific game.
 * Uses the namespaced key `arcade::[gameId]::medals`.
 */
export async function getGameMedalState<G extends GameId>(
	gameId: G,
	customStorage?: GameStorage,
): Promise<GameMedalState<G>> {
	const storage = customStorage ?? createGameStorage(gameId);
	const rawState = await storage.get<GameMedalState<G>>(MEDALS_STORAGE_KEY);

	if (!rawState) {
		return createInitialMedalState(gameId);
	}

	return {
		...createInitialMedalState(gameId),
		...rawState,
		baseStats: {
			...createInitialBaseStats(),
			...(rawState.baseStats ?? {}),
		},
		customStats: {
			...createInitialCustomStats(gameId),
			...(rawState.customStats ?? {}),
		},
		unlockedMedals: rawState.unlockedMedals ?? {},
		medalProgress: rawState.medalProgress ?? {},
	};
}

/**
 * Persists the atomic medal state document to local storage.
 */
export async function setGameMedalState<G extends GameId>(
	state: GameMedalState<G>,
	customStorage?: GameStorage,
): Promise<void> {
	const storage = customStorage ?? createGameStorage(state.gameId);
	await storage.set(MEDALS_STORAGE_KEY, state);
}
