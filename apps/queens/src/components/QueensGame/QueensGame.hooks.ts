import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { QUEENS_MEDAL_DEFINITIONS } from '../../config/medals';
import { getAutoCrossCells } from '../../engine/autoCross';
import { generateQueensPuzzle } from '../../engine/generator';
import { cloneBoard } from '../../engine/history';
import { QUEENS_PUZZLES, getNextPuzzle, getPuzzleById, getPuzzlesByDifficulty } from '../../engine/puzzles';
import {
	clearActiveGame,
	loadActiveGame,
	loadProgress,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage';
import {
	type CellCoord,
	type CellState,
	DEFAULT_SETTINGS,
	type Difficulty,
	type GameSettings,
	type InputMode,
	type MoveAction,
	type ProgressMap,
	type QueensPuzzle,
} from '../../engine/types';
import { getConflicts, isBoardSolved } from '../../engine/validator';

function createEmptyBoard(size: number): CellState[][] {
	return Array.from({ length: size }, () => new Array(size).fill('empty'));
}

export function useQueensGame(initialDifficulty: Difficulty = 'easy', initialPuzzleId?: string) {
	const initialPuzzle = useMemo(() => {
		if (initialPuzzleId) {
			const found = getPuzzleById(initialPuzzleId);
			if (found) return found;
		}
		const diffList = getPuzzlesByDifficulty(initialDifficulty);
		return diffList[0] || QUEENS_PUZZLES[0];
	}, [initialDifficulty, initialPuzzleId]);

	const [puzzle, setPuzzle] = useState<QueensPuzzle>(initialPuzzle);
	const [board, setBoard] = useState<CellState[][]>(() => createEmptyBoard(initialPuzzle.size));
	const [focusedCell, setFocusedCell] = useState<CellCoord | null>({ row: 0, col: 0 });
	const [inputMode, setInputMode] = useState<InputMode>('mark');
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [history, setHistory] = useState<MoveAction[]>([]);
	const [redoStack, setRedoStack] = useState<MoveAction[]>([]);
	const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [isLoaded, setIsLoaded] = useState(false);

	// Drag state
	const isDraggingRef = useRef(false);
	const dragVisitedRef = useRef<Set<string>>(new Set());
	const dragBatchRef = useRef<{ row: number; col: number; prev: CellState; next: CellState }[]>([]);

	// Refs for latest state access in async/interval loops
	const boardRef = useRef(board);
	boardRef.current = board;

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const historyRef = useRef(history);
	historyRef.current = history;

	const redoRef = useRef(redoStack);
	redoRef.current = redoStack;

	const isCompleteRef = useRef(isComplete);
	isCompleteRef.current = isComplete;

	const isPausedRef = useRef(isPaused);
	isPausedRef.current = isPaused;

	// Round context tracking for @arcade/lib-medals
	const xMarkersPlacedRef = useRef(0);
	const xMarkersBeforeFirstCrownRef = useRef(0);
	const hasPlacedFirstCrownRef = useRef(false);
	const crownCollisionsTriggeredRef = useRef(0);
	const crownsRemovedCountRef = useRef(0);
	const cellCrownRemovalsRef = useRef<Record<string, number>>({});
	const maxSimultaneousConflictsRef = useRef(0);
	const hasRecordedResultRef = useRef(false);

	const getMaxSameCellCrownToggles = useCallback(() => {
		const vals = Object.values(cellCrownRemovalsRef.current);
		return vals.length > 0 ? Math.max(...vals) : 0;
	}, []);

	const resetRoundContext = useCallback(() => {
		xMarkersPlacedRef.current = 0;
		xMarkersBeforeFirstCrownRef.current = 0;
		hasPlacedFirstCrownRef.current = false;
		crownCollisionsTriggeredRef.current = 0;
		crownsRemovedCountRef.current = 0;
		cellCrownRemovalsRef.current = {};
		maxSimultaneousConflictsRef.current = 0;
		hasRecordedResultRef.current = false;
	}, []);

	const recordSurrender = useCallback(
		(finalSeconds: number) => {
			if (hasRecordedResultRef.current || isCompleteRef.current) return;
			hasRecordedResultRef.current = true;

			const curPuzzle = puzzleRef.current;
			const curBoard = boardRef.current;
			let placedCrowns = 0;
			for (let r = 0; r < curPuzzle.size; r++) {
				for (let c = 0; c < curPuzzle.size; c++) {
					if (curBoard[r]?.[c] === 'token') {
						placedCrowns++;
					}
				}
			}

			const levelKey = curPuzzle.difficulty;
			const sizeKey = `${curPuzzle.size}x${curPuzzle.size}`;

			void recordGameResult(
				{
					gameId: 'queens',
					won: false,
					playTimeSeconds: finalSeconds,
					levelKey,
					sizeKey,
					roundContext: {
						xMarkersPlaced: xMarkersPlacedRef.current,
						xMarkersBeforeFirstCrown: xMarkersBeforeFirstCrownRef.current,
						crownCollisionsTriggered: crownCollisionsTriggeredRef.current,
						crownsRemovedCount: crownsRemovedCountRef.current,
						maxSameCellCrownToggles: getMaxSameCellCrownToggles(),
						maxSimultaneousConflicts: maxSimultaneousConflictsRef.current,
						crownsPlacedBeforeSurrender: placedCrowns,
						completedPresetId: undefined,
						gridSize: curPuzzle.size,
						difficulty: levelKey,
						size: sizeKey,
					},
				},
				{ definitions: QUEENS_MEDAL_DEFINITIONS },
			).catch((error) => {
				console.warn('[@arcade/queens] Failed to record surrender medals result:', error);
			});
		},
		[getMaxSameCellCrownToggles],
	);

	useEffect(() => {
		return () => {
			if (
				!isCompleteRef.current &&
				!hasRecordedResultRef.current &&
				(elapsedRef.current > 0 || historyRef.current.length > 0)
			) {
				recordSurrender(elapsedRef.current);
			}
		};
	}, [recordSurrender]);

	// Load storage and query params on mount
	useEffect(() => {
		async function init() {
			try {
				const savedSettings = await loadSettings();
				setSettings(savedSettings);
				setInputMode(savedSettings.defaultMode);

				const savedProgress = await loadProgress();
				setProgress(savedProgress);

				let requestedPuzzle = initialPuzzle;
				let forceNew = false;
				let forceResume = false;

				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					const queryPuzzle = params.get('puzzle');
					const queryDiff = params.get('difficulty') as Difficulty | null;

					let isRandom = false;
					if (queryPuzzle) {
						const found = getPuzzleById(queryPuzzle);
						if (found) requestedPuzzle = found;
					} else if (
						params.get('random') === 'true' ||
						params.get('procedural') === 'true' ||
						params.get('new') === 'true'
					) {
						isRandom = true;
						const targetDiff =
							queryDiff && ['easy', 'medium', 'hard', 'expert'].includes(queryDiff)
								? queryDiff
								: initialDifficulty;
						requestedPuzzle = generateQueensPuzzle(targetDiff);
					} else if (queryDiff && ['easy', 'medium', 'hard', 'expert'].includes(queryDiff)) {
						const list = getPuzzlesByDifficulty(queryDiff);
						if (list.length > 0) requestedPuzzle = list[0];
					}

					if (params.get('new') === 'true') forceNew = true;
					if (params.get('resume') === 'true') forceResume = true;
				}

				const activeGame = await loadActiveGame();
				if (
					!forceNew &&
					activeGame &&
					!activeGame.isComplete &&
					(forceResume || activeGame.puzzleId === requestedPuzzle.id)
				) {
					const loadedPuzzle =
						activeGame.puzzleDefinition || getPuzzleById(activeGame.puzzleId) || requestedPuzzle;
					setPuzzle(loadedPuzzle);
					setBoard(activeGame.board);
					setElapsedSeconds(activeGame.elapsedSeconds);
					setHistory(activeGame.history || []);
					setRedoStack(activeGame.redoStack || []);
					setInputMode(activeGame.inputMode || 'mark');
					setIsPaused(true); // Resume paused
				} else {
					setPuzzle(requestedPuzzle);
					setBoard(createEmptyBoard(requestedPuzzle.size));
					setElapsedSeconds(0);
					setHistory([]);
					setRedoStack([]);
				}
			} catch {
				setPuzzle(initialPuzzle);
				setBoard(createEmptyBoard(initialPuzzle.size));
			} finally {
				setIsLoaded(true);
			}
		}

		init();
	}, [initialPuzzle, initialDifficulty]);

	// Timer interval
	useEffect(() => {
		if (!isLoaded || isPaused || isComplete) return;

		const timer = setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [isLoaded, isPaused, isComplete]);

	// Auto-save active game snapshot on board or history changes
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		saveActiveGame({
			puzzleId: puzzle.id,
			difficulty: puzzle.difficulty,
			size: puzzle.size,
			board,
			elapsedSeconds,
			history,
			redoStack,
			isComplete: false,
			inputMode,
			puzzleDefinition: puzzle,
		});
	}, [isLoaded, isComplete, puzzle, board, elapsedSeconds, history, redoStack, inputMode]);

	// Compute rule conflicts
	const conflicts = useMemo(() => {
		return getConflicts(board, puzzle.regions, puzzle.size);
	}, [board, puzzle.regions, puzzle.size]);

	useEffect(() => {
		if (conflicts.size > maxSimultaneousConflictsRef.current) {
			maxSimultaneousConflictsRef.current = conflicts.size;
		}
	}, [conflicts]);

	// Token count
	const tokenCount = useMemo(() => {
		let count = 0;
		for (let r = 0; r < puzzle.size; r++) {
			for (let c = 0; c < puzzle.size; c++) {
				if (board[r]?.[c] === 'token') count++;
			}
		}
		return count;
	}, [board, puzzle.size]);

	// Win condition verification
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		if (isBoardSolved(board, puzzle.regions, puzzle.size)) {
			setIsComplete(true);
			setIsPaused(true);
			hasRecordedResultRef.current = true;
			clearActiveGame();

			const levelKey = puzzle.difficulty;
			const sizeKey = `${puzzle.size}x${puzzle.size}`;
			const isCurated = !puzzle.id.startsWith('procedural-');
			const completedPresetId = isCurated ? puzzle.id : undefined;

			void recordGameResult(
				{
					gameId: 'queens',
					won: true,
					playTimeSeconds: elapsedSeconds,
					levelKey,
					sizeKey,
					roundContext: {
						xMarkersPlaced: xMarkersPlacedRef.current,
						xMarkersBeforeFirstCrown: xMarkersBeforeFirstCrownRef.current,
						crownCollisionsTriggered: crownCollisionsTriggeredRef.current,
						crownsRemovedCount: crownsRemovedCountRef.current,
						maxSameCellCrownToggles: getMaxSameCellCrownToggles(),
						maxSimultaneousConflicts: maxSimultaneousConflictsRef.current,
						crownsPlacedBeforeSurrender: 0,
						completedPresetId,
						gridSize: puzzle.size,
						difficulty: levelKey,
						size: sizeKey,
					},
				},
				{ definitions: QUEENS_MEDAL_DEFINITIONS },
			).catch((error) => {
				console.warn('[@arcade/queens] Failed to record victory medals result:', error);
			});

			if (isCurated) {
				recordPuzzleCompletion(puzzle.id, elapsedSeconds).then(({ isNewBestTime: isBest }) => {
					setIsNewBestTime(isBest);
					loadProgress().then(setProgress);
					setIsVictoryOpen(true);
				});
			} else {
				setIsVictoryOpen(true);
			}
		}
	}, [
		board,
		puzzle.regions,
		puzzle.size,
		puzzle.difficulty,
		puzzle.id,
		isLoaded,
		isComplete,
		elapsedSeconds,
		getMaxSameCellCrownToggles,
	]);

	// Cell toggle actions
	const setCellAction = useCallback(
		(row: number, col: number, nextState: CellState) => {
			if (isComplete || isPaused) return;

			setBoard((prev) => {
				const current = prev[row]?.[col] ?? 'empty';
				if (current === nextState) return prev;

				const nextBoard = cloneBoard(prev);
				nextBoard[row][col] = nextState;

				if (current === 'token' && nextState !== 'token') {
					crownsRemovedCountRef.current += 1;
					const cellKey = `${row},${col}`;
					cellCrownRemovalsRef.current[cellKey] = (cellCrownRemovalsRef.current[cellKey] ?? 0) + 1;
				}

				if (nextState === 'token') {
					hasPlacedFirstCrownRef.current = true;
					const tempBoard = cloneBoard(prev);
					tempBoard[row][col] = 'token';
					const confs = getConflicts(tempBoard, puzzleRef.current.regions, puzzleRef.current.size);
					if (confs.has(`${row},${col}`)) {
						crownCollisionsTriggeredRef.current += 1;
					}
					if (confs.size > maxSimultaneousConflictsRef.current) {
						maxSimultaneousConflictsRef.current = confs.size;
					}
				}

				if (nextState === 'mark') {
					xMarkersPlacedRef.current += 1;
					if (!hasPlacedFirstCrownRef.current) {
						xMarkersBeforeFirstCrownRef.current += 1;
					}
				}

				let autoCrossed: { row: number; col: number; prev: CellState }[] | undefined;

				// If placing a token and autoCross is enabled:
				if (nextState === 'token' && settingsRef.current.autoCross) {
					const targets = getAutoCrossCells(prev, row, col, puzzleRef.current.size);
					if (targets.length > 0) {
						autoCrossed = targets.map((t) => ({ ...t }));
						for (const target of targets) {
							nextBoard[target.row][target.col] = 'mark';
							xMarkersPlacedRef.current += 1;
							if (!hasPlacedFirstCrownRef.current) {
								xMarkersBeforeFirstCrownRef.current += 1;
							}
						}
					}
				}

				const action: MoveAction = {
					type: 'setCell',
					row,
					col,
					prev: current,
					next: nextState,
					autoCrossed,
				};

				setHistory((h) => [...h, action]);
				setRedoStack([]);

				return nextBoard;
			});
		},
		[isComplete, isPaused],
	);

	// Primary single tap/click
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (isComplete || isPaused) return;
			setFocusedCell({ row, col });

			const current = boardRef.current[row]?.[col] ?? 'empty';

			if (inputMode === 'mark') {
				// Mark mode: empty -> mark -> empty. Token -> empty.
				const nextState: CellState = current === 'empty' ? 'mark' : 'empty';
				setCellAction(row, col, nextState);
			} else {
				// Token mode: empty or mark -> token. Token -> empty.
				const nextState: CellState = current === 'token' ? 'empty' : 'token';
				setCellAction(row, col, nextState);
			}
		},
		[inputMode, isComplete, isPaused, setCellAction],
	);

	// Double click / secondary click: directly toggles token
	const handleCellDoubleClick = useCallback(
		(row: number, col: number) => {
			if (isComplete || isPaused) return;
			setFocusedCell({ row, col });

			const current = boardRef.current[row]?.[col] ?? 'empty';
			const nextState: CellState = current === 'token' ? 'empty' : 'token';
			setCellAction(row, col, nextState);
		},
		[isComplete, isPaused, setCellAction],
	);

	const handleCellContextMenu = useCallback(
		(row: number, col: number, e: MouseEvent) => {
			e.preventDefault();
			if (isComplete || isPaused) return;
			setFocusedCell({ row, col });

			const current = boardRef.current[row]?.[col] ?? 'empty';
			const nextState: CellState = current === 'token' ? 'empty' : 'token';
			setCellAction(row, col, nextState);
		},
		[isComplete, isPaused, setCellAction],
	);

	// Dragging across multiple cells to bulk-place marks
	const handleDragStart = useCallback(
		(row: number, col: number, _e: PointerEvent) => {
			if (isComplete || isPaused) return;

			isDraggingRef.current = true;
			dragVisitedRef.current = new Set([`${row},${col}`]);
			dragBatchRef.current = [];
		},
		[isComplete, isPaused],
	);

	const handleDragEnter = useCallback(
		(row: number, col: number, _e: PointerEvent) => {
			if (!isDraggingRef.current || isComplete || isPaused) return;

			const key = `${row},${col}`;
			if (dragVisitedRef.current.has(key)) return;
			dragVisitedRef.current.add(key);

			const current = boardRef.current[row]?.[col];
			if (current === 'empty') {
				xMarkersPlacedRef.current += 1;
				if (!hasPlacedFirstCrownRef.current) {
					xMarkersBeforeFirstCrownRef.current += 1;
				}

				// Bulk-place mark (X) on empty cell
				dragBatchRef.current.push({
					row,
					col,
					prev: 'empty',
					next: 'mark',
				});

				setBoard((prev) => {
					const next = cloneBoard(prev);
					next[row][col] = 'mark';
					return next;
				});
			}
		},
		[isComplete, isPaused],
	);

	const handleDragEnd = useCallback((_e: PointerEvent) => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;

		if (dragBatchRef.current.length > 0) {
			const action: MoveAction = {
				type: 'dragBatch',
				cells: [...dragBatchRef.current],
			};
			setHistory((h) => [...h, action]);
			setRedoStack([]);
			dragBatchRef.current = [];
		}
	}, []);

	// Cell focus handler
	const handleCellFocus = useCallback((row: number, col: number) => {
		setFocusedCell({ row, col });
	}, []);

	// Undo
	const handleUndo = useCallback(() => {
		if (isComplete || isPaused) return;

		setHistory((prevHistory) => {
			if (prevHistory.length === 0) return prevHistory;

			const actionToUndo = prevHistory[prevHistory.length - 1];
			const newHistory = prevHistory.slice(0, -1);

			setBoard((curBoard) => {
				const nextBoard = cloneBoard(curBoard);
				switch (actionToUndo.type) {
					case 'setCell': {
						if (actionToUndo.next === 'token' && actionToUndo.prev !== 'token') {
							crownsRemovedCountRef.current += 1;
							const cellKey = `${actionToUndo.row},${actionToUndo.col}`;
							cellCrownRemovalsRef.current[cellKey] = (cellCrownRemovalsRef.current[cellKey] ?? 0) + 1;
						}
						nextBoard[actionToUndo.row][actionToUndo.col] = actionToUndo.prev;
						if (actionToUndo.autoCrossed) {
							for (const item of actionToUndo.autoCrossed) {
								nextBoard[item.row][item.col] = item.prev;
							}
						}
						break;
					}
					case 'dragBatch': {
						for (const item of actionToUndo.cells) {
							nextBoard[item.row][item.col] = item.prev;
						}
						break;
					}
					case 'reset': {
						return cloneBoard(actionToUndo.board);
					}
				}
				return nextBoard;
			});

			setRedoStack((prevRedo) => [...prevRedo, actionToUndo]);
			return newHistory;
		});
	}, [isComplete, isPaused]);

	// Redo
	const handleRedo = useCallback(() => {
		if (isComplete || isPaused) return;

		setRedoStack((prevRedo) => {
			if (prevRedo.length === 0) return prevRedo;

			const actionToRedo = prevRedo[prevRedo.length - 1];
			const newRedo = prevRedo.slice(0, -1);

			setBoard((curBoard) => {
				const nextBoard = cloneBoard(curBoard);
				switch (actionToRedo.type) {
					case 'setCell': {
						nextBoard[actionToRedo.row][actionToRedo.col] = actionToRedo.next;
						if (actionToRedo.autoCrossed) {
							for (const item of actionToRedo.autoCrossed) {
								nextBoard[item.row][item.col] = 'mark';
							}
						}
						break;
					}
					case 'dragBatch': {
						for (const item of actionToRedo.cells) {
							nextBoard[item.row][item.col] = item.next;
						}
						break;
					}
					case 'reset': {
						for (let r = 0; r < nextBoard.length; r++) {
							for (let c = 0; c < nextBoard[r].length; c++) {
								nextBoard[r][c] = 'empty';
							}
						}
						break;
					}
				}
				return nextBoard;
			});

			setHistory((prevHistory) => [...prevHistory, actionToRedo]);
			return newRedo;
		});
	}, [isComplete, isPaused]);

	// Reset board
	const handleReset = useCallback(() => {
		if (isComplete || isPaused) return;

		const current = boardRef.current;
		let hasAnyPlaced = false;
		for (let r = 0; r < current.length; r++) {
			for (let c = 0; c < current[r].length; c++) {
				if (current[r][c] !== 'empty') {
					hasAnyPlaced = true;
					break;
				}
			}
			if (hasAnyPlaced) break;
		}

		if (!hasAnyPlaced) return;

		for (let r = 0; r < current.length; r++) {
			for (let c = 0; c < current[r].length; c++) {
				if (current[r][c] === 'token') {
					crownsRemovedCountRef.current += 1;
					const cellKey = `${r},${c}`;
					cellCrownRemovalsRef.current[cellKey] = (cellCrownRemovalsRef.current[cellKey] ?? 0) + 1;
				}
			}
		}

		const resetAction: MoveAction = {
			type: 'reset',
			board: cloneBoard(current),
		};

		setHistory((h) => [...h, resetAction]);
		setRedoStack([]);
		setBoard(createEmptyBoard(puzzle.size));
	}, [isComplete, isPaused, puzzle.size]);

	// Toggle pause
	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	// Keyboard navigation & shortcuts
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isComplete || isPaused) return;

			const currentFocus = focusedCell || { row: 0, col: 0 };
			const size = puzzle.size;

			switch (e.key) {
				case 'ArrowUp': {
					e.preventDefault();
					setFocusedCell({ row: Math.max(0, currentFocus.row - 1), col: currentFocus.col });
					break;
				}
				case 'ArrowDown': {
					e.preventDefault();
					setFocusedCell({ row: Math.min(size - 1, currentFocus.row + 1), col: currentFocus.col });
					break;
				}
				case 'ArrowLeft': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: Math.max(0, currentFocus.col - 1) });
					break;
				}
				case 'ArrowRight': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: Math.min(size - 1, currentFocus.col + 1) });
					break;
				}
				case 'Home': {
					e.preventDefault();
					if (e.ctrlKey || e.metaKey) {
						setFocusedCell({ row: 0, col: 0 });
					} else {
						setFocusedCell({ row: currentFocus.row, col: 0 });
					}
					break;
				}
				case 'End': {
					e.preventDefault();
					if (e.ctrlKey || e.metaKey) {
						setFocusedCell({ row: size - 1, col: size - 1 });
					} else {
						setFocusedCell({ row: currentFocus.row, col: size - 1 });
					}
					break;
				}
				case 'PageUp': {
					e.preventDefault();
					setFocusedCell({ row: 0, col: currentFocus.col });
					break;
				}
				case 'PageDown': {
					e.preventDefault();
					setFocusedCell({ row: size - 1, col: currentFocus.col });
					break;
				}
				case ' ':
				case 'Enter': {
					e.preventDefault();
					handleCellClick(currentFocus.row, currentFocus.col);
					break;
				}
				case 'c':
				case 'C':
				case 'q':
				case 'Q': {
					e.preventDefault();
					// Direct crown toggle
					const current = boardRef.current[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					setCellAction(currentFocus.row, currentFocus.col, current === 'token' ? 'empty' : 'token');
					break;
				}
				case 'x':
				case 'X':
				case 'm':
				case 'M': {
					e.preventDefault();
					// Direct mark toggle
					const current = boardRef.current[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					setCellAction(currentFocus.row, currentFocus.col, current === 'mark' ? 'empty' : 'mark');
					break;
				}
				case 'Backspace':
				case 'Delete': {
					e.preventDefault();
					setCellAction(currentFocus.row, currentFocus.col, 'empty');
					break;
				}
				case 'u':
				case 'U': {
					e.preventDefault();
					handleUndo();
					break;
				}
				case 'z':
				case 'Z': {
					if (e.ctrlKey || e.metaKey || !e.shiftKey) {
						e.preventDefault();
						if (e.shiftKey) {
							handleRedo();
						} else {
							handleUndo();
						}
					}
					break;
				}
				case 'y':
				case 'Y': {
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						handleRedo();
					}
					break;
				}
				case 'r':
				case 'R': {
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						handleRedo();
					}
					break;
				}
				case 'Escape':
				case 'p':
				case 'P': {
					e.preventDefault();
					handleTogglePause();
					break;
				}
			}
		},
		[
			isComplete,
			isPaused,
			focusedCell,
			puzzle.size,
			handleCellClick,
			setCellAction,
			handleUndo,
			handleRedo,
			handleTogglePause,
		],
	);

	// Update settings
	const handleUpdateSettings = useCallback(async (newSettings: GameSettings) => {
		setSettings(newSettings);
		await saveSettings(newSettings);
	}, []);

	// Select / start a specific puzzle
	const handleSelectPuzzle = useCallback(
		(newPuzzle: QueensPuzzle) => {
			if (
				!isCompleteRef.current &&
				!hasRecordedResultRef.current &&
				(elapsedRef.current > 0 || historyRef.current.length > 0)
			) {
				recordSurrender(elapsedRef.current);
			}
			resetRoundContext();
			setPuzzle(newPuzzle);
			setBoard(createEmptyBoard(newPuzzle.size));
			setFocusedCell({ row: 0, col: 0 });
			setElapsedSeconds(0);
			setHistory([]);
			setRedoStack([]);
			setIsComplete(false);
			setIsPaused(false);
			setIsVictoryOpen(false);
		},
		[recordSurrender, resetRoundContext],
	);

	// Next puzzle handler
	const handleNextPuzzle = useCallback(() => {
		const next = getNextPuzzle(puzzle.id);
		if (next) {
			handleSelectPuzzle(next);
			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.searchParams.set('puzzle', next.id);
				window.history.replaceState(null, '', url.toString());
			}
		}
	}, [puzzle.id, handleSelectPuzzle]);

	// Play again (restart current puzzle)
	const handlePlayAgain = useCallback(() => {
		handleSelectPuzzle(puzzle);
	}, [puzzle, handleSelectPuzzle]);

	return {
		puzzle,
		board,
		conflicts,
		tokenCount,
		focusedCell,
		inputMode,
		elapsedSeconds,
		isPaused,
		isComplete,
		isVictoryOpen,
		isSettingsOpen,
		isNewBestTime,
		settings,
		progress,
		canUndo: history.length > 0,
		canRedo: redoStack.length > 0,
		hasNextPuzzle: !!getNextPuzzle(puzzle.id),
		setInputMode,
		setSettings,
		openSettings: () => {
			setIsPaused(true);
			setIsSettingsOpen(true);
		},
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		handleCellClick,
		handleCellDoubleClick,
		handleCellContextMenu,
		handleCellFocus,
		handleDragStart,
		handleDragEnter,
		handleDragEnd,
		handleKeyDown,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		handleUpdateSettings,
		handleSelectPuzzle,
		handleNextPuzzle,
		handlePlayAgain,
	};
}
