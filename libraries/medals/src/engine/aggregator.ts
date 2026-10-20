import type {
	BaseGameStats,
	BridgesCustomStats,
	BridgesDifficulty,
	GameCustomStatsMap,
	GameId,
	GameMedalState,
	GameResultPayload,
	MedalProgress,
	MedalUnlock,
	MinesweeperCustomStats,
	MinesweeperDifficulty,
	NonogramCustomStats,
	QueensCustomStats,
	SudokuCustomStats,
	SudokuDifficulty,
	TracksCustomStats,
} from '../types/index.js';

export function updateBaseStats(
	current: BaseGameStats,
	won: boolean,
	playTimeSeconds: number,
	now: number,
): BaseGameStats {
	const safeTime = Math.max(0, Math.floor(playTimeSeconds));
	const currentStreak = won ? current.currentStreak + 1 : 0;
	const bestStreak = Math.max(current.bestStreak, currentStreak);

	return {
		gamesPlayed: current.gamesPlayed + 1,
		gamesWon: current.gamesWon + (won ? 1 : 0),
		totalPlayTimeSeconds: current.totalPlayTimeSeconds + safeTime,
		currentStreak,
		bestStreak,
		lastPlayedAt: now,
	};
}

export function updateCustomStats<G extends GameId>(
	gameId: G,
	current: GameCustomStatsMap[G],
	result: GameResultPayload<G>,
): { updatedCustom: GameCustomStatsMap[G]; isNewBestTime: boolean } {
	let isNewBestTime = false;
	const safeTime = Math.max(0, Math.floor(result.playTimeSeconds));

	switch (gameId) {
		case 'sudoku': {
			const stats = { ...(current as SudokuCustomStats) };
			const diffKey = result.levelKey as SudokuDifficulty | undefined;
			if (diffKey && diffKey in stats.difficulties) {
				const prev = stats.difficulties[diffKey];
				const prevBest = prev.bestTimeSeconds;
				const isWon = result.won;
				const achievedNewBest = isWon && (prevBest === null || safeTime < prevBest);

				if (achievedNewBest) {
					isNewBestTime = true;
				}

				const currentStreak = isWon ? prev.currentStreak + 1 : 0;
				stats.difficulties = {
					...stats.difficulties,
					[diffKey]: {
						gamesPlayed: prev.gamesPlayed + 1,
						gamesWon: prev.gamesWon + (isWon ? 1 : 0),
						bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
						currentStreak,
						bestStreak: Math.max(prev.bestStreak, currentStreak),
					},
				};
			}

			const presetId = (result.roundContext?.presetId ??
				result.roundContext?.puzzleId ??
				(typeof result.levelKey === 'string' &&
				(result.levelKey.startsWith('easy-') ||
					result.levelKey.startsWith('medium-') ||
					result.levelKey.startsWith('hard-') ||
					result.levelKey.startsWith('veryHard-') ||
					result.levelKey.startsWith('insane-') ||
					result.levelKey.startsWith('inhuman-'))
					? result.levelKey
					: undefined)) as string | undefined;

			if (result.won && presetId) {
				const completedSet = new Set(stats.completedPresetIds ?? []);
				completedSet.add(presetId);
				stats.completedPresetIds = Array.from(completedSet);

				const hintsUsed =
					typeof result.roundContext?.hintsUsed === 'number' ? result.roundContext.hintsUsed : 0;
				if (hintsUsed === 0) {
					const withoutHintsSet = new Set(stats.completedPresetsWithoutHints ?? []);
					withoutHintsSet.add(presetId);
					stats.completedPresetsWithoutHints = Array.from(withoutHintsSet);
				}
			}

			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		case 'minesweeper': {
			const stats = { ...(current as MinesweeperCustomStats) };
			const diffKey = result.levelKey as MinesweeperDifficulty | undefined;
			if (diffKey && diffKey in stats.difficulties) {
				const prev = stats.difficulties[diffKey];
				const prevBest = prev.bestTimeSeconds;
				const isWon = result.won;
				const achievedNewBest = isWon && (prevBest === null || safeTime < prevBest);

				if (achievedNewBest) {
					isNewBestTime = true;
				}

				const currentStreak = isWon ? prev.currentStreak + 1 : 0;
				stats.difficulties = {
					...stats.difficulties,
					[diffKey]: {
						gamesPlayed: prev.gamesPlayed + 1,
						gamesWon: prev.gamesWon + (isWon ? 1 : 0),
						bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
						currentStreak,
						bestStreak: Math.max(prev.bestStreak, currentStreak),
					},
				};
			}

			const safeTilesCleared =
				typeof result.roundContext?.safeTilesCleared === 'number' ? result.roundContext.safeTilesCleared : 0;
			stats.lifetimeSafeTilesCleared = (stats.lifetimeSafeTilesCleared ?? 0) + safeTilesCleared;
			stats.currentLossStreak = result.won ? 0 : (stats.currentLossStreak ?? 0) + 1;

			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		case 'nonogram': {
			const stats = {
				...(current as NonogramCustomStats),
				puzzles: { ...(current as NonogramCustomStats).puzzles },
			};
			const puzzleId = (result.roundContext?.completedPuzzleId as string | undefined) ?? result.levelKey;
			const difficulty = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const size = (result.roundContext?.size as string | undefined) ?? result.sizeKey;

			if (result.won) {
				const isMediumPlus =
					difficulty === 'medium' || difficulty === 'hard' || size === '10x10' || size === '15x15';
				const isHard = difficulty === 'hard' || size === '15x15';

				const nextMedStreak = isMediumPlus ? (stats.currentMediumStreak ?? 0) + 1 : 0;
				const nextHardStreak = isHard ? (stats.currentHardStreak ?? 0) + 1 : 0;

				stats.currentMediumStreak = nextMedStreak;
				stats.bestMediumStreak = Math.max(stats.bestMediumStreak ?? 0, nextMedStreak);
				stats.currentHardStreak = nextHardStreak;
				stats.bestHardStreak = Math.max(stats.bestHardStreak ?? 0, nextHardStreak);

				if (puzzleId) {
					const prev = stats.puzzles[puzzleId];
					const prevBest = prev?.bestTimeSeconds ?? null;
					const achievedNewBest = prevBest === null || safeTime < prevBest;

					if (achievedNewBest) {
						isNewBestTime = true;
					}

					const withoutErrors =
						result.roundContext?.errorsCount === 0 || result.roundContext?.mistakesCount === 0;
					stats.puzzles[puzzleId] = {
						completed: true,
						bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
						completedWithoutErrors: Boolean(prev?.completedWithoutErrors || withoutErrors),
						difficulty,
						size,
					};

					const isEasy = difficulty === 'easy' || size === '5x5' || puzzleId.startsWith('easy-');
					const isMedium =
						difficulty === 'medium' ||
						size === '10x10' ||
						puzzleId.startsWith('medium-') ||
						puzzleId.startsWith('med-');
					const isHardLevel = difficulty === 'hard' || size === '15x15' || puzzleId.startsWith('hard-');

					if (isEasy) {
						const easySet = new Set(stats.completedEasyPuzzles ?? []);
						easySet.add(puzzleId);
						stats.completedEasyPuzzles = Array.from(easySet);
					} else if (isMedium) {
						const medSet = new Set(stats.completedMediumPuzzles ?? []);
						medSet.add(puzzleId);
						stats.completedMediumPuzzles = Array.from(medSet);
					} else if (isHardLevel) {
						const hardSet = new Set(stats.completedHardPuzzles ?? []);
						hardSet.add(puzzleId);
						stats.completedHardPuzzles = Array.from(hardSet);
					}
				}
			} else {
				stats.currentMediumStreak = 0;
				stats.currentHardStreak = 0;
			}
			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		case 'queens': {
			const stats = { ...(current as QueensCustomStats), boards: { ...(current as QueensCustomStats).boards } };
			const boardId = result.levelKey;
			if (boardId && result.won) {
				const prev = stats.boards[boardId];
				const prevBest = prev?.bestTimeSeconds ?? null;
				const achievedNewBest = prevBest === null || safeTime < prevBest;

				if (achievedNewBest) {
					isNewBestTime = true;
				}

				stats.boards[boardId] = {
					completed: true,
					bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
				};
			}
			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		case 'tracks': {
			const stats = { ...(current as TracksCustomStats), grids: { ...(current as TracksCustomStats).grids } };
			const gridId = result.levelKey;
			if (gridId && result.won) {
				const prev = stats.grids[gridId];
				const prevBest = prev?.bestTimeSeconds ?? null;
				const achievedNewBest = prevBest === null || safeTime < prevBest;

				if (achievedNewBest) {
					isNewBestTime = true;
				}

				stats.grids[gridId] = {
					completed: true,
					bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
				};
			}
			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		case 'bridges': {
			const stats = { ...(current as BridgesCustomStats) };
			const diffKey = result.levelKey as BridgesDifficulty | undefined;
			if (diffKey && diffKey in stats.difficulties) {
				const prev = stats.difficulties[diffKey];
				const prevBest = prev.bestTimeSeconds;
				const isWon = result.won;
				const achievedNewBest = isWon && (prevBest === null || safeTime < prevBest);

				if (achievedNewBest) {
					isNewBestTime = true;
				}

				const currentStreak = isWon ? prev.currentStreak + 1 : 0;
				stats.difficulties = {
					...stats.difficulties,
					[diffKey]: {
						gamesPlayed: prev.gamesPlayed + 1,
						gamesWon: prev.gamesWon + (isWon ? 1 : 0),
						bestTimeSeconds: achievedNewBest ? safeTime : prevBest,
						currentStreak,
						bestStreak: Math.max(prev.bestStreak, currentStreak),
					},
				};
			}

			if (result.won) {
				const isMediumPlus =
					diffKey === 'medium' ||
					diffKey === 'hard' ||
					diffKey === 'expert' ||
					result.sizeKey === '10x10' ||
					result.sizeKey === '14x14' ||
					result.sizeKey === '18x18';
				const isHardPlus =
					diffKey === 'hard' ||
					diffKey === 'expert' ||
					result.sizeKey === '14x14' ||
					result.sizeKey === '18x18';

				const nextMedStreak = isMediumPlus ? (stats.currentMediumStreak ?? 0) + 1 : 0;
				const nextHardStreak = isHardPlus ? (stats.currentHardStreak ?? 0) + 1 : 0;

				stats.currentMediumStreak = nextMedStreak;
				stats.bestMediumStreak = Math.max(stats.bestMediumStreak ?? 0, nextMedStreak);
				stats.currentHardStreak = nextHardStreak;
				stats.bestHardStreak = Math.max(stats.bestHardStreak ?? 0, nextHardStreak);

				const presetId = (result.roundContext?.completedPresetId ??
					result.roundContext?.presetId ??
					result.roundContext?.puzzleId) as string | undefined;

				if (presetId) {
					const completedSet = new Set(stats.completedPresetIds ?? []);
					completedSet.add(presetId);
					stats.completedPresetIds = Array.from(completedSet);
				}
			} else {
				stats.currentMediumStreak = 0;
				stats.currentHardStreak = 0;
			}

			return { updatedCustom: stats as GameCustomStatsMap[G], isNewBestTime };
		}

		default:
			return { updatedCustom: current, isNewBestTime: false };
	}
}

/**
 * Field-level merge for multi-device sync conflict resolution (ADR 0004).
 * Combines medals via union, selects Math.min for best times, and preserves max progression.
 */
export function mergeGameMedalState<G extends GameId>(
	local: GameMedalState<G>,
	remote: GameMedalState<G>,
): GameMedalState<G> {
	const mergedBase: BaseGameStats = {
		gamesPlayed: Math.max(local.baseStats.gamesPlayed, remote.baseStats.gamesPlayed),
		gamesWon: Math.max(local.baseStats.gamesWon, remote.baseStats.gamesWon),
		totalPlayTimeSeconds: Math.max(local.baseStats.totalPlayTimeSeconds, remote.baseStats.totalPlayTimeSeconds),
		bestStreak: Math.max(local.baseStats.bestStreak, remote.baseStats.bestStreak),
		currentStreak:
			local.updatedAt >= remote.updatedAt ? local.baseStats.currentStreak : remote.baseStats.currentStreak,
		lastPlayedAt: Math.max(local.baseStats.lastPlayedAt, remote.baseStats.lastPlayedAt),
	};

	// Merge unlocked medals: union of both sets, taking the earliest unlock timestamp
	const mergedMedals: Record<string, MedalUnlock> = { ...remote.unlockedMedals };
	for (const [id, localUnlock] of Object.entries(local.unlockedMedals)) {
		if (!mergedMedals[id]) {
			mergedMedals[id] = localUnlock;
		} else {
			mergedMedals[id] = {
				...localUnlock,
				unlockedAt: Math.min(localUnlock.unlockedAt, mergedMedals[id].unlockedAt),
			};
		}
	}

	// Merge medal progress: take highest progress recorded
	const mergedProgress: Record<string, MedalProgress> = { ...remote.medalProgress };
	for (const [id, localProg] of Object.entries(local.medalProgress)) {
		if (!mergedProgress[id]) {
			mergedProgress[id] = localProg;
		} else {
			mergedProgress[id] = {
				current: Math.max(localProg.current, mergedProgress[id].current),
				target: Math.max(localProg.target, mergedProgress[id].target),
			};
		}
	}

	// Merge customStats per game
	let mergedCustom = { ...local.customStats };

	if (local.gameId === 'sudoku') {
		interface DifficultyRecord {
			readonly gamesPlayed: number;
			readonly gamesWon: number;
			readonly bestTimeSeconds: number | null;
			readonly currentStreak: number;
			readonly bestStreak: number;
		}

		const localCustom = local.customStats as SudokuCustomStats;
		const remoteCustom = remote.customStats as SudokuCustomStats;
		const localDiffs = localCustom.difficulties as unknown as Record<string, DifficultyRecord>;
		const remoteDiffs = remoteCustom.difficulties as unknown as Record<string, DifficultyRecord>;
		const diffs: Record<string, DifficultyRecord> = {};

		for (const key of Object.keys(localDiffs)) {
			const l = localDiffs[key];
			const r = remoteDiffs[key];
			if (!r) {
				diffs[key] = l;
				continue;
			}
			const bestTimeSeconds =
				l.bestTimeSeconds !== null && r.bestTimeSeconds !== null
					? Math.min(l.bestTimeSeconds, r.bestTimeSeconds)
					: (l.bestTimeSeconds ?? r.bestTimeSeconds);

			diffs[key] = {
				gamesPlayed: Math.max(l.gamesPlayed, r.gamesPlayed),
				gamesWon: Math.max(l.gamesWon, r.gamesWon),
				bestTimeSeconds,
				bestStreak: Math.max(l.bestStreak, r.bestStreak),
				currentStreak: local.updatedAt >= remote.updatedAt ? l.currentStreak : r.currentStreak,
			};
		}

		const mergedPresetIds = Array.from(
			new Set([...(localCustom.completedPresetIds ?? []), ...(remoteCustom.completedPresetIds ?? [])]),
		);
		const mergedPresetsWithoutHints = Array.from(
			new Set([
				...(localCustom.completedPresetsWithoutHints ?? []),
				...(remoteCustom.completedPresetsWithoutHints ?? []),
			]),
		);

		mergedCustom = {
			difficulties: diffs,
			completedPresetIds: mergedPresetIds,
			completedPresetsWithoutHints: mergedPresetsWithoutHints,
		} as unknown as GameCustomStatsMap[G];
	} else if (local.gameId === 'minesweeper') {
		interface DifficultyRecord {
			readonly gamesPlayed: number;
			readonly gamesWon: number;
			readonly bestTimeSeconds: number | null;
			readonly currentStreak: number;
			readonly bestStreak: number;
		}

		const localDiffs = (local.customStats as MinesweeperCustomStats).difficulties as unknown as Record<
			string,
			DifficultyRecord
		>;
		const remoteDiffs = (remote.customStats as MinesweeperCustomStats).difficulties as unknown as Record<
			string,
			DifficultyRecord
		>;
		const diffs: Record<string, DifficultyRecord> = {};

		for (const key of Object.keys(localDiffs)) {
			const l = localDiffs[key];
			const r = remoteDiffs[key];
			if (!r) {
				diffs[key] = l;
				continue;
			}
			const bestTimeSeconds =
				l.bestTimeSeconds !== null && r.bestTimeSeconds !== null
					? Math.min(l.bestTimeSeconds, r.bestTimeSeconds)
					: (l.bestTimeSeconds ?? r.bestTimeSeconds);

			diffs[key] = {
				gamesPlayed: Math.max(l.gamesPlayed, r.gamesPlayed),
				gamesWon: Math.max(l.gamesWon, r.gamesWon),
				bestTimeSeconds,
				bestStreak: Math.max(l.bestStreak, r.bestStreak),
				currentStreak: local.updatedAt >= remote.updatedAt ? l.currentStreak : r.currentStreak,
			};
		}
		mergedCustom = {
			difficulties: diffs,
			lifetimeSafeTilesCleared: Math.max(
				(local.customStats as MinesweeperCustomStats).lifetimeSafeTilesCleared ?? 0,
				(remote.customStats as MinesweeperCustomStats).lifetimeSafeTilesCleared ?? 0,
			),
			currentLossStreak:
				local.updatedAt >= remote.updatedAt
					? ((local.customStats as MinesweeperCustomStats).currentLossStreak ?? 0)
					: ((remote.customStats as MinesweeperCustomStats).currentLossStreak ?? 0),
		} as unknown as GameCustomStatsMap[G];
	} else if (local.gameId === 'nonogram') {
		const localPuzzles = (local.customStats as NonogramCustomStats).puzzles;
		const remotePuzzles = (remote.customStats as NonogramCustomStats).puzzles;
		const allPuzzleIds = new Set([...Object.keys(localPuzzles), ...Object.keys(remotePuzzles)]);
		const mergedPuzzles: NonogramCustomStats['puzzles'] = {};

		for (const id of allPuzzleIds) {
			const l = localPuzzles[id];
			const r = remotePuzzles[id];
			if (!r) {
				mergedPuzzles[id] = l;
			} else if (!l) {
				mergedPuzzles[id] = r;
			} else {
				const bestTimeSeconds =
					l.bestTimeSeconds !== null && r.bestTimeSeconds !== null
						? Math.min(l.bestTimeSeconds, r.bestTimeSeconds)
						: (l.bestTimeSeconds ?? r.bestTimeSeconds);

				mergedPuzzles[id] = {
					completed: l.completed || r.completed,
					bestTimeSeconds,
					completedWithoutErrors: l.completedWithoutErrors || r.completedWithoutErrors,
				};
			}
		}
		mergedCustom = { puzzles: mergedPuzzles } as unknown as GameCustomStatsMap[G];
	} else if (local.gameId === 'queens' || local.gameId === 'tracks') {
		const localBoards = (local.customStats as QueensCustomStats).boards;
		const remoteBoards = (remote.customStats as QueensCustomStats).boards;
		const allIds = new Set([...Object.keys(localBoards), ...Object.keys(remoteBoards)]);
		const mergedBoards: QueensCustomStats['boards'] = {};

		for (const id of allIds) {
			const l = localBoards[id];
			const r = remoteBoards[id];
			if (!r) {
				mergedBoards[id] = l;
			} else if (!l) {
				mergedBoards[id] = r;
			} else {
				const bestTimeSeconds =
					l.bestTimeSeconds !== null && r.bestTimeSeconds !== null
						? Math.min(l.bestTimeSeconds, r.bestTimeSeconds)
						: (l.bestTimeSeconds ?? r.bestTimeSeconds);

				mergedBoards[id] = {
					completed: l.completed || r.completed,
					bestTimeSeconds,
				};
			}
		}
		mergedCustom = (local.gameId === 'queens'
			? { boards: mergedBoards }
			: { grids: mergedBoards }) as unknown as GameCustomStatsMap[G];
	} else if (local.gameId === 'bridges') {
		interface DifficultyRecord {
			readonly gamesPlayed: number;
			readonly gamesWon: number;
			readonly bestTimeSeconds: number | null;
			readonly currentStreak: number;
			readonly bestStreak: number;
		}

		const localCustom = local.customStats as BridgesCustomStats;
		const remoteCustom = remote.customStats as BridgesCustomStats;
		const localDiffs = localCustom.difficulties as unknown as Record<string, DifficultyRecord>;
		const remoteDiffs = remoteCustom.difficulties as unknown as Record<string, DifficultyRecord>;
		const diffs: Record<string, DifficultyRecord> = {};

		for (const key of Object.keys(localDiffs)) {
			const l = localDiffs[key];
			const r = remoteDiffs[key];
			if (!r) {
				diffs[key] = l;
				continue;
			}
			const bestTimeSeconds =
				l.bestTimeSeconds !== null && r.bestTimeSeconds !== null
					? Math.min(l.bestTimeSeconds, r.bestTimeSeconds)
					: (l.bestTimeSeconds ?? r.bestTimeSeconds);

			diffs[key] = {
				gamesPlayed: Math.max(l.gamesPlayed, r.gamesPlayed),
				gamesWon: Math.max(l.gamesWon, r.gamesWon),
				bestTimeSeconds,
				bestStreak: Math.max(l.bestStreak, r.bestStreak),
				currentStreak: local.updatedAt >= remote.updatedAt ? l.currentStreak : r.currentStreak,
			};
		}

		const mergedPresetIds = Array.from(
			new Set([...(localCustom.completedPresetIds ?? []), ...(remoteCustom.completedPresetIds ?? [])]),
		);

		mergedCustom = {
			difficulties: diffs,
			completedPresetIds: mergedPresetIds,
			bestMediumStreak: Math.max(localCustom.bestMediumStreak ?? 0, remoteCustom.bestMediumStreak ?? 0),
			currentMediumStreak:
				local.updatedAt >= remote.updatedAt
					? (localCustom.currentMediumStreak ?? 0)
					: (remoteCustom.currentMediumStreak ?? 0),
			bestHardStreak: Math.max(localCustom.bestHardStreak ?? 0, remoteCustom.bestHardStreak ?? 0),
			currentHardStreak:
				local.updatedAt >= remote.updatedAt
					? (localCustom.currentHardStreak ?? 0)
					: (remoteCustom.currentHardStreak ?? 0),
		} as unknown as GameCustomStatsMap[G];
	}

	return {
		gameId: local.gameId,
		baseStats: mergedBase,
		customStats: mergedCustom,
		unlockedMedals: mergedMedals,
		medalProgress: mergedProgress,
		schemaVersion: Math.max(local.schemaVersion, remote.schemaVersion),
		updatedAt: Math.max(local.updatedAt, remote.updatedAt),
	};
}
