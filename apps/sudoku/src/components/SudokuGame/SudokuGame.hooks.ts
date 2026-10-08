import { createGameStorage } from '@arcade/lib-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateSudoku } from '../../engine/generator';
import { applyMove, autoClearPeerNotes, undoMove } from '../../engine/history';
import {
	type CellCoord,
	DEFAULT_GAME_SETTINGS,
	type Difficulty,
	type GameSettings,
	type GameSnapshot,
	INITIAL_SUDOKU_STATS,
	type MoveAction,
	type SudokuGrid,
	type SudokuStats,
} from '../../engine/types';
import { findAllConflicts, isBoardComplete } from '../../engine/validator';

const storage = createGameStorage('sudoku');

export function useSudokuGame(initialDifficulty: Difficulty = 'easy') {
	const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
	const [grid, setGrid] = useState<SudokuGrid>(() => generateSudoku(initialDifficulty).puzzle);
	const [solution, setSolution] = useState<number[][]>(() => []);
	const [activeCell, setActiveCell] = useState<CellCoord | null>({ row: 0, col: 0 });
	const [isNotesMode, setIsNotesMode] = useState(false);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [history, setHistory] = useState<MoveAction[]>([]);
	const [redoStack, setRedoStack] = useState<MoveAction[]>([]);
	const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
	const [isLoaded, setIsLoaded] = useState(false);

	const gridRef = useRef(grid);
	gridRef.current = grid;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const historyRef = useRef(history);
	historyRef.current = history;

	const redoRef = useRef(redoStack);
	redoRef.current = redoStack;

	const difficultyRef = useRef(difficulty);
	difficultyRef.current = difficulty;

	const solutionRef = useRef(solution);
	solutionRef.current = solution;

	const isCompleteRef = useRef(isComplete);
	isCompleteRef.current = isComplete;

	// Initial load from storage
	useEffect(() => {
		async function loadSavedState() {
			try {
				const savedSettings = await storage.get<GameSettings>('settings');
				if (savedSettings) {
					setSettings({ ...DEFAULT_GAME_SETTINGS, ...savedSettings });
				}

				let requestedDifficulty = initialDifficulty;
				let forceNew = false;
				let forceResume = false;

				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					const queryDiff = params.get('difficulty') as Difficulty | null;
					if (queryDiff && ['easy', 'medium', 'hard', 'veryHard', 'insane', 'inhuman'].includes(queryDiff)) {
						requestedDifficulty = queryDiff;
					}
					if (params.get('new') === 'true') {
						forceNew = true;
					}
					if (params.get('resume') === 'true') {
						forceResume = true;
					}
				}

				const activeGame = await storage.get<GameSnapshot>('activeGame');
				if (
					!forceNew &&
					activeGame &&
					!activeGame.isComplete &&
					activeGame.puzzle.length === 9 &&
					(forceResume || activeGame.difficulty === requestedDifficulty)
				) {
					setDifficulty(activeGame.difficulty);
					setGrid(activeGame.puzzle);
					setSolution(activeGame.solution);
					setElapsedSeconds(activeGame.elapsedSeconds);
					setHistory(activeGame.history || []);
					setRedoStack(activeGame.redoStack || []);
					setIsPaused(true); // Always resume paused so player can prepare
				} else {
					setDifficulty(requestedDifficulty);
					const generated = generateSudoku(requestedDifficulty);
					setGrid(generated.puzzle);
					setSolution(generated.solution);
				}
			} catch {
				const generated = generateSudoku(initialDifficulty);
				setGrid(generated.puzzle);
				setSolution(generated.solution);
			} finally {
				setIsLoaded(true);
			}
		}

		loadSavedState();
	}, [initialDifficulty]);

	// Auto-save snapshot
	const persistCurrentGame = useCallback(async () => {
		if (isCompleteRef.current) {
			await storage.remove('activeGame');
			return;
		}

		const snapshot: GameSnapshot = {
			difficulty: difficultyRef.current,
			puzzle: gridRef.current,
			solution: solutionRef.current,
			elapsedSeconds: elapsedRef.current,
			history: historyRef.current,
			redoStack: redoRef.current,
			isPaused: true,
			isComplete: false,
		};

		await storage.set('activeGame', snapshot);
	}, []);

	// Save on unload / tab hidden
	useEffect(() => {
		function handleVisibilityChange() {
			if (document.visibilityState === 'hidden') {
				setIsPaused(true);
				persistCurrentGame();
			}
		}

		function handleBeforeUnload() {
			persistCurrentGame();
		}

		window.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [persistCurrentGame]);

	// Ticker interval
	useEffect(() => {
		if (!isLoaded || isPaused || isComplete) return;

		const timer = setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [isLoaded, isPaused, isComplete]);

	// Compute conflicts and counts
	const conflicts = useMemo(() => findAllConflicts(grid), [grid]);

	const digitCounts = useMemo(() => {
		const counts: Record<number, number> = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
		};
		for (let r = 0; r < 9; r += 1) {
			for (let c = 0; c < 9; c += 1) {
				const val = grid[r][c].value;
				if (val !== null && val >= 1 && val <= 9) {
					counts[val] += 1;
				}
			}
		}
		return counts;
	}, [grid]);

	// Win checking and stats persistence
	const checkWinCondition = useCallback(async (nextGrid: SudokuGrid) => {
		if (isBoardComplete(nextGrid)) {
			setIsComplete(true);
			setIsVictoryOpen(true);
			const finalTime = elapsedRef.current;

			try {
				const existingStats = (await storage.get<SudokuStats>('stats')) || INITIAL_SUDOKU_STATS;
				const currentDiffStats = existingStats[difficultyRef.current] || {
					gamesPlayed: 0,
					gamesWon: 0,
					bestTimeSeconds: null,
				};

				const isNewBest =
					currentDiffStats.bestTimeSeconds === null || finalTime < currentDiffStats.bestTimeSeconds;

				setIsNewBestTime(isNewBest);

				const updatedStats: SudokuStats = {
					...existingStats,
					[difficultyRef.current]: {
						gamesPlayed: currentDiffStats.gamesPlayed + 1,
						gamesWon: currentDiffStats.gamesWon + 1,
						bestTimeSeconds: isNewBest ? finalTime : currentDiffStats.bestTimeSeconds,
					},
				};

				await storage.set('stats', updatedStats);
				await storage.remove('activeGame');
			} catch {
				// Fallback gracefully
			}
		}
	}, []);

	// Action: Digit Press
	const handleDigitPress = useCallback(
		(digit: number) => {
			if (!activeCell || isPaused || isComplete) return;

			const { row, col } = activeCell;
			const cell = grid[row][col];

			if (cell.isClue) return;

			if (isNotesMode) {
				const prevNote = cell.notes[digit - 1];
				const move: MoveAction = {
					type: 'toggleNote',
					row,
					col,
					digit,
					prevValue: prevNote,
					nextValue: !prevNote,
				};

				const nextGrid = applyMove(grid, move);
				setGrid(nextGrid);
				setHistory((prev) => [...prev, move]);
				setRedoStack([]);
			} else {
				if (cell.value === digit) return;

				const hasNotes = cell.notes.some(Boolean);
				const clearedOwnNotes = settings.autoClearNotes && hasNotes;

				let autoCleared: { row: number; col: number; digit: number }[] | undefined;
				if (settings.autoClearNotes) {
					autoCleared = autoClearPeerNotes(grid, row, col, digit);
				}

				const move: MoveAction = {
					type: 'setValue',
					row,
					col,
					prevValue: cell.value,
					nextValue: digit,
					clearedOwnNotes,
					prevNotes: clearedOwnNotes ? [...cell.notes] : undefined,
					autoClearedNotes: autoCleared,
				};

				const nextGrid = applyMove(grid, move);
				setGrid(nextGrid);
				setHistory((prev) => [...prev, move]);
				setRedoStack([]);

				checkWinCondition(nextGrid);
			}
		},
		[activeCell, grid, isNotesMode, isPaused, isComplete, settings.autoClearNotes, checkWinCondition],
	);

	// Action: Erase
	const handleErase = useCallback(() => {
		if (!activeCell || isPaused || isComplete) return;

		const { row, col } = activeCell;
		const cell = grid[row][col];

		if (cell.isClue) return;

		if (cell.value !== null) {
			const move: MoveAction = {
				type: 'clearValue',
				row,
				col,
				prevValue: cell.value,
				prevNotes: [...cell.notes],
			};
			const nextGrid = applyMove(grid, move);
			setGrid(nextGrid);
			setHistory((prev) => [...prev, move]);
			setRedoStack([]);
		} else if (cell.notes.some(Boolean)) {
			const move: MoveAction = {
				type: 'clearNotes',
				row,
				col,
				prevNotes: [...cell.notes],
			};
			const nextGrid = applyMove(grid, move);
			setGrid(nextGrid);
			setHistory((prev) => [...prev, move]);
			setRedoStack([]);
		}
	}, [activeCell, grid, isPaused, isComplete]);

	// Action: Undo
	const handleUndo = useCallback(() => {
		if (history.length === 0 || isPaused || isComplete) return;

		const lastMove = history[history.length - 1];
		const restoredGrid = undoMove(grid, lastMove);

		setGrid(restoredGrid);
		setHistory((prev) => prev.slice(0, -1));
		setRedoStack((prev) => [...prev, lastMove]);
		setActiveCell({ row: lastMove.row, col: lastMove.col });
	}, [history, grid, isPaused, isComplete]);

	// Action: Redo
	const handleRedo = useCallback(() => {
		if (redoStack.length === 0 || isPaused || isComplete) return;

		const nextMove = redoStack[redoStack.length - 1];
		const reappliedGrid = applyMove(grid, nextMove);

		setGrid(reappliedGrid);
		setRedoStack((prev) => prev.slice(0, -1));
		setHistory((prev) => [...prev, nextMove]);
		setActiveCell({ row: nextMove.row, col: nextMove.col });

		checkWinCondition(reappliedGrid);
	}, [redoStack, grid, isPaused, isComplete, checkWinCondition]);

	// Action: Start New Game
	const handleStartNewGame = useCallback(
		(newDifficulty?: Difficulty) => {
			const targetDiff = newDifficulty || difficulty;
			const generated = generateSudoku(targetDiff);

			setDifficulty(targetDiff);
			setGrid(generated.puzzle);
			setSolution(generated.solution);
			setElapsedSeconds(0);
			setHistory([]);
			setRedoStack([]);
			setIsPaused(false);
			setIsComplete(false);
			setIsVictoryOpen(false);
			setActiveCell({ row: 0, col: 0 });

			storage.remove('activeGame');
		},
		[difficulty],
	);

	// Action: Restart Current Puzzle
	const handleRestart = useCallback(() => {
		const resetGrid: SudokuGrid = grid.map((row) =>
			row.map((cell) => ({
				...cell,
				value: cell.isClue ? cell.value : null,
				notes: Array(9).fill(false),
			})),
		);

		setGrid(resetGrid);
		setElapsedSeconds(0);
		setHistory([]);
		setRedoStack([]);
		setIsPaused(false);
		setIsComplete(false);
		setIsVictoryOpen(false);
	}, [grid]);

	// Action: Update Settings
	const updateSettings = useCallback(async (newSettings: GameSettings) => {
		setSettings(newSettings);
		await storage.set('settings', newSettings);
	}, []);

	// Keyboard shortcuts listener
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isSettingsOpen || isVictoryOpen) return;
			if (e.defaultPrevented) return;

			// Pause toggle ('p' or 'P' or 'Escape')
			if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
				e.preventDefault();
				setIsPaused((prev) => !prev);
				return;
			}

			if (isPaused || isComplete) return;

			const target = e.target as HTMLElement | null;
			if (!target) return;

			// Never intercept keys when focus is inside a toolbar, header, navigation, form control, or dialog
			if (
				target.closest(
					'input, textarea, select, [role="dialog"], [role="listbox"], [role="menu"], [role="toolbar"]',
				) ||
				target.closest('header, nav, footer')
			) {
				return;
			}

			const isBoardFocused =
				Boolean(target.closest('#sudoku-board')) || target === document.body || target.id === 'main-content';

			// Arrow keys & grid navigation (strictly constrained to the board or game canvas)
			const isArrowOrNavKey =
				e.key === 'ArrowUp' ||
				e.key === 'ArrowDown' ||
				e.key === 'ArrowLeft' ||
				e.key === 'ArrowRight' ||
				e.key === 'Home' ||
				e.key === 'End' ||
				e.key === 'PageUp' ||
				e.key === 'PageDown';

			if (isArrowOrNavKey) {
				if (!isBoardFocused) {
					return;
				}

				e.preventDefault();
				setActiveCell((prev) => {
					const current = prev ?? { row: 0, col: 0 };
					let { row, col } = current;
					if (e.key === 'ArrowUp') row = (row - 1 + 9) % 9;
					if (e.key === 'ArrowDown') row = (row + 1) % 9;
					if (e.key === 'ArrowLeft') col = (col - 1 + 9) % 9;
					if (e.key === 'ArrowRight') col = (col + 1) % 9;
					if (e.key === 'Home') col = 0;
					if (e.key === 'End') col = 8;
					if (e.key === 'PageUp') row = 0;
					if (e.key === 'PageDown') row = 8;

					const cellBtn = document.querySelector<HTMLButtonElement>(
						`#sudoku-board button[data-row="${row}"][data-col="${col}"]`,
					);
					cellBtn?.focus();
					return { row, col };
				});
				return;
			}

			// Digit keys 1-9
			if (/^[1-9]$/.test(e.key)) {
				e.preventDefault();
				handleDigitPress(Number.parseInt(e.key, 10));
				return;
			}

			// Erase / Delete
			if (e.key === 'Backspace' || e.key === 'Delete') {
				e.preventDefault();
				handleErase();
				return;
			}

			// Notes toggle ('n' or 'N')
			if (e.key === 'n' || e.key === 'N') {
				e.preventDefault();
				setIsNotesMode((prev) => !prev);
				return;
			}

			// Undo ('u' or 'U' or Ctrl/Cmd+Z)
			if ((e.key === 'u' || e.key === 'U') && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				handleUndo();
				return;
			}

			if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
				e.preventDefault();
				handleUndo();
				return;
			}

			// Redo ('r' or 'R' or Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z)
			if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				handleRedo();
				return;
			}

			if (
				((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
				((e.key === 'y' || e.key === 'Y') && (e.ctrlKey || e.metaKey))
			) {
				e.preventDefault();
				handleRedo();
				return;
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isSettingsOpen, isVictoryOpen, isPaused, isComplete, handleDigitPress, handleErase, handleUndo, handleRedo]);

	return {
		difficulty,
		grid,
		solution,
		activeCell,
		isNotesMode,
		elapsedSeconds,
		isPaused,
		isComplete,
		isVictoryOpen,
		isSettingsOpen,
		isNewBestTime,
		conflicts,
		digitCounts,
		settings,
		canUndo: history.length > 0,
		canRedo: redoStack.length > 0,
		selectCell: (r: number, c: number) => setActiveCell({ row: r, col: c }),
		handleDigitPress,
		handleErase,
		handleToggleNotes: () => setIsNotesMode((prev) => !prev),
		handleUndo,
		handleRedo,
		handleTogglePause: () => setIsPaused((prev) => !prev),
		handleRestart,
		handleStartNewGame,
		updateSettings,
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
