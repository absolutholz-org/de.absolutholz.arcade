import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createHistory, pushState, redo, reset, undo } from '../../engine/history.js';
import {
	createBoardFromPuzzle,
	getNextPuzzle,
	getPuzzleById,
	getPuzzlesByDifficulty,
	getStaticPuzzle,
} from '../../engine/puzzles.js';
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
	DIFFICULTY_GRID_SIZES,
	DIFFICULTY_LEVELS,
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

function getInitialBoardState(
	initialDifficulty: DifficultyLevel,
	initialPuzzleId?: string,
): { board: BoardState; puzzleId: string } {
	let diff = initialDifficulty;
	let puzzle = getPuzzlesByDifficulty(diff)[0];

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const queryDiff = params.get('difficulty') as DifficultyLevel | null;
		const queryPuzzle = params.get('puzzle');

		if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
			diff = queryDiff;
		}

		if (queryPuzzle) {
			const found = getPuzzleById(queryPuzzle);
			if (found) {
				puzzle = found.puzzle;
				diff = found.difficulty;
			} else {
				const parsed = Number.parseInt(queryPuzzle, 10);
				if (!Number.isNaN(parsed)) {
					const list = getPuzzlesByDifficulty(diff);
					const safeIdx =
						parsed > 0 && parsed <= list.length ? parsed - 1 : Math.max(0, parsed % list.length);
					if (list[safeIdx]) {
						puzzle = list[safeIdx];
					}
				}
			}
		} else if (initialPuzzleId) {
			const found = getPuzzleById(initialPuzzleId);
			if (found) {
				puzzle = found.puzzle;
				diff = found.difficulty;
			}
		} else {
			const list = getPuzzlesByDifficulty(diff);
			if (list.length > 0) {
				puzzle = list[0];
			}
		}
	} else if (initialPuzzleId) {
		const found = getPuzzleById(initialPuzzleId);
		if (found) {
			puzzle = found.puzzle;
			diff = found.difficulty;
		}
	}

	return {
		board: createBoardFromPuzzle(puzzle, diff),
		puzzleId: puzzle.id,
	};
}

export function useHashiGame(initialDifficulty: DifficultyLevel = 'easy', initialPuzzleId?: string) {
	const initial = useMemo(
		() => getInitialBoardState(initialDifficulty, initialPuzzleId),
		[initialDifficulty, initialPuzzleId],
	);

	const [puzzleId, setPuzzleId] = useState<string>(initial.puzzleId);
	const [board, setBoard] = useState<BoardState>(initial.board);
	const [history, setHistory] = useState<HistoryState>(() => createHistory(initial.board));
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
			try {
				const [loadedSettings, loadedProgress, savedGame] = await Promise.all([
					loadSettings(),
					loadProgress(),
					loadActiveGame(),
				]);

				setSettings(loadedSettings);
				setProgress(loadedProgress);

				let requestedDiff: DifficultyLevel = initialDifficulty;
				let requestedPuzzle = getPuzzlesByDifficulty(initialDifficulty)[0];
				let forceNew = false;
				let forceResume = false;

				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					const queryDiff = params.get('difficulty') as DifficultyLevel | null;
					const queryPuzzle = params.get('puzzle');

					if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
						requestedDiff = queryDiff;
					}

					if (queryPuzzle) {
						const found = getPuzzleById(queryPuzzle);
						if (found) {
							requestedPuzzle = found.puzzle;
							requestedDiff = found.difficulty;
						} else {
							const parsed = Number.parseInt(queryPuzzle, 10);
							if (!Number.isNaN(parsed)) {
								const list = getPuzzlesByDifficulty(requestedDiff);
								const safeIdx =
									parsed > 0 && parsed <= list.length
										? parsed - 1
										: Math.max(0, parsed % list.length);
								if (list[safeIdx]) {
									requestedPuzzle = list[safeIdx];
								}
							}
						}
					} else {
						const list = getPuzzlesByDifficulty(requestedDiff);
						if (list.length > 0) {
							requestedPuzzle = list[0];
						}
					}

					if (params.get('new') === 'true') forceNew = true;
					if (params.get('resume') === 'true') forceResume = true;
				}

				if (
					!forceNew &&
					savedGame &&
					!savedGame.isComplete &&
					(forceResume || savedGame.puzzleId === requestedPuzzle.id)
				) {
					const restoredBoard: BoardState = {
						difficulty: savedGame.difficulty,
						width: DIFFICULTY_GRID_SIZES[savedGame.difficulty]?.width ?? 8,
						height: DIFFICULTY_GRID_SIZES[savedGame.difficulty]?.height ?? 8,
						islands: savedGame.islands,
						bridges: savedGame.bridges,
					};
					setBoard(restoredBoard);
					setHistory(createHistory(restoredBoard));
					setElapsedSeconds(savedGame.elapsedSeconds);
					setPuzzleId(savedGame.puzzleId);
					setIsPaused(true);
				} else {
					const newBoard = createBoardFromPuzzle(requestedPuzzle, requestedDiff);
					setBoard(newBoard);
					setHistory(createHistory(newBoard));
					setElapsedSeconds(0);
					setPuzzleId(requestedPuzzle.id);
					setIsPaused(false);
				}
			} catch {
				const fallback = getStaticPuzzle(initialDifficulty, 0);
				setBoard(fallback);
				setHistory(createHistory(fallback));
				setElapsedSeconds(0);
				setPuzzleId('puzzle-1');
			} finally {
				setIsLoaded(true);
			}
		}

		init();
	}, [initialDifficulty]);

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
						loadProgress().then(setProgress);
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
					loadProgress().then(setProgress);
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

	const hasNextPuzzle = useMemo(() => {
		return !!getNextPuzzle(puzzleId);
	}, [puzzleId]);

	const handleNextPuzzle = useCallback(() => {
		const next = getNextPuzzle(puzzleId);
		if (next) {
			const nextBoard = createBoardFromPuzzle(next.puzzle, next.difficulty);
			setBoard(nextBoard);
			setHistory(createHistory(nextBoard));
			setSelectedIslandId(null);
			setFocusedIslandId(null);
			setElapsedSeconds(0);
			setIsComplete(false);
			setIsVictoryOpen(false);
			setPuzzleId(next.puzzle.id);
			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.searchParams.set('difficulty', next.difficulty);
				url.searchParams.set('puzzle', next.puzzle.id);
				window.history.replaceState(null, '', url.toString());
			}
		} else {
			const current = getPuzzleById(puzzleId);
			const diff = current?.difficulty ?? board.difficulty;
			const list = getPuzzlesByDifficulty(diff);
			if (list.length > 0) {
				const firstBoard = createBoardFromPuzzle(list[0], diff);
				setBoard(firstBoard);
				setHistory(createHistory(firstBoard));
				setSelectedIslandId(null);
				setFocusedIslandId(null);
				setElapsedSeconds(0);
				setIsComplete(false);
				setIsVictoryOpen(false);
				setPuzzleId(list[0].id);
				if (typeof window !== 'undefined') {
					const url = new URL(window.location.href);
					url.searchParams.set('difficulty', diff);
					url.searchParams.set('puzzle', list[0].id);
					window.history.replaceState(null, '', url.toString());
				}
			}
		}
	}, [puzzleId, board.difficulty]);

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
		hasNextPuzzle,
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
