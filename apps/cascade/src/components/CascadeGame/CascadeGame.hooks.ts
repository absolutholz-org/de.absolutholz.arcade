import {
	initAudioSync,
	playDrop,
	playPickup,
	playProgress,
	playRegression,
	playVictoryFanfare,
	triggerHaptic,
} from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CASCADE_MEDAL_DEFINITIONS } from '../../config/medals';
import {
	calculateClusterScore,
	countRemainingTiles,
	executeMove,
	findCluster,
	findOrphanTiles,
} from '../../engine/board';
import { generateBoard } from '../../engine/generator';
import {
	type MoveHistory,
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	createHistory,
	getCurrentSnapshot,
	pushHistory,
	redoHistory,
	undoHistory,
} from '../../engine/history';
import {
	clearActiveGame,
	loadActiveGame,
	loadHighScore,
	loadSettings,
	recordCascadeRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	type Board,
	type CascadeSettings,
	type CellCoord,
	DEFAULT_CASCADE_SETTINGS,
	DIFFICULTIES,
	DIFFICULTY_CONFIGS,
	type Difficulty,
	MEGA_CLUSTER_THRESHOLD,
} from '../../engine/types';
import type { ParticleBurstEvent } from '../CascadeBoard/CascadeBoard';

function parseDifficultyFromUrl(fallback: Difficulty): {
	difficulty: Difficulty;
	isResume: boolean;
	isNew: boolean;
} {
	if (typeof window === 'undefined') {
		return { difficulty: fallback, isResume: false, isNew: false };
	}
	const params = new URLSearchParams(window.location.search);
	const rawDiff = params.get('difficulty');
	const difficulty = DIFFICULTIES.includes(rawDiff as Difficulty) ? (rawDiff as Difficulty) : fallback;
	return {
		difficulty,
		isResume: params.get('resume') === 'true',
		isNew: params.get('new') === 'true',
	};
}

export function useCascadeGame(initialDifficulty: Difficulty = 'easy') {
	const initialGenerated = useMemo(() => generateBoard(initialDifficulty), [initialDifficulty]);

	const [difficulty, setDifficulty] = useState<Difficulty>(initialGenerated.difficulty);
	const [seed, setSeed] = useState<number>(initialGenerated.seed);
	const [history, setHistory] = useState<MoveHistory>(() => {
		const cfg = DIFFICULTY_CONFIGS[initialGenerated.difficulty];
		return createHistory({
			board: initialGenerated.board,
			score: 0,
			movesCount: 0,
			maxClusterCleared: 0,
			remainingTiles: cfg.cols * cfg.rows,
		});
	});
	const [undosUsed, setUndosUsed] = useState<number>(0);
	const [highScore, setHighScore] = useState<number>(0);
	const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
	const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [isGameOver, setIsGameOver] = useState<boolean>(false);
	const [isPerfectClear, setIsPerfectClear] = useState<boolean>(false);
	const [orphanTiles, setOrphanTiles] = useState<readonly CellCoord[]>([]);
	const [selectedCluster, setSelectedCluster] = useState<readonly CellCoord[]>([]);
	const [hoveredCluster, setHoveredCluster] = useState<readonly CellCoord[]>([]);
	const [focusedCoord, setFocusedCoord] = useState<CellCoord>({ row: 0, col: 0 });
	const [settings, setSettings] = useState<CascadeSettings>(DEFAULT_CASCADE_SETTINGS);
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
	const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
	const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
	const [lastBurst, setLastBurst] = useState<ParticleBurstEvent | null>(null);
	const [hydrated, setHydrated] = useState<boolean>(false);

	const burstCounterRef = useRef<number>(0);
	const wasPausedBeforeModalRef = useRef<boolean>(false);

	const currentSnapshot = useMemo(() => getCurrentSnapshot(history), [history]);
	const board: Board = currentSnapshot.board;
	const score = currentSnapshot.score;
	const movesCount = currentSnapshot.movesCount;
	const maxClusterCleared = currentSnapshot.maxClusterCleared;
	const remainingTiles = currentSnapshot.remainingTiles;

	const activePreviewCluster =
		selectedCluster.length >= 2
			? selectedCluster
			: settings.showHoverPreview && hoveredCluster.length >= 2
				? hoveredCluster
				: [];

	const previewPoints = useMemo(
		() => calculateClusterScore(activePreviewCluster.length),
		[activePreviewCluster.length],
	);

	// Initialize audio sync, load settings, high score, and restore active game if applicable
	useEffect(() => {
		initAudioSync();

		async function bootstrap() {
			const { difficulty: urlDiff, isResume, isNew } = parseDifficultyFromUrl(initialDifficulty);
			const loadedSettings = await loadSettings();
			setSettings(loadedSettings);

			let targetDifficulty = urlDiff;

			if (!isNew) {
				const saved = await loadActiveGame();
				if (saved && saved.status !== 'completed' && (isResume || saved.difficulty === urlDiff)) {
					targetDifficulty = saved.difficulty;
					setDifficulty(saved.difficulty);
					setSeed(saved.seed);
					setHistory({
						entries: saved.history,
						index: saved.historyIndex,
					});
					setUndosUsed(saved.undosUsed);
					setElapsedSeconds(saved.elapsedSeconds);
					setIsPaused(true);
					const best = await loadHighScore(saved.difficulty);
					setHighScore(best);
					setHydrated(true);
					return;
				}
			}

			if (isNew) {
				await clearActiveGame();
			}

			const fresh = generateBoard(targetDifficulty);
			const cfg = DIFFICULTY_CONFIGS[targetDifficulty];
			setDifficulty(targetDifficulty);
			setSeed(fresh.seed);
			setHistory(
				createHistory({
					board: fresh.board,
					score: 0,
					movesCount: 0,
					maxClusterCleared: 0,
					remainingTiles: cfg.cols * cfg.rows,
				}),
			);
			setUndosUsed(0);
			setElapsedSeconds(0);
			setIsPaused(false);
			setIsGameOver(false);
			setIsPerfectClear(false);
			setOrphanTiles([]);
			setSelectedCluster([]);
			setHoveredCluster([]);
			setIsVictoryOpen(false);
			setIsNewHighScore(false);

			const best = await loadHighScore(targetDifficulty);
			setHighScore(best);
			void saveLastConfig({ difficulty: targetDifficulty });
			setHydrated(true);
		}

		void bootstrap();
	}, [initialDifficulty]);

	// Timer tick
	useEffect(() => {
		if (!hydrated || isPaused || isGameOver || isSettingsOpen || isRulesOpen) return;
		const id = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(id);
	}, [hydrated, isPaused, isGameOver, isSettingsOpen, isRulesOpen]);

	// Auto-save active session snapshot for resume support
	useEffect(() => {
		if (!hydrated || isGameOver) return;
		if (movesCount === 0 && elapsedSeconds === 0) return;

		void saveActiveGame({
			difficulty,
			seed,
			board,
			score,
			movesCount,
			undosUsed,
			maxClusterCleared,
			elapsedSeconds,
			status: isPaused ? 'paused' : 'playing',
			history: history.entries,
			historyIndex: history.index,
			savedAt: Date.now(),
		});
	}, [
		hydrated,
		isGameOver,
		difficulty,
		seed,
		board,
		score,
		movesCount,
		undosUsed,
		maxClusterCleared,
		elapsedSeconds,
		isPaused,
		history,
	]);

	const handleStartNewGame = useCallback(async (nextDifficulty: Difficulty, customSeed?: number) => {
		await clearActiveGame();
		const fresh = generateBoard(nextDifficulty, customSeed);
		const cfg = DIFFICULTY_CONFIGS[nextDifficulty];
		setDifficulty(nextDifficulty);
		setSeed(fresh.seed);
		setHistory(
			createHistory({
				board: fresh.board,
				score: 0,
				movesCount: 0,
				maxClusterCleared: 0,
				remainingTiles: cfg.cols * cfg.rows,
			}),
		);
		setUndosUsed(0);
		setElapsedSeconds(0);
		setIsPaused(false);
		setIsGameOver(false);
		setIsPerfectClear(false);
		setOrphanTiles([]);
		setSelectedCluster([]);
		setHoveredCluster([]);
		setIsVictoryOpen(false);
		setIsNewHighScore(false);
		setLastBurst(null);
		setFocusedCoord({ row: 0, col: 0 });

		const best = await loadHighScore(nextDifficulty);
		setHighScore(best);
		void saveLastConfig({ difficulty: nextDifficulty });
	}, []);

	const handleRestart = useCallback(() => {
		void handleStartNewGame(difficulty, seed);
	}, [difficulty, seed, handleStartNewGame]);

	const handleHoverCell = useCallback(
		(coord: CellCoord | null) => {
			if (!coord || isPaused || isGameOver || !settings.showHoverPreview) {
				setHoveredCluster([]);
				return;
			}
			const cluster = findCluster(board, coord.row, coord.col);
			setHoveredCluster(cluster.length >= 2 ? cluster : []);
		},
		[board, isPaused, isGameOver, settings.showHoverPreview],
	);

	const handleClearSelection = useCallback(() => {
		setSelectedCluster([]);
	}, []);

	const finalizeRound = useCallback(
		async (params: {
			finalScore: number;
			perfectClear: boolean;
			finalMoves: number;
			finalRemaining: number;
			finalMaxCluster: number;
			finalOrphans: readonly CellCoord[];
		}) => {
			setIsGameOver(true);
			setIsPerfectClear(params.perfectClear);
			setOrphanTiles(params.finalOrphans);
			setSelectedCluster([]);
			setHoveredCluster([]);
			await clearActiveGame();

			if (params.finalScore > highScore) {
				setHighScore(params.finalScore);
				setIsNewHighScore(true);
			}

			if (params.perfectClear) {
				playVictoryFanfare();
				triggerHaptic('success');
			} else {
				playDrop();
				triggerHaptic('medium');
			}

			await recordCascadeRoundStats({
				difficulty,
				score: params.finalScore,
				isPerfectClear: params.perfectClear,
				playTimeSeconds: elapsedSeconds,
				movesCount: params.finalMoves,
				remainingTiles: params.finalRemaining,
				maxClusterCleared: params.finalMaxCluster,
			});

			await recordGameResult(
				{
					gameId: 'cascade',
					won: true,
					playTimeSeconds: elapsedSeconds,
					levelKey: difficulty,
					roundContext: {
						difficulty,
						score: params.finalScore,
						maxClusterCleared: params.finalMaxCluster,
						isPerfectClear: params.perfectClear,
						undosUsed,
						remainingTiles: params.finalRemaining,
					},
				},
				{ definitions: CASCADE_MEDAL_DEFINITIONS },
			);

			// Slight delay on orphan highlight so player sees the final board state before modal opens
			window.setTimeout(
				() => {
					setIsVictoryOpen(true);
				},
				params.perfectClear ? 450 : 650,
			);
		},
		[difficulty, elapsedSeconds, highScore, undosUsed],
	);

	const handleActivateCell = useCallback(
		(
			coord: CellCoord,
		): {
			action: 'selected' | 'cleared' | 'isolated' | 'empty';
			clusterSize: number;
			points: number;
			remaining: number;
			isGameOver: boolean;
			isPerfectClear: boolean;
			finalScore: number;
		} => {
			if (isPaused || isGameOver) {
				return {
					action: 'empty',
					clusterSize: 0,
					points: 0,
					remaining: remainingTiles,
					isGameOver,
					isPerfectClear,
					finalScore: score,
				};
			}

			const tile = board[coord.row]?.[coord.col];
			if (!tile) {
				setSelectedCluster([]);
				return {
					action: 'empty',
					clusterSize: 0,
					points: 0,
					remaining: remainingTiles,
					isGameOver: false,
					isPerfectClear: false,
					finalScore: score,
				};
			}

			const isAlreadySelected = selectedCluster.some((c) => c.row === coord.row && c.col === coord.col);

			if (!isAlreadySelected) {
				const cluster = findCluster(board, coord.row, coord.col);
				if (cluster.length < 2) {
					setSelectedCluster([]);
					playRegression();
					triggerHaptic('light');
					return {
						action: 'isolated',
						clusterSize: 1,
						points: 0,
						remaining: remainingTiles,
						isGameOver: false,
						isPerfectClear: false,
						finalScore: score,
					};
				}

				setSelectedCluster(cluster);
				playPickup();
				triggerHaptic('light');
				return {
					action: 'selected',
					clusterSize: cluster.length,
					points: calculateClusterScore(cluster.length),
					remaining: remainingTiles,
					isGameOver: false,
					isPerfectClear: false,
					finalScore: score,
				};
			}

			// Second click/tap on highlighted cluster -> execute removal & physics
			const result = executeMove(board, coord.row, coord.col);
			if (!result) {
				setSelectedCluster([]);
				return {
					action: 'isolated',
					clusterSize: 1,
					points: 0,
					remaining: remainingTiles,
					isGameOver: false,
					isPerfectClear: false,
					finalScore: score,
				};
			}

			const nextScore = score + result.pointsAwarded + result.perfectClearBonus;
			const nextMoves = movesCount + 1;
			const nextMaxCluster = Math.max(maxClusterCleared, result.clusterSize);
			const isMega = result.clusterSize >= MEGA_CLUSTER_THRESHOLD;

			setHistory((prev) =>
				pushHistory(prev, {
					board: result.board,
					score: nextScore,
					movesCount: nextMoves,
					maxClusterCleared: nextMaxCluster,
					remainingTiles: result.remainingTiles,
				}),
			);
			setSelectedCluster([]);
			setHoveredCluster([]);

			burstCounterRef.current += 1;
			setLastBurst({
				id: burstCounterRef.current,
				tiles: result.removedTiles,
				points: result.pointsAwarded,
				isMega,
			});

			// Scale pentatonic chime pitch with cluster size
			const pitchStep = Math.min(12, Math.max(0, result.clusterSize - 2));
			playProgress(pitchStep);
			if (isMega) {
				triggerHaptic('success');
			} else {
				triggerHaptic('medium');
			}

			if (result.isGameOver) {
				void finalizeRound({
					finalScore: nextScore,
					perfectClear: result.isPerfectClear,
					finalMoves: nextMoves,
					finalRemaining: result.remainingTiles,
					finalMaxCluster: nextMaxCluster,
					finalOrphans: result.orphanTiles,
				});
			}

			return {
				action: 'cleared',
				clusterSize: result.clusterSize,
				points: result.pointsAwarded,
				remaining: result.remainingTiles,
				isGameOver: result.isGameOver,
				isPerfectClear: result.isPerfectClear,
				finalScore: nextScore,
			};
		},
		[
			board,
			isPaused,
			isGameOver,
			isPerfectClear,
			maxClusterCleared,
			movesCount,
			remainingTiles,
			score,
			selectedCluster,
			finalizeRound,
		],
	);

	const handleUndo = useCallback(() => {
		if (!checkCanUndo(history) || isPaused || isGameOver) return;
		setHistory((prev) => undoHistory(prev));
		setUndosUsed((prev) => prev + 1);
		setSelectedCluster([]);
		setHoveredCluster([]);
		setOrphanTiles([]);
		playDrop();
		triggerHaptic('light');
	}, [history, isPaused, isGameOver]);

	const handleRedo = useCallback(() => {
		if (!checkCanRedo(history) || isPaused || isGameOver) return;
		setHistory((prev) => redoHistory(prev));
		setSelectedCluster([]);
		setHoveredCluster([]);
		playPickup();
		triggerHaptic('light');
	}, [history, isPaused, isGameOver]);

	const handleTogglePause = useCallback(() => {
		if (isGameOver) return;
		setIsPaused((prev) => !prev);
		setSelectedCluster([]);
		setHoveredCluster([]);
	}, [isGameOver]);

	const openSettings = useCallback(() => {
		wasPausedBeforeModalRef.current = isPaused;
		setIsPaused(true);
		setIsSettingsOpen(true);
	}, [isPaused]);

	const closeSettings = useCallback(() => {
		setIsSettingsOpen(false);
		if (!wasPausedBeforeModalRef.current && !isGameOver) {
			setIsPaused(false);
		}
	}, [isGameOver]);

	const openRules = useCallback(() => {
		wasPausedBeforeModalRef.current = isPaused;
		setIsPaused(true);
		setIsRulesOpen(true);
	}, [isPaused]);

	const closeRules = useCallback(() => {
		setIsRulesOpen(false);
		if (!wasPausedBeforeModalRef.current && !isGameOver) {
			setIsPaused(false);
		}
	}, [isGameOver]);

	const closeVictory = useCallback(() => {
		setIsVictoryOpen(false);
		// Ensure orphan highlights stay visible if user closes modal to inspect board
		if (isGameOver && !isPerfectClear) {
			setOrphanTiles(findOrphanTiles(board));
		}
	}, [board, isGameOver, isPerfectClear]);

	const updateSettings = useCallback((next: CascadeSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	return {
		difficulty,
		board,
		score,
		highScore,
		isNewHighScore,
		remainingTiles,
		movesCount,
		maxClusterCleared,
		previewPoints,
		selectedCluster,
		hoveredCluster,
		orphanTiles,
		focusedCoord,
		setFocusedCoord,
		elapsedSeconds,
		isPaused,
		isGameOver,
		isPerfectClear,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		settings,
		updateSettings,
		isSettingsOpen,
		openSettings,
		closeSettings,
		isRulesOpen,
		openRules,
		closeRules,
		isVictoryOpen,
		closeVictory,
		liveAnnouncement,
		setLiveAnnouncement,
		lastBurst,
		handleHoverCell,
		handleActivateCell,
		handleClearSelection,
		handleUndo,
		handleRedo,
		handleRestart,
		handleStartNewGame,
		handleTogglePause,
	};
}
