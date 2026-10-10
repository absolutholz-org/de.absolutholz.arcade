import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { getAutoCrossCells } from '../../engine/autoCross';
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

					if (queryPuzzle) {
						const found = getPuzzleById(queryPuzzle);
						if (found) requestedPuzzle = found;
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
					const loadedPuzzle = getPuzzleById(activeGame.puzzleId) || requestedPuzzle;
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
	}, [initialPuzzle]);

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
		});
	}, [
		isLoaded,
		isComplete,
		puzzle.id,
		puzzle.difficulty,
		puzzle.size,
		board,
		elapsedSeconds,
		history,
		redoStack,
		inputMode,
	]);

	// Compute rule conflicts
	const conflicts = useMemo(() => {
		return getConflicts(board, puzzle.regions, puzzle.size);
	}, [board, puzzle.regions, puzzle.size]);

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
			clearActiveGame();

			recordPuzzleCompletion(puzzle.id, elapsedSeconds).then(({ isNewBestTime: isBest }) => {
				setIsNewBestTime(isBest);
				loadProgress().then(setProgress);
				setIsVictoryOpen(true);
			});
		}
	}, [board, puzzle.regions, puzzle.size, isLoaded, isComplete, puzzle.id, elapsedSeconds]);

	// Cell toggle actions
	const setCellAction = useCallback(
		(row: number, col: number, nextState: CellState) => {
			if (isComplete || isPaused) return;

			setBoard((prev) => {
				const current = prev[row]?.[col] ?? 'empty';
				if (current === nextState) return prev;

				const nextBoard = cloneBoard(prev);
				nextBoard[row][col] = nextState;

				let autoCrossed: { row: number; col: number; prev: CellState }[] | undefined;

				// If placing a token and autoCross is enabled:
				if (nextState === 'token' && settingsRef.current.autoCross) {
					const targets = getAutoCrossCells(prev, row, col, puzzleRef.current.size);
					if (targets.length > 0) {
						autoCrossed = targets.map((t) => ({ ...t }));
						for (const target of targets) {
							nextBoard[target.row][target.col] = 'mark';
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
			}
		},
		[isComplete, isPaused, focusedCell, puzzle.size, handleCellClick, setCellAction],
	);

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

	// Toggle auto-cross helper
	const handleToggleAutoCross = useCallback(() => {
		setSettings((prev) => {
			const next = { ...prev, autoCross: !prev.autoCross };
			saveSettings(next);
			return next;
		});
	}, []);

	// Select / start a specific puzzle
	const handleSelectPuzzle = useCallback((newPuzzle: QueensPuzzle) => {
		setPuzzle(newPuzzle);
		setBoard(createEmptyBoard(newPuzzle.size));
		setFocusedCell({ row: 0, col: 0 });
		setElapsedSeconds(0);
		setHistory([]);
		setRedoStack([]);
		setIsComplete(false);
		setIsPaused(false);
		setIsVictoryOpen(false);
	}, []);

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
		handleDragStart,
		handleDragEnter,
		handleDragEnd,
		handleKeyDown,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		handleToggleAutoCross,
		handleSelectPuzzle,
		handleNextPuzzle,
		handlePlayAgain,
	};
}
