import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createHistory, pushState, redo, reset, undo } from '../../engine/history.js';
import { STATIC_PUZZLES, getStaticPuzzle } from '../../engine/puzzles.js';
import {
	clearActiveGame,
	loadActiveGame,
	loadProgress,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.js';
import {
	type BoardState,
	DEFAULT_SETTINGS,
	type DifficultyLevel,
	type HashiSettings,
	type HistoryState,
	type Island,
	type IslandEvaluation,
	type ProgressMap,
} from '../../engine/types.js';
import {
	canConnect,
	checkVictory,
	getIslandStatus,
	getOrthogonalRaycasts,
	toggleBridge,
} from '../../engine/validator.js';

export function useHashiGame(initialDifficulty: DifficultyLevel = 'easy', initialPuzzleId?: string) {
	// Initialize board from catalog
	const [puzzleIndex, setPuzzleIndex] = useState(0);
	const initialBoard = useMemo(() => {
		const list = STATIC_PUZZLES[initialDifficulty] ?? STATIC_PUZZLES.easy;
		if (initialPuzzleId) {
			const foundIdx = list.findIndex((p) => p.id === initialPuzzleId);
			if (foundIdx >= 0) {
				return getStaticPuzzle(initialDifficulty, foundIdx);
			}
		}
		return getStaticPuzzle(initialDifficulty, 0);
	}, [initialDifficulty, initialPuzzleId]);

	const [puzzleId, setPuzzleId] = useState<string>(
		initialPuzzleId || initialBoard.islands[0] ? `hashi-${initialDifficulty}-1` : 'puzzle-1',
	);
	const [board, setBoard] = useState<BoardState>(initialBoard);
	const [history, setHistory] = useState<HistoryState>(() => createHistory(initialBoard));
	const [selectedIslandId, setSelectedIslandId] = useState<string | null>(null);
	const [focusedIslandId, setFocusedIslandId] = useState<string | null>(null);

	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [settings, setSettings] = useState<HashiSettings>(DEFAULT_SETTINGS);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [isLoaded, setIsLoaded] = useState(false);

	// Load settings, progress, and optional active game on mount
	useEffect(() => {
		async function init() {
			const [loadedSettings, loadedProgress, savedGame] = await Promise.all([
				loadSettings(),
				loadProgress(),
				loadActiveGame(),
			]);

			setSettings(loadedSettings);
			setProgress(loadedProgress);

			if (
				savedGame &&
				!savedGame.isComplete &&
				savedGame.difficulty === initialDifficulty &&
				(!initialPuzzleId || savedGame.puzzleId === initialPuzzleId)
			) {
				const restoredBoard: BoardState = {
					difficulty: savedGame.difficulty,
					width: initialBoard.width,
					height: initialBoard.height,
					islands: savedGame.islands,
					bridges: savedGame.bridges,
				};
				setBoard(restoredBoard);
				setHistory(createHistory(restoredBoard));
				setElapsedSeconds(savedGame.elapsedSeconds);
				setPuzzleId(savedGame.puzzleId);
			}

			setIsLoaded(true);
		}

		init();
	}, [initialDifficulty, initialPuzzleId, initialBoard.width, initialBoard.height]);

	// Timer ticker
	useEffect(() => {
		if (isPaused || isComplete || settings.gameMode === 'zen' || !isLoaded) {
			return;
		}

		const interval = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => window.clearInterval(interval);
	}, [isPaused, isComplete, settings.gameMode, isLoaded]);

	// Auto-save active game progress
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		saveActiveGame({
			puzzleId,
			difficulty: board.difficulty,
			islands: board.islands,
			bridges: board.bridges,
			elapsedSeconds,
			isComplete,
			lastPlayed: Date.now(),
		});
	}, [board, elapsedSeconds, isComplete, isLoaded, puzzleId]);

	// Island evaluation helper
	const getIslandEvaluation = useCallback(
		(islandId: string): IslandEvaluation => {
			return getIslandStatus(islandId, board);
		},
		[board],
	);

	// Satisfied island count
	const satisfiedCount = useMemo(() => {
		return board.islands.filter((isl) => getIslandStatus(isl.id, board).status === 'satisfied').length;
	}, [board]);

	// Island click interaction
	const handleIslandClick = useCallback(
		(island: Island) => {
			if (isComplete) return;

			if (!selectedIslandId) {
				setSelectedIslandId(island.id);
				return;
			}

			if (selectedIslandId === island.id) {
				setSelectedIslandId(null);
				return;
			}

			// Check if bridge exists between them or can connect
			const hasExistingBridge = board.bridges.some(
				(b) =>
					(b.fromId === selectedIslandId && b.toId === island.id) ||
					(b.fromId === island.id && b.toId === selectedIslandId),
			);

			if (hasExistingBridge || canConnect(selectedIslandId, island.id, board)) {
				const nextBoard = toggleBridge(selectedIslandId, island.id, board);
				setBoard(nextBoard);
				setHistory((prev) => pushState(prev, nextBoard));
				setSelectedIslandId(null);

				if (checkVictory(nextBoard)) {
					setIsComplete(true);
					setIsVictoryOpen(true);
					clearActiveGame();
					recordPuzzleCompletion(puzzleId, elapsedSeconds).then((res) => {
						setIsNewBestTime(res.isNewBestTime);
					});
				}
			} else {
				// If not connectable, switch active selection to the clicked island
				setSelectedIslandId(island.id);
			}
		},
		[board, isComplete, puzzleId, elapsedSeconds, selectedIslandId],
	);

	// Direct bridge click
	const handleBridgeClick = useCallback(
		(fromId: string, toId: string) => {
			if (isComplete) return;

			const nextBoard = toggleBridge(fromId, toId, board);
			setBoard(nextBoard);
			setHistory((prev) => pushState(prev, nextBoard));
			setSelectedIslandId(null);

			if (checkVictory(nextBoard)) {
				setIsComplete(true);
				setIsVictoryOpen(true);
				clearActiveGame();
				recordPuzzleCompletion(puzzleId, elapsedSeconds).then((res) => {
					setIsNewBestTime(res.isNewBestTime);
				});
			}
		},
		[board, isComplete, puzzleId, elapsedSeconds],
	);

	// Island focus
	const handleIslandFocus = useCallback((island: Island) => {
		setFocusedIslandId(island.id);
	}, []);

	// Keyboard navigation across islands
	const handleIslandKeyDown = useCallback(
		(e: KeyboardEvent, island: Island) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				handleIslandClick(island);
				return;
			}

			if (e.key === 'Escape') {
				e.preventDefault();
				setSelectedIslandId(null);
				return;
			}

			// Arrow keys navigate to nearest orthogonal neighbor
			const raycasts = getOrthogonalRaycasts(island.id, board);
			let targetNeighbor: Island | undefined;

			if (e.key === 'ArrowUp') {
				targetNeighbor = raycasts.find((n) => n.x === island.x && n.y < island.y);
			} else if (e.key === 'ArrowDown') {
				targetNeighbor = raycasts.find((n) => n.x === island.x && n.y > island.y);
			} else if (e.key === 'ArrowLeft') {
				targetNeighbor = raycasts.find((n) => n.y === island.y && n.x < island.x);
			} else if (e.key === 'ArrowRight') {
				targetNeighbor = raycasts.find((n) => n.y === island.y && n.x > island.x);
			}

			if (targetNeighbor) {
				e.preventDefault();
				setFocusedIslandId(targetNeighbor.id);
			}
		},
		[board, handleIslandClick],
	);

	// Controls
	const canUndo = history.past.length > 0;
	const canRedo = history.future.length > 0;

	const handleUndo = useCallback(() => {
		if (!canUndo) return;
		const nextHistory = undo(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
	}, [canUndo, history]);

	const handleRedo = useCallback(() => {
		if (!canRedo) return;
		const nextHistory = redo(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
	}, [canRedo, history]);

	const handleReset = useCallback(() => {
		const nextHistory = reset(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
	}, [history]);

	const handleTogglePause = useCallback(() => {
		setIsPaused((prev) => !prev);
	}, []);

	const handlePlayAgain = useCallback(() => {
		const nextHistory = reset(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setElapsedSeconds(0);
	}, [history]);

	const handleNextPuzzle = useCallback(() => {
		const nextIdx = puzzleIndex + 1;
		setPuzzleIndex(nextIdx);
		const nextBoard = getStaticPuzzle(board.difficulty, nextIdx);
		setBoard(nextBoard);
		setHistory(createHistory(nextBoard));
		setSelectedIslandId(null);
		setFocusedIslandId(null);
		setElapsedSeconds(0);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setPuzzleId(`hashi-${board.difficulty}-${nextIdx + 1}`);
	}, [puzzleIndex, board.difficulty]);

	const handleUpdateSettings = useCallback((newSettings: HashiSettings) => {
		setSettings(newSettings);
		saveSettings(newSettings);
	}, []);

	return {
		puzzleId,
		board,
		selectedIslandId,
		focusedIslandId,
		elapsedSeconds,
		isPaused,
		isComplete,
		isVictoryOpen,
		isSettingsOpen,
		isNewBestTime,
		settings,
		progress,
		satisfiedCount,
		canUndo,
		canRedo,
		getIslandEvaluation,
		handleIslandClick,
		handleBridgeClick,
		handleIslandFocus,
		handleIslandKeyDown,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		handlePlayAgain,
		handleNextPuzzle,
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		handleUpdateSettings,
	};
}
