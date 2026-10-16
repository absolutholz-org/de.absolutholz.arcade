import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { generateTracksPuzzle } from '../../engine/generator.js';
import {
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	cloneBoardState,
	createHistory,
	pushState,
	redo,
	reset,
	undo,
} from '../../engine/history.js';
import { createBoardFromPuzzle, getNextPuzzle, getPuzzleById, getPuzzlesByDifficulty } from '../../engine/puzzles.js';
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
	type HistoryState,
	type InputMode,
	MAX_MISTAKES,
	type ProgressMap,
	type StaticPuzzleDefinition,
	type TracksSettings,
} from '../../engine/types.js';
import {
	ALL_TRACK_TYPES,
	applyDragStep,
	autoOrientBoardTracks,
	evaluateBoard,
	evaluateLines,
	getFixedCell,
	inferCellTrackType,
	isTrackType,
} from '../../engine/validator.js';

function unwrapPuzzle(
	found: StaticPuzzleDefinition | { puzzle: StaticPuzzleDefinition; difficulty?: DifficultyLevel } | undefined,
): StaticPuzzleDefinition | undefined {
	if (!found) return undefined;
	return 'puzzle' in found ? found.puzzle : found;
}

function buildBoard(puzzle: StaticPuzzleDefinition): BoardState {
	return createBoardFromPuzzle(puzzle, puzzle.difficulty);
}

function resolveInitialPuzzle(initialDifficulty: DifficultyLevel, initialPuzzleId?: string): StaticPuzzleDefinition {
	let diff: DifficultyLevel = initialDifficulty;

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const queryDiff = params.get('difficulty') as DifficultyLevel | null;
		const queryPuzzle = params.get('puzzle');
		const isRandom = params.get('random') === 'true' || params.get('procedural') === 'true';

		if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
			diff = queryDiff;
		}

		if (queryPuzzle) {
			const found = unwrapPuzzle(getPuzzleById(queryPuzzle));
			if (found) return found;
		} else if (isRandom || params.get('new') === 'true') {
			try {
				const size = DIFFICULTY_GRID_SIZES[diff].width;
				return generateTracksPuzzle(size, diff);
			} catch {
				// Fallback to static if generation fails
			}
		}
	}

	if (initialPuzzleId) {
		const found = unwrapPuzzle(getPuzzleById(initialPuzzleId));
		if (found) return found;
	}

	const list = getPuzzlesByDifficulty(diff);
	return list[0] ?? getPuzzlesByDifficulty('easy')[0];
}

function fillSatisfiedLinesWithCross(
	state: BoardState,
	targetLine?: { axis: 'row' | 'col'; index: number },
): BoardState {
	const lineEvals = evaluateLines(state);
	const next = cloneBoardState(state);
	let changed = false;

	if (targetLine) {
		if (targetLine.axis === 'row') {
			const r = targetLine.index;
			if (lineEvals.rows[r]?.status === 'satisfied') {
				for (let c = 0; c < next.size; c++) {
					if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
						next.grid[r][c] = 'cross';
						changed = true;
					}
				}
			}
		} else {
			const c = targetLine.index;
			if (lineEvals.cols[c]?.status === 'satisfied') {
				for (let r = 0; r < next.size; r++) {
					if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
						next.grid[r][c] = 'cross';
						changed = true;
					}
				}
			}
		}
		return changed ? next : state;
	}

	for (let r = 0; r < next.size; r++) {
		if (lineEvals.rows[r]?.status === 'satisfied') {
			for (let c = 0; c < next.size; c++) {
				if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
					next.grid[r][c] = 'cross';
					changed = true;
				}
			}
		}
	}

	for (let c = 0; c < next.size; c++) {
		if (lineEvals.cols[c]?.status === 'satisfied') {
			for (let r = 0; r < next.size; r++) {
				if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
					next.grid[r][c] = 'cross';
					changed = true;
				}
			}
		}
	}

	return changed ? next : state;
}

function didCauseNewOverflow(prevBoard: BoardState, nextBoard: BoardState): boolean {
	const prevLines = evaluateLines(prevBoard);
	const nextLines = evaluateLines(nextBoard);

	for (let r = 0; r < nextBoard.size; r++) {
		if (nextLines.rows[r]?.status === 'overflow' && prevLines.rows[r]?.status !== 'overflow') {
			return true;
		}
	}

	for (let c = 0; c < nextBoard.size; c++) {
		if (nextLines.cols[c]?.status === 'overflow' && prevLines.cols[c]?.status !== 'overflow') {
			return true;
		}
	}

	return false;
}

export function useTracksGame(initialDifficulty: DifficultyLevel = 'easy', initialPuzzleId?: string) {
	const initialPuzzle = useMemo(
		() => resolveInitialPuzzle(initialDifficulty, initialPuzzleId),
		[initialDifficulty, initialPuzzleId],
	);

	const [puzzle, setPuzzle] = useState<StaticPuzzleDefinition>(initialPuzzle);
	const [board, setBoard] = useState<BoardState>(() => buildBoard(initialPuzzle));
	const [history, setHistory] = useState<HistoryState>(() => createHistory(buildBoard(initialPuzzle)));
	const [inputMode, setInputMode] = useState<InputMode>('track');
	const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>({
		row: 0,
		col: 0,
	});
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [movesCount, setMovesCount] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [settings, setSettings] = useState<TracksSettings>(DEFAULT_SETTINGS);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [isLoaded, setIsLoaded] = useState(false);

	// Refs for latest state in event callbacks
	const boardRef = useRef(board);
	boardRef.current = board;

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const movesRef = useRef(movesCount);
	movesRef.current = movesCount;

	// Drag tracking refs
	const isDraggingRef = useRef(false);
	const lastDragCellRef = useRef<{ row: number; col: number } | null>(null);
	const dragMovedRef = useRef(false);
	const dragStartBoardRef = useRef<BoardState>(board);
	const victoryTimerRef = useRef<number | null>(null);

	// Load saved settings, progress, and active game on mount
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

				const requestedPuzzle = resolveInitialPuzzle(initialDifficulty, initialPuzzleId);
				let forceNew = false;
				let forceResume = false;

				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					if (params.get('new') === 'true') forceNew = true;
					if (params.get('resume') === 'true') forceResume = true;
				}

				if (
					!forceNew &&
					savedGame &&
					!savedGame.isComplete &&
					(forceResume || savedGame.puzzleId === requestedPuzzle.id)
				) {
					const restoredPuzzle =
						savedGame.puzzleDefinition ??
						unwrapPuzzle(getPuzzleById(savedGame.puzzleId)) ??
						requestedPuzzle;
					const baseBoard = buildBoard(restoredPuzzle);
					const restoredBoard: BoardState = {
						...baseBoard,
						grid: savedGame.grid,
					};
					setPuzzle(restoredPuzzle);
					setBoard(restoredBoard);
					setHistory(createHistory(restoredBoard));
					setElapsedSeconds(savedGame.elapsedSeconds ?? 0);
					setMovesCount(savedGame.movesCount ?? 0);
					setMistakes(savedGame.mistakes ?? 0);
					setIsPaused(true);
				} else {
					const freshBoard = buildBoard(requestedPuzzle);
					setPuzzle(requestedPuzzle);
					setBoard(freshBoard);
					setHistory(createHistory(freshBoard));
					setElapsedSeconds(0);
					setMovesCount(0);
					setMistakes(0);
					setIsPaused(false);
				}
			} catch {
				const fallbackBoard = buildBoard(initialPuzzle);
				setPuzzle(initialPuzzle);
				setBoard(fallbackBoard);
				setHistory(createHistory(fallbackBoard));
			} finally {
				setIsLoaded(true);
			}
		}

		init();

		return () => {
			if (victoryTimerRef.current !== null) {
				window.clearTimeout(victoryTimerRef.current);
			}
		};
	}, [initialDifficulty, initialPuzzle, initialPuzzleId]);

	// Timer ticker
	useEffect(() => {
		if (!isLoaded || isPaused || isComplete || settings.gameMode === 'casual') {
			return;
		}

		const timer = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => window.clearInterval(timer);
	}, [isLoaded, isPaused, isComplete, settings.gameMode]);

	// Auto-save active game state
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		saveActiveGame({
			puzzleId: puzzle.id,
			difficulty: puzzle.difficulty,
			grid: board.grid,
			elapsedSeconds,
			movesCount,
			mistakes,
			isComplete: false,
			lastPlayed: Date.now(),
			puzzleDefinition: puzzle,
		});
	}, [isLoaded, isComplete, puzzle, board.grid, elapsedSeconds, movesCount, mistakes]);

	// Evaluate current board
	const evaluation = useMemo(() => evaluateBoard(board), [board]);

	// Commit a board state transition (updates history, moves, mistakes, and checks victory)
	const commitBoardMove = useCallback((prevBoard: BoardState, candidateBoard: BoardState) => {
		const finalBoard = settingsRef.current.autoCross ? fillSatisfiedLinesWithCross(candidateBoard) : candidateBoard;

		const nextMoves = movesRef.current + 1;
		movesRef.current = nextMoves;
		setMovesCount(nextMoves);

		if (settingsRef.current.gameMode === 'standard' && didCauseNewOverflow(prevBoard, finalBoard)) {
			setMistakes((m) => Math.min(MAX_MISTAKES, m + 1));
		}

		boardRef.current = finalBoard;
		setBoard(finalBoard);
		setHistory((h) => pushState(h, finalBoard));

		const nextEval = evaluateBoard(finalBoard);
		if (nextEval.isComplete) {
			setIsComplete(true);
			clearActiveGame();

			const isProcedural =
				puzzleRef.current.id.startsWith('procedural-') || puzzleRef.current.id.startsWith('generated-');
			if (!isProcedural) {
				const recordFn = recordPuzzleCompletion as (
					id: string,
					sec: number,
					moves?: number,
				) => Promise<{ isNewBestTime: boolean }>;

				recordFn(puzzleRef.current.id, elapsedRef.current, nextMoves).then((res) => {
					setIsNewBestTime(res.isNewBestTime);
					loadProgress().then(setProgress);
				});
			}

			if (victoryTimerRef.current !== null) {
				window.clearTimeout(victoryTimerRef.current);
			}
			victoryTimerRef.current = window.setTimeout(() => {
				setIsVictoryOpen(true);
			}, 1200);
		}
	}, []);

	// Primary cell click/tap
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (isComplete || isPaused) return;
			if (dragMovedRef.current) {
				dragMovedRef.current = false;
				return;
			}

			setFocusedCell({ row, col });
			const curBoard = boardRef.current;
			if (getFixedCell(curBoard, row, col)) return;

			const current = curBoard.grid[row]?.[col] ?? 'empty';
			const nextBoard = cloneBoardState(curBoard);

			if (inputMode === 'track') {
				if (current === 'empty' || current === 'candidate') {
					const inferred = inferCellTrackType(curBoard, row, col) ?? 'straight-h';
					nextBoard.grid[row][col] = inferred;
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				} else if (isTrackType(current)) {
					nextBoard.grid[row][col] = 'cross';
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				} else {
					nextBoard.grid[row][col] = 'empty';
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				}
			} else {
				const nextState = current === 'cross' ? 'empty' : 'cross';
				if (current === nextState) return;
				nextBoard.grid[row][col] = nextState;
				const oriented = autoOrientBoardTracks(nextBoard);
				commitBoardMove(curBoard, oriented);
			}
		},
		[inputMode, isComplete, isPaused, commitBoardMove],
	);

	// Right-click / context menu: quickly toggle 'cross' (X)
	const handleCellContextMenu = useCallback(
		(row: number, col: number, e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (isComplete || isPaused) return;

			setFocusedCell({ row, col });
			const curBoard = boardRef.current;
			if (getFixedCell(curBoard, row, col)) return;

			const current = curBoard.grid[row]?.[col] ?? 'empty';
			const nextState = current === 'cross' ? 'empty' : 'cross';
			const nextBoard = cloneBoardState(curBoard);
			nextBoard.grid[row][col] = nextState;
			const oriented = autoOrientBoardTracks(nextBoard);
			commitBoardMove(curBoard, oriented);
		},
		[isComplete, isPaused, commitBoardMove],
	);

	// Pointer drag handlers
	const handleDragStart = useCallback(
		(row: number, col: number, e: PointerEvent<HTMLButtonElement>) => {
			if (isComplete || isPaused || e.button !== 0) return;

			isDraggingRef.current = true;
			lastDragCellRef.current = { row, col };
			dragMovedRef.current = false;
			dragStartBoardRef.current = boardRef.current;
		},
		[isComplete, isPaused],
	);

	const handleDragEnter = useCallback(
		(row: number, col: number, _e: PointerEvent<HTMLButtonElement>) => {
			if (!isDraggingRef.current || isComplete || isPaused) return;

			const last = lastDragCellRef.current;
			if (!last || (last.row === row && last.col === col)) return;

			const curBoard = boardRef.current;

			if (inputMode === 'track') {
				const dist = Math.abs(row - last.row) + Math.abs(col - last.col);
				if (dist === 1) {
					const stepped = applyDragStep(curBoard, last.row, last.col, row, col);
					boardRef.current = stepped;
					setBoard(stepped);
					lastDragCellRef.current = { row, col };
					dragMovedRef.current = true;
				}
			} else {
				if (!getFixedCell(curBoard, row, col) && curBoard.grid[row]?.[col] === 'empty') {
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[row][col] = 'cross';
					boardRef.current = nextBoard;
					setBoard(nextBoard);
					lastDragCellRef.current = { row, col };
					dragMovedRef.current = true;
				}
			}
		},
		[inputMode, isComplete, isPaused],
	);

	const handleDragEnd = useCallback(
		(_e: PointerEvent<HTMLElement>) => {
			if (!isDraggingRef.current) return;
			isDraggingRef.current = false;
			lastDragCellRef.current = null;

			if (dragMovedRef.current) {
				commitBoardMove(dragStartBoardRef.current, boardRef.current);
			}
		},
		[commitBoardMove],
	);

	// Clicking a row or column clue fills remaining empty cells in a satisfied line with 'cross'
	const handleClueClick = useCallback(
		(axis: 'row' | 'col', index: number) => {
			if (isComplete || isPaused) return;
			const curBoard = boardRef.current;
			const crossed = fillSatisfiedLinesWithCross(curBoard, { axis, index });
			if (crossed !== curBoard) {
				commitBoardMove(curBoard, crossed);
			}
		},
		[isComplete, isPaused, commitBoardMove],
	);

	// Hint: place the first missing or incorrect solution step
	const handleHint = useCallback(() => {
		if (isComplete || isPaused) return;

		const curBoard = boardRef.current;
		const solution = puzzleRef.current.solution;
		const targetStep = solution.find((step) => curBoard.grid[step.row]?.[step.col] !== step.track);

		if (!targetStep) return;

		const nextBoard = cloneBoardState(curBoard);
		nextBoard.grid[targetStep.row][targetStep.col] = targetStep.track;
		setFocusedCell({ row: targetStep.row, col: targetStep.col });
		commitBoardMove(curBoard, nextBoard);
	}, [isComplete, isPaused, commitBoardMove]);

	// Cell focus
	const handleCellFocus = useCallback((row: number, col: number) => {
		setFocusedCell({ row, col });
	}, []);

	// Undo / Redo / Reset
	const canUndo = checkCanUndo(history);
	const canRedo = checkCanRedo(history);

	const handleUndo = useCallback(() => {
		if (isComplete || isPaused || !checkCanUndo(history)) return;
		const nextHistory = undo(history);
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleRedo = useCallback(() => {
		if (isComplete || isPaused || !checkCanRedo(history)) return;
		const nextHistory = redo(history);
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleReset = useCallback(() => {
		if (isComplete || isPaused) return;
		const nextHistory = reset(history);
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	// Keyboard navigation & shortcuts
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (isComplete || isPaused) return;

			const currentFocus = focusedCell ?? { row: 0, col: 0 };
			const size = boardRef.current.size;

			switch (e.key) {
				case 'ArrowUp': {
					e.preventDefault();
					setFocusedCell({
						row: Math.max(0, currentFocus.row - 1),
						col: currentFocus.col,
					});
					break;
				}
				case 'ArrowDown': {
					e.preventDefault();
					setFocusedCell({
						row: Math.min(size - 1, currentFocus.row + 1),
						col: currentFocus.col,
					});
					break;
				}
				case 'ArrowLeft': {
					e.preventDefault();
					setFocusedCell({
						row: currentFocus.row,
						col: Math.max(0, currentFocus.col - 1),
					});
					break;
				}
				case 'ArrowRight': {
					e.preventDefault();
					setFocusedCell({
						row: currentFocus.row,
						col: Math.min(size - 1, currentFocus.col + 1),
					});
					break;
				}
				case 'Home': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: 0 });
					break;
				}
				case 'End': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: size - 1 });
					break;
				}
				case ' ':
				case 'Enter': {
					e.preventDefault();
					handleCellClick(currentFocus.row, currentFocus.col);
					break;
				}
				case 't':
				case 'T': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const nextBoard = cloneBoardState(curBoard);
					if (isTrackType(current)) {
						nextBoard.grid[currentFocus.row][currentFocus.col] = 'empty';
					} else {
						nextBoard.grid[currentFocus.row][currentFocus.col] =
							inferCellTrackType(curBoard, currentFocus.row, currentFocus.col) ?? 'straight-h';
					}
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'x':
				case 'X':
				case 'm':
				case 'M': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = current === 'cross' ? 'empty' : 'cross';
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'c':
				case 'C': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const idx = isTrackType(current) ? ALL_TRACK_TYPES.indexOf(current) : -1;
					const nextTrack = ALL_TRACK_TYPES[(idx + 1) % ALL_TRACK_TYPES.length];
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = nextTrack;
					commitBoardMove(curBoard, nextBoard);
					break;
				}
				case 'Backspace':
				case 'Delete': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					if (current === 'empty') break;
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = 'empty';
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'h':
				case 'H': {
					e.preventDefault();
					handleHint();
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
					e.preventDefault();
					if (e.shiftKey) {
						handleRedo();
					} else {
						handleUndo();
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
			handleCellClick,
			commitBoardMove,
			handleHint,
			handleUndo,
			handleRedo,
			handleTogglePause,
		],
	);

	// Select / start a specific puzzle
	const handleSelectPuzzle = useCallback((newPuzzle: StaticPuzzleDefinition) => {
		if (victoryTimerRef.current !== null) {
			window.clearTimeout(victoryTimerRef.current);
			victoryTimerRef.current = null;
		}
		const freshBoard = buildBoard(newPuzzle);
		setPuzzle(newPuzzle);
		boardRef.current = freshBoard;
		setBoard(freshBoard);
		setHistory(createHistory(freshBoard));
		setFocusedCell({ row: 0, col: 0 });
		setElapsedSeconds(0);
		setMovesCount(0);
		setMistakes(0);
		setIsComplete(false);
		setIsPaused(false);
		setIsVictoryOpen(false);
	}, []);

	const hasNextPuzzle = useMemo(() => !!getNextPuzzle(puzzle.id), [puzzle.id]);

	const handleNextPuzzle = useCallback(() => {
		const next = unwrapPuzzle(getNextPuzzle(puzzle.id));
		if (next) {
			handleSelectPuzzle(next);
			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.searchParams.set('difficulty', next.difficulty);
				url.searchParams.set('puzzle', next.id);
				window.history.replaceState(null, '', url.toString());
			}
		}
	}, [puzzle.id, handleSelectPuzzle]);

	const handlePlayAgain = useCallback(() => {
		handleSelectPuzzle(puzzle);
	}, [puzzle, handleSelectPuzzle]);

	const handleUpdateSettings = useCallback(async (newSettings: TracksSettings) => {
		setSettings(newSettings);
		settingsRef.current = newSettings;
		await saveSettings(newSettings);
	}, []);

	return {
		puzzle,
		board,
		evaluation,
		inputMode,
		focusedCell,
		elapsedSeconds,
		movesCount,
		mistakes,
		maxMistakes: MAX_MISTAKES,
		isPaused,
		isComplete,
		isVictoryOpen,
		isSettingsOpen,
		isNewBestTime,
		settings,
		progress,
		canUndo,
		canRedo,
		hasNextPuzzle,
		setInputMode,
		openSettings: () => {
			setIsPaused(true);
			setIsSettingsOpen(true);
		},
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		handleCellClick,
		handleCellContextMenu,
		handleCellFocus,
		handleDragStart,
		handleDragEnter,
		handleDragEnd,
		handleClueClick,
		handleHint,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		handleKeyDown,
		handleUpdateSettings,
		handleNextPuzzle,
		handlePlayAgain,
	};
}
