import { recordGameResult } from '@arcade/lib-medals';
import { recordGameStats } from '@arcade/lib-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UNTANGLE_SETTINGS_CONFIG } from '../../config/settings.ts';
import { findIntersections } from '../../engine/geometry.ts';
import { generatePlanarGraph, moveVertex } from '../../engine/graph-generator.ts';
import { canRedo, canUndo, createInitialHistory, pushHistory, redoHistory, undoHistory } from '../../engine/history.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.ts';
import {
	type BoardState,
	DEFAULT_UNTANGLE_SETTINGS,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type Edge,
	type HistoryState,
	type IntersectionSummary,
	type UntangleSettings,
	type Vertex,
} from '../../engine/types.ts';

export {
	DEFAULT_UNTANGLE_SETTINGS,
	DIFFICULTY_LEVELS,
	type BoardState,
	type DifficultyLevel,
	type Edge,
	type IntersectionSummary,
	type UntangleSettings,
	UNTANGLE_SETTINGS_CONFIG,
	type Vertex,
};

function parseSeedNumber(seedInput?: string | number): number | undefined {
	if (typeof seedInput === 'number' && Number.isFinite(seedInput)) {
		return seedInput >>> 0;
	}
	if (typeof seedInput === 'string' && seedInput.trim().length > 0) {
		const trimmed = seedInput.trim();
		const numeric = Number(trimmed);
		if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
			return numeric >>> 0;
		}
		let hash = 2166136261 >>> 0;
		for (let i = 0; i < trimmed.length; i += 1) {
			hash ^= trimmed.charCodeAt(i);
			hash = Math.imul(hash, 16777619);
		}
		return hash >>> 0 || 1;
	}
	return undefined;
}

function resolveInitialParams(
	defaultDifficulty: DifficultyLevel,
	defaultSeed?: string | number,
): {
	difficulty: DifficultyLevel;
	seed?: number;
	forceNew: boolean;
	forceResume: boolean;
} {
	let difficulty: DifficultyLevel = defaultDifficulty;
	let seed: number | undefined = parseSeedNumber(defaultSeed);
	let forceNew = false;
	let forceResume = false;

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const queryDiff = params.get('difficulty') as DifficultyLevel | null;
		const querySeed = params.get('seed');

		if (queryDiff && DIFFICULTY_LEVELS.includes(queryDiff)) {
			difficulty = queryDiff;
		}
		if (querySeed && querySeed.trim().length > 0) {
			seed = parseSeedNumber(querySeed);
		}
		if (params.get('new') === 'true') {
			forceNew = true;
		}
		if (params.get('resume') === 'true') {
			forceResume = true;
		}
	}

	return { difficulty, seed, forceNew, forceResume };
}

export interface UseUntangleGameOptions {
	initialDifficulty?: DifficultyLevel;
	initialSeed?: string | number;
	formatLiveCrossings?: (count: number, moves: number) => string;
	formatSolvedAnnouncement?: () => string;
}

export function useUntangleGame({
	initialDifficulty = 'easy',
	initialSeed,
	formatLiveCrossings,
	formatSolvedAnnouncement,
}: UseUntangleGameOptions = {}) {
	const initialParams = useMemo(
		() => resolveInitialParams(initialDifficulty, initialSeed),
		[initialDifficulty, initialSeed],
	);

	const initialGeneratedBoard = useMemo(
		() => generatePlanarGraph(initialParams.difficulty, initialParams.seed),
		[initialParams.difficulty, initialParams.seed],
	);

	const [history, setHistory] = useState<HistoryState>(() => createInitialHistory(initialGeneratedBoard));
	const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
	const [draggingVertexId, setDraggingVertexId] = useState<string | null>(null);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [undoUsed, setUndoUsed] = useState(false);
	const [settings, setSettings] = useState<UntangleSettings>(DEFAULT_UNTANGLE_SETTINGS);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);

	const initialBoardRef = useRef<BoardState>(initialGeneratedBoard);
	const dragStartBoardRef = useRef<BoardState | null>(null);
	const historyRef = useRef<HistoryState>(history);
	historyRef.current = history;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const undoUsedRef = useRef(undoUsed);
	undoUsedRef.current = undoUsed;

	const hasRecordedWinRef = useRef(false);

	const board = history.present;

	const intersectionSummary = useMemo(
		() => findIntersections(board.vertices, board.edges),
		[board.vertices, board.edges],
	);

	const intersectingEdgeKeys = useMemo(() => {
		const keys = new Set<string>();
		for (const index of intersectionSummary.intersectingEdgeIndices) {
			keys.add(String(index));
			const edge = board.edges[index];
			if (edge) {
				const [u, v] = edge;
				keys.add(`${u}-${v}`);
				keys.add(`${v}-${u}`);
			}
		}
		return keys;
	}, [board.edges, intersectionSummary.intersectingEdgeIndices]);

	const updateAnnouncement = useCallback(
		(crossings: number, moves: number, solved: boolean) => {
			if (solved) {
				setLiveAnnouncement(formatSolvedAnnouncement ? formatSolvedAnnouncement() : '');
			} else {
				setLiveAnnouncement(formatLiveCrossings ? formatLiveCrossings(crossings, moves) : '');
			}
		},
		[formatLiveCrossings, formatSolvedAnnouncement],
	);

	const handleWinIfSolved = useCallback(
		async (nextBoard: BoardState, summary: IntersectionSummary) => {
			if (!summary.isSolved || hasRecordedWinRef.current) {
				return;
			}
			hasRecordedWinRef.current = true;
			setIsComplete(true);
			setIsVictoryOpen(true);
			updateAnnouncement(0, nextBoard.moveCount, true);

			const playTimeSeconds = elapsedRef.current;

			try {
				const completion = await recordPuzzleCompletion(
					nextBoard.difficulty,
					playTimeSeconds,
					nextBoard.moveCount,
				);
				setIsNewBestTime(completion.isNewBestTime);
				await clearActiveGame();
			} catch {
				// Ignore storage failures in restricted environments
			}

			try {
				await recordGameStats({
					gameId: 'untangle',
					won: true,
					playTimeSeconds,
					bucketKey: nextBoard.difficulty,
				});
			} catch {
				// Non-fatal stats error
			}

			try {
				await recordGameResult({
					gameId: 'untangle',
					won: true,
					playTimeSeconds,
					levelKey: nextBoard.difficulty,
					roundContext: { undoUsed: undoUsedRef.current },
				});
			} catch {
				// Non-fatal medals error
			}
		},
		[updateAnnouncement],
	);

	useEffect(() => {
		let mounted = true;
		async function init() {
			try {
				const [savedSettings, savedGame] = await Promise.all([loadSettings(), loadActiveGame()]);

				if (!mounted) return;

				if (savedSettings) {
					const casual = Boolean(savedSettings.casualMode ?? savedSettings.gameMode === 'casual');
					setSettings({
						...DEFAULT_UNTANGLE_SETTINGS,
						...savedSettings,
						casualMode: casual,
						gameMode: casual ? 'casual' : 'standard',
					});
				}

				const { difficulty, seed, forceNew, forceResume } = resolveInitialParams(
					initialDifficulty,
					initialSeed,
				);

				if (
					!forceNew &&
					savedGame &&
					savedGame.board &&
					(forceResume ||
						(savedGame.board.difficulty === difficulty &&
							(seed === undefined || savedGame.board.seed === seed)))
				) {
					const past = savedGame.historyPast ?? [];
					const future = savedGame.historyFuture ?? [];
					const baseBoard = past[0] ?? savedGame.board;
					initialBoardRef.current = {
						...baseBoard,
						moveCount: 0,
					};
					const restoredHistory: HistoryState = {
						past,
						present: savedGame.board,
						future,
					};
					historyRef.current = restoredHistory;
					setHistory(restoredHistory);
					setElapsedSeconds(savedGame.elapsedSeconds ?? 0);
					setUndoUsed(Boolean(savedGame.undoUsed));
					undoUsedRef.current = Boolean(savedGame.undoUsed);
					setIsPaused(Boolean(forceResume));
					hasRecordedWinRef.current = false;
				} else {
					const freshBoard = generatePlanarGraph(difficulty, seed);
					initialBoardRef.current = freshBoard;
					const freshHistory = createInitialHistory(freshBoard);
					historyRef.current = freshHistory;
					setHistory(freshHistory);
					setElapsedSeconds(0);
					setUndoUsed(false);
					undoUsedRef.current = false;
					setIsPaused(false);
					hasRecordedWinRef.current = false;
				}
			} catch {
				// Fallback to initial board
			} finally {
				if (mounted) {
					setIsLoaded(true);
				}
			}
		}
		void init();
		return () => {
			mounted = false;
		};
	}, [initialDifficulty, initialSeed]);

	useEffect(() => {
		if (!isLoaded || isPaused || isComplete || settings.casualMode) {
			return;
		}
		const intervalId = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [isLoaded, isPaused, isComplete, settings.casualMode]);

	useEffect(() => {
		if (!isLoaded || isComplete) return;
		void saveActiveGame({
			board: history.present,
			historyPast: history.past,
			historyFuture: history.future,
			elapsedSeconds,
			undoUsed,
			updatedAt: Date.now(),
		});
	}, [isLoaded, isComplete, history, elapsedSeconds, undoUsed]);

	const handleSelectVertex = useCallback((vertexId: string | null) => {
		setSelectedVertexId(vertexId);
	}, []);

	const handleDragStart = useCallback((vertexId: string) => {
		if (hasRecordedWinRef.current) return;
		dragStartBoardRef.current = historyRef.current.present;
		setDraggingVertexId(vertexId);
		setSelectedVertexId(vertexId);
	}, []);

	const handleDragMove = useCallback((vertexId: string, x: number, y: number) => {
		if (hasRecordedWinRef.current) return;
		setHistory((prev) => {
			const moved = moveVertex(prev.present, vertexId, x, y, false);
			if (moved === prev.present) {
				return prev;
			}
			const next = { ...prev, present: moved };
			historyRef.current = next;
			return next;
		});
	}, []);

	const handleDragEnd = useCallback(
		(vertexId: string, x: number, y: number) => {
			setDraggingVertexId(null);
			if (hasRecordedWinRef.current) return;

			const currentHistory = historyRef.current;
			const baseBoard = dragStartBoardRef.current ?? currentHistory.present;
			dragStartBoardRef.current = null;

			const startVertex = baseBoard.vertices.find((v) => v.id === vertexId);
			const nextBoardWithMove = moveVertex(baseBoard, vertexId, x, y, true);
			const endVertex = nextBoardWithMove.vertices.find((v) => v.id === vertexId);

			const moved =
				!startVertex ||
				!endVertex ||
				Math.hypot(endVertex.x - startVertex.x, endVertex.y - startVertex.y) > 0.0005;

			if (!moved) {
				const restored = { ...currentHistory, present: baseBoard };
				historyRef.current = restored;
				setHistory(restored);
				return;
			}

			const nextHistory = pushHistory({ ...currentHistory, present: baseBoard }, nextBoardWithMove);
			historyRef.current = nextHistory;
			setHistory(nextHistory);

			const summary = findIntersections(nextBoardWithMove.vertices, nextBoardWithMove.edges);
			updateAnnouncement(summary.intersectionCount, nextBoardWithMove.moveCount, summary.isSolved);
			if (summary.isSolved) {
				void handleWinIfSolved(nextBoardWithMove, summary);
			}
		},
		[handleWinIfSolved, updateAnnouncement],
	);

	const handleKeyNudge = useCallback(
		(vertexId: string, dx: number, dy: number) => {
			if (hasRecordedWinRef.current) return;
			const currentHistory = historyRef.current;
			const currentBoard = currentHistory.present;
			const target = currentBoard.vertices.find((v) => v.id === vertexId);
			if (!target) return;

			const nextBoard = moveVertex(currentBoard, vertexId, target.x + dx, target.y + dy, true);
			const updatedTarget = nextBoard.vertices.find((v) => v.id === vertexId);
			if (!updatedTarget || (updatedTarget.x === target.x && updatedTarget.y === target.y)) {
				return;
			}

			const nextHistory = pushHistory(currentHistory, nextBoard);
			historyRef.current = nextHistory;
			setHistory(nextHistory);

			const summary = findIntersections(nextBoard.vertices, nextBoard.edges);
			updateAnnouncement(summary.intersectionCount, nextBoard.moveCount, summary.isSolved);
			if (summary.isSolved) {
				void handleWinIfSolved(nextBoard, summary);
			}
		},
		[handleWinIfSolved, updateAnnouncement],
	);

	const handleUndo = useCallback(() => {
		const currentHistory = historyRef.current;
		if (!canUndo(currentHistory) || isComplete) return;

		const nextHistory = undoHistory(currentHistory);
		historyRef.current = nextHistory;
		setHistory(nextHistory);
		setUndoUsed(true);
		undoUsedRef.current = true;

		const summary = findIntersections(nextHistory.present.vertices, nextHistory.present.edges);
		updateAnnouncement(summary.intersectionCount, nextHistory.present.moveCount, summary.isSolved);
	}, [isComplete, updateAnnouncement]);

	const handleRedo = useCallback(() => {
		const currentHistory = historyRef.current;
		if (!canRedo(currentHistory) || isComplete) return;

		const nextHistory = redoHistory(currentHistory);
		historyRef.current = nextHistory;
		setHistory(nextHistory);

		const summary = findIntersections(nextHistory.present.vertices, nextHistory.present.edges);
		updateAnnouncement(summary.intersectionCount, nextHistory.present.moveCount, summary.isSolved);
	}, [isComplete, updateAnnouncement]);

	const handleReset = useCallback(() => {
		const initialBoard: BoardState = {
			...initialBoardRef.current,
			moveCount: 0,
		};
		hasRecordedWinRef.current = false;
		const resetHistoryState = createInitialHistory(initialBoard);
		historyRef.current = resetHistoryState;
		setHistory(resetHistoryState);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setSelectedVertexId(null);
		setDraggingVertexId(null);

		const summary = findIntersections(initialBoard.vertices, initialBoard.edges);
		updateAnnouncement(summary.intersectionCount, 0, false);
	}, [updateAnnouncement]);

	const handleNewPuzzle = useCallback(
		(nextDifficulty?: DifficultyLevel, nextSeed?: string | number) => {
			const diff = nextDifficulty ?? historyRef.current.present.difficulty;
			const freshBoard = generatePlanarGraph(diff, parseSeedNumber(nextSeed));
			initialBoardRef.current = freshBoard;
			hasRecordedWinRef.current = false;
			const freshHistory = createInitialHistory(freshBoard);
			historyRef.current = freshHistory;
			setHistory(freshHistory);
			setElapsedSeconds(0);
			setUndoUsed(false);
			undoUsedRef.current = false;
			setIsComplete(false);
			setIsVictoryOpen(false);
			setIsNewBestTime(false);
			setIsPaused(false);
			setSelectedVertexId(null);
			setDraggingVertexId(null);

			const summary = findIntersections(freshBoard.vertices, freshBoard.edges);
			updateAnnouncement(summary.intersectionCount, 0, false);
		},
		[updateAnnouncement],
	);

	const handleTogglePause = useCallback(() => {
		setIsPaused((prev) => !prev);
	}, []);

	const handleUpdateSettings = useCallback((updated: Record<string, unknown>) => {
		setSettings((prev) => {
			const casualMode =
				typeof updated.casualMode === 'boolean'
					? updated.casualMode
					: updated.gameMode === 'casual'
						? true
						: updated.gameMode === 'standard'
							? false
							: prev.casualMode;
			const highlightIntersectingEdges =
				typeof updated.highlightIntersectingEdges === 'boolean'
					? updated.highlightIntersectingEdges
					: prev.highlightIntersectingEdges;
			const showCrossingCounter =
				typeof updated.showCrossingCounter === 'boolean'
					? updated.showCrossingCounter
					: prev.showCrossingCounter;

			const next: UntangleSettings = {
				...prev,
				...updated,
				highlightIntersectingEdges,
				showCrossingCounter,
				casualMode,
				gameMode: casualMode ? 'casual' : 'standard',
			};
			void saveSettings(next);
			return next;
		});
	}, []);

	return {
		board,
		history,
		intersectionSummary,
		intersectingEdgeKeys,
		selectedVertexId,
		draggingVertexId,
		elapsedSeconds,
		isPaused,
		isComplete,
		isVictoryOpen,
		isRulesOpen,
		isSettingsOpen,
		isNewBestTime,
		undoUsed,
		canUndo: canUndo(history) && !isComplete,
		canRedo: canRedo(history) && !isComplete,
		settings,
		liveAnnouncement,
		isLoaded,
		handleSelectVertex,
		handleDragStart,
		handleDragMove,
		handleDragEnd,
		handleKeyNudge,
		handleUndo,
		handleRedo,
		handleReset,
		handleNewPuzzle,
		handleTogglePause,
		handleUpdateSettings,
		openRules: () => setIsRulesOpen(true),
		closeRules: () => setIsRulesOpen(false),
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
