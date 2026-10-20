import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { generatePuzzle } from '../../engine/generator.js';
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

function checkIsolatedLoop(board: BoardState): boolean {
	if (board.islands.length < 3 || board.bridges.length < 3) return false;

	const adj = new Map<string, string[]>();
	for (const isl of board.islands) {
		adj.set(isl.id, []);
	}
	for (const bridge of board.bridges) {
		adj.get(bridge.fromId)?.push(bridge.toId);
		adj.get(bridge.toId)?.push(bridge.fromId);
	}

	const visited = new Set<string>();

	for (const island of board.islands) {
		if (visited.has(island.id)) continue;

		const component: string[] = [];
		const queue: string[] = [island.id];
		visited.add(island.id);

		while (queue.length > 0) {
			const curr = queue.shift();
			if (!curr) break;
			component.push(curr);
			const neighbors = adj.get(curr) ?? [];
			for (const n of neighbors) {
				if (!visited.has(n)) {
					visited.add(n);
					queue.push(n);
				}
			}
		}

		const compSet = new Set(component);
		const compBridges = board.bridges.filter((b) => compSet.has(b.fromId) && compSet.has(b.toId));

		if (
			component.length >= 3 &&
			component.length < board.islands.length &&
			compBridges.length >= component.length
		) {
			return true;
		}
	}

	return false;
}

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
		} else if (
			params.get('random') === 'true' ||
			params.get('procedural') === 'true' ||
			params.get('new') === 'true'
		) {
			try {
				const generated = generatePuzzle(diff);
				return {
					board: generated,
					puzzleId: `procedural-${diff}-${Date.now()}`,
				};
			} catch {
				// Fallback to static
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

	const mistakesCountRef = useRef(0);
	const hintsUsedRef = useRef(0);
	const bridgesDemolishedCountRef = useRef(0);
	const bridgeCollisionAttemptsRef = useRef(0);
	const edgeTogglesRef = useRef<Record<string, number>>({});
	const isolatedLoopCreatedRef = useRef(false);
	const singleBridgeDrawnBeforeAllDoublesRef = useRef(false);
	const hasRecordedResultRef = useRef(false);

	const resetTrackingContext = useCallback(() => {
		mistakesCountRef.current = 0;
		hintsUsedRef.current = 0;
		bridgesDemolishedCountRef.current = 0;
		bridgeCollisionAttemptsRef.current = 0;
		edgeTogglesRef.current = {};
		isolatedLoopCreatedRef.current = false;
		singleBridgeDrawnBeforeAllDoublesRef.current = false;
		hasRecordedResultRef.current = false;
	}, []);

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;
	const boardRef = useRef(board);
	boardRef.current = board;
	const isCompleteRef = useRef(isComplete);
	isCompleteRef.current = isComplete;
	const puzzleIdRef = useRef(puzzleId);
	puzzleIdRef.current = puzzleId;

	const recordSurrender = useCallback((finalSeconds?: number) => {
		const safeSeconds = finalSeconds !== undefined ? finalSeconds : elapsedRef.current;
		const curBoard = boardRef.current;
		if (isCompleteRef.current || hasRecordedResultRef.current) return;
		if (safeSeconds <= 0 && curBoard.bridges.length === 0) return;

		hasRecordedResultRef.current = true;
		const maxSameEdgeToggles = Math.max(...Object.values(edgeTogglesRef.current), 0);
		const sizeKey = `${curBoard.width}x${curBoard.height}`;
		const levelKey = curBoard.difficulty;

		void recordGameResult({
			gameId: 'bridges',
			won: false,
			playTimeSeconds: safeSeconds,
			levelKey,
			sizeKey,
			roundContext: {
				mistakesCount: mistakesCountRef.current,
				hintsUsed: hintsUsedRef.current,
				bridgesDemolishedCount: bridgesDemolishedCountRef.current,
				doubleBridgesDrawnBeforeSingle: false,
				isolatedLoopCreated: isolatedLoopCreatedRef.current,
				bridgeCollisionAttempts: bridgeCollisionAttemptsRef.current,
				maxSameEdgeToggles,
				difficulty: levelKey,
				size: sizeKey,
			},
		}).catch((error) => {
			console.warn('[@arcade/bridges] Failed to record surrender medals result:', error);
		});
	}, []);

	useEffect(() => {
		return () => {
			if (
				!isCompleteRef.current &&
				!hasRecordedResultRef.current &&
				(elapsedRef.current > 0 || boardRef.current.bridges.length > 0)
			) {
				recordSurrender(elapsedRef.current);
			}
		};
	}, [recordSurrender]);

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

				const isRandom =
					typeof window !== 'undefined' &&
					(new URLSearchParams(window.location.search).get('random') === 'true' ||
						new URLSearchParams(window.location.search).get('procedural') === 'true' ||
						(!new URLSearchParams(window.location.search).get('puzzle') &&
							new URLSearchParams(window.location.search).get('new') === 'true'));

				if (
					!forceNew &&
					savedGame &&
					!savedGame.isComplete &&
					(forceResume || (!isRandom && savedGame.puzzleId === requestedPuzzle.id))
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
				} else if (isRandom) {
					try {
						const generated = generatePuzzle(requestedDiff);
						const pid = `procedural-${requestedDiff}-${Date.now()}`;
						setBoard(generated);
						setHistory(createHistory(generated));
						setElapsedSeconds(0);
						setPuzzleId(pid);
						setIsPaused(false);
					} catch {
						const newBoard = createBoardFromPuzzle(requestedPuzzle, requestedDiff);
						setBoard(newBoard);
						setHistory(createHistory(newBoard));
						setElapsedSeconds(0);
						setPuzzleId(requestedPuzzle.id);
						setIsPaused(false);
					}
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

	const executeBridgeToggle = useCallback(
		(fromId: string, toId: string) => {
			const existingBridge = board.bridges.find(
				(b) => (b.fromId === fromId && b.toId === toId) || (b.fromId === toId && b.toId === fromId),
			);

			if (existingBridge && existingBridge.count === 2) {
				bridgesDemolishedCountRef.current += 1;
			}

			const edgeKey = fromId < toId ? `${fromId}-${toId}` : `${toId}-${fromId}`;
			edgeTogglesRef.current[edgeKey] = (edgeTogglesRef.current[edgeKey] ?? 0) + 1;

			if (existingBridge && existingBridge.count === 1) {
				const otherSingleExists = board.bridges.some(
					(b) =>
						b.count === 1 &&
						!((b.fromId === fromId && b.toId === toId) || (b.fromId === toId && b.toId === fromId)),
				);
				if (otherSingleExists) {
					singleBridgeDrawnBeforeAllDoublesRef.current = true;
				}
			}

			const nextBoard = toggleBridge(fromId, toId, board);

			const fromBefore = getIslandStatus(fromId, board).status;
			const toBefore = getIslandStatus(toId, board).status;
			const fromAfter = getIslandStatus(fromId, nextBoard).status;
			const toAfter = getIslandStatus(toId, nextBoard).status;

			if (
				(fromAfter === 'overflow' && fromBefore !== 'overflow') ||
				(toAfter === 'overflow' && toBefore !== 'overflow')
			) {
				mistakesCountRef.current += 1;
			}

			if (checkIsolatedLoop(nextBoard)) {
				isolatedLoopCreatedRef.current = true;
			}

			setBoard(nextBoard);
			setHistory((prev) => pushState(prev, nextBoard));
			setSelectedIslandId(null);

			if (checkVictory(nextBoard)) {
				setIsComplete(true);
				setIsVictoryOpen(true);
				clearActiveGame();
				hasRecordedResultRef.current = true;

				const maxSameEdgeToggles = Math.max(...Object.values(edgeTogglesRef.current), 0);
				const hasAnyDoubleBridges = nextBoard.bridges.some((b) => b.count === 2);
				const doubleBridgesDrawnBeforeSingle =
					hasAnyDoubleBridges && !singleBridgeDrawnBeforeAllDoublesRef.current;
				const isProcedural = puzzleId.startsWith('procedural-');
				const completedPresetId = isProcedural ? undefined : puzzleId;
				const sizeKey = `${nextBoard.width}x${nextBoard.height}`;
				const levelKey = nextBoard.difficulty;

				void recordGameResult({
					gameId: 'bridges',
					won: true,
					playTimeSeconds: elapsedSeconds,
					levelKey,
					sizeKey,
					roundContext: {
						mistakesCount: mistakesCountRef.current,
						hintsUsed: hintsUsedRef.current,
						bridgesDemolishedCount: bridgesDemolishedCountRef.current,
						doubleBridgesDrawnBeforeSingle,
						isolatedLoopCreated: isolatedLoopCreatedRef.current,
						bridgeCollisionAttempts: bridgeCollisionAttemptsRef.current,
						maxSameEdgeToggles,
						completedPresetId,
						difficulty: levelKey,
						size: sizeKey,
					},
				}).catch((error) => {
					console.warn('[@arcade/bridges] Failed to record victory medals result:', error);
				});

				if (!isProcedural) {
					recordPuzzleCompletion(puzzleId, elapsedSeconds).then((res) => {
						setIsNewBestTime(res.isNewBestTime);
						loadProgress().then(setProgress);
					});
				}
			}
		},
		[board, puzzleId, elapsedSeconds],
	);

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
				executeBridgeToggle(selectedIslandId, island.id);
			} else {
				// canConnect failed - analyze if it's an attempted crossing of spans or invalid collinear move
				const islandA = board.islands.find((isl) => isl.id === selectedIslandId);
				const islandB = island;
				if (islandA && (islandA.x === islandB.x || islandA.y === islandB.y)) {
					const isHorizontal = islandA.y === islandB.y;
					let blockedByIsland = false;
					if (isHorizontal) {
						const minX = Math.min(islandA.x, islandB.x);
						const maxX = Math.max(islandA.x, islandB.x);
						blockedByIsland = board.islands.some(
							(other) =>
								other.id !== selectedIslandId &&
								other.id !== island.id &&
								other.y === islandA.y &&
								other.x > minX &&
								other.x < maxX,
						);
					} else {
						const minY = Math.min(islandA.y, islandB.y);
						const maxY = Math.max(islandA.y, islandB.y);
						blockedByIsland = board.islands.some(
							(other) =>
								other.id !== selectedIslandId &&
								other.id !== island.id &&
								other.x === islandA.x &&
								other.y > minY &&
								other.y < maxY,
						);
					}

					if (blockedByIsland) {
						mistakesCountRef.current += 1;
					} else {
						// Blocked by crossing existing bridge(s)
						bridgeCollisionAttemptsRef.current += 1;
						mistakesCountRef.current += 1;
					}
				}

				// If not connectable, switch active selection to the clicked island
				setSelectedIslandId(island.id);
			}
		},
		[board, isComplete, selectedIslandId, executeBridgeToggle],
	);

	// Direct bridge click
	const handleBridgeClick = useCallback(
		(fromId: string, toId: string) => {
			if (isComplete) return;
			executeBridgeToggle(fromId, toId);
		},
		[isComplete, executeBridgeToggle],
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
		bridgesDemolishedCountRef.current += 1;
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
		if (board.bridges.length > 0) {
			bridgesDemolishedCountRef.current += board.bridges.length;
		}
		const nextHistory = reset(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
	}, [board.bridges.length, history]);

	const handleTogglePause = useCallback(() => {
		setIsPaused((prev) => !prev);
	}, []);

	const handlePlayAgain = useCallback(() => {
		if (!isComplete) {
			recordSurrender();
		}
		resetTrackingContext();
		const nextHistory = reset(history);
		setHistory(nextHistory);
		setBoard(nextHistory.present);
		setSelectedIslandId(null);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setElapsedSeconds(0);
	}, [isComplete, recordSurrender, resetTrackingContext, history]);

	const hasNextPuzzle = useMemo(() => {
		return !!getNextPuzzle(puzzleId);
	}, [puzzleId]);

	const handleNextPuzzle = useCallback(() => {
		if (!isComplete) {
			recordSurrender();
		}
		resetTrackingContext();
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
	}, [isComplete, recordSurrender, resetTrackingContext, puzzleId, board.difficulty]);

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
		recordSurrender,
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		handleUpdateSettings,
	};
}
