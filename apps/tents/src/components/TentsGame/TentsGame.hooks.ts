import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { generateTentsPuzzle } from '../../engine/generator.ts';
import {
	batchSetMarks,
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	cloneBoardState,
	createHistory,
	redo,
	reset,
	setCellMark,
	undo,
} from '../../engine/history.ts';
import { getNextPreset, getPresetById, getPresetsByDifficulty } from '../../engine/presets/index.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadProgress,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.ts';
import {
	type BoardEvaluation,
	type BoardState,
	type CellCoord,
	DEFAULT_SETTINGS,
	DIFFICULTY_GRID_SIZES,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type HistoryState,
	type PlayerMark,
	type ProgressMap,
	type PuzzleDefinition,
	type TentsSettings,
} from '../../engine/types.ts';
import {
	areChebyshevTouching,
	checkColClues,
	checkRowClues,
	coordKey,
	createBoardFromPuzzle,
	evaluateBoard,
} from '../../engine/validator.ts';

function resolveInitialPuzzle(initialDifficulty: DifficultyLevel, initialPuzzleId?: string): PuzzleDefinition {
	let diff: DifficultyLevel = initialDifficulty;

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const queryDiff = params.get('difficulty') as DifficultyLevel | null;
		if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
			diff = queryDiff;
		}

		const queryPuzzle = params.get('puzzle');
		const isRandom = params.get('random') === 'true';

		if (queryPuzzle) {
			const found = getPresetById(queryPuzzle);
			if (found) return found;
		} else if (isRandom || params.get('new') === 'true') {
			try {
				return generateTentsPuzzle(diff);
			} catch {
				// Fallback to preset if procedural generation fails
			}
		}
	}

	if (initialPuzzleId) {
		const found = getPresetById(initialPuzzleId);
		if (found) return found;
	}

	const list = getPresetsByDifficulty(diff);
	return list[0] ?? getPresetsByDifficulty('easy')[0];
}

export function useTentsGame(initialDifficulty: DifficultyLevel = 'easy', initialPuzzleId?: string) {
	const initialPuzzle = useMemo(
		() => resolveInitialPuzzle(initialDifficulty, initialPuzzleId),
		[initialDifficulty, initialPuzzleId],
	);

	const [puzzle, setPuzzle] = useState<PuzzleDefinition>(initialPuzzle);
	const [board, setBoard] = useState<BoardState>(() => createBoardFromPuzzle(initialPuzzle));
	const [history, setHistory] = useState<HistoryState>(() => createHistory(createBoardFromPuzzle(initialPuzzle)));
	const [inputMode, setInputMode] = useState<'tent' | 'grass'>('tent');
	const [focusedCell, setFocusedCell] = useState<CellCoord | null>({ row: 0, col: 0 });
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [mistakesCount, setMistakesCount] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [settings, setSettings] = useState<TentsSettings>(DEFAULT_SETTINGS);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [isLoaded, setIsLoaded] = useState(false);

	const evaluation: BoardEvaluation = useMemo(() => evaluateBoard(board), [board]);

	// References for stable access in timer and callbacks
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

	const mistakesRef = useRef(mistakesCount);
	mistakesRef.current = mistakesCount;

	const isCompleteRef = useRef(isComplete);
	isCompleteRef.current = isComplete;

	const hasRecordedResultRef = useRef(false);

	// Tracking for new medals
	const maxSimultaneousErrorsRef = useRef(0);
	const placedTentsTimestampsRef = useRef<number[]>([]);
	const placedThreeTentsInSixSecondsRef = useRef(false);
	const autoGrassedRowsRef = useRef<Set<number>>(new Set());
	const autoGrassedColsRef = useRef<Set<number>>(new Set());

	// Load storage on mount (settings, progress, optional resume)
	useEffect(() => {
		async function init() {
			const savedSettings = await loadSettings();
			setSettings(savedSettings);

			const savedProgress = await loadProgress();
			setProgress(savedProgress);

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				if (params.get('resume') === 'true') {
					const activeGame = await loadActiveGame();
					if (activeGame && !activeGame.isComplete) {
						if (activeGame.puzzleDefinition) {
							setPuzzle(activeGame.puzzleDefinition);
						}
						setBoard(activeGame.board);
						setHistory({
							past: [],
							present: cloneBoardState(activeGame.board),
							future: [],
							grassPlacedCount: activeGame.grassPlacedCount,
							moveCount: activeGame.moveCount,
						});
						setElapsedSeconds(activeGame.elapsedSeconds);
					}
				}
			}

			setIsLoaded(true);
		}
		init();
	}, []);

	// Save active game state during gameplay
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		const timer = setTimeout(() => {
			void saveActiveGame({
				puzzleId: puzzle.id,
				difficulty: puzzle.difficulty,
				size: puzzle.size,
				board,
				elapsedSeconds,
				grassPlacedCount: history.grassPlacedCount,
				moveCount: history.moveCount,
				isComplete: false,
				lastPlayed: Date.now(),
				puzzleDefinition: puzzle,
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [isLoaded, isComplete, puzzle, board, elapsedSeconds, history]);

	// Timer interval
	useEffect(() => {
		if (isPaused || isComplete || !isLoaded) return;

		const interval = setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isPaused, isComplete, isLoaded]);

	// Victory check and medal recording
	const recordVictory = useCallback(async (time: number) => {
		if (hasRecordedResultRef.current) return;
		hasRecordedResultRef.current = true;

		const curPuzzle = puzzleRef.current;
		const curHistory = historyRef.current;
		const curMistakes = mistakesRef.current;
		const curSettings = settingsRef.current;
		const width = curPuzzle.size;
		const height = curPuzzle.size;

		const { isNewBestTime: newBest } = await recordPuzzleCompletion(curPuzzle.id, time);
		setIsNewBestTime(newBest);

		const isProcedural = curPuzzle.id.startsWith('tents-');

		const usedAutoGrassOnAllSatisfiedLines =
			autoGrassedRowsRef.current.size === curPuzzle.size && autoGrassedColsRef.current.size === curPuzzle.size;

		await recordGameResult({
			gameId: 'tents',
			won: true,
			playTimeSeconds: Math.max(1, time),
			levelKey: curPuzzle.difficulty,
			sizeKey: `${width}x${height}`,
			roundContext: {
				mistakesCount: curMistakes,
				grassPlacedCount: curHistory.grassPlacedCount,
				difficulty: curPuzzle.difficulty,
				levelKey: curPuzzle.difficulty,
				totalTentsPitched: curPuzzle.trees.length,
				completedPresetId: isProcedural ? undefined : curPuzzle.id,
				usedAutoGrassOnAllSatisfiedLines,
				allLinesAutoGrassed: usedAutoGrassOnAllSatisfiedLines,
				maxSimultaneousErrors: maxSimultaneousErrorsRef.current,
				clueHighlightDisabled: !curSettings.highlightClues,
				violationHighlightDisabled: !curSettings.highlightViolations,
				placedThreeTentsInSixSeconds: placedThreeTentsInSixSecondsRef.current,
			},
		}).catch((err) => {
			console.warn('[@arcade/tents] Failed to record victory medals:', err);
		});

		await clearActiveGame();
		setIsComplete(true);
		setIsVictoryOpen(true);
	}, []);

	useEffect(() => {
		if (isLoaded && !isComplete) {
			if (evaluation.touchingTents.size > maxSimultaneousErrorsRef.current) {
				maxSimultaneousErrorsRef.current = evaluation.touchingTents.size;
			}
			if (evaluation.isSolved) {
				recordVictory(elapsedRef.current);
			}
		}
	}, [isLoaded, isComplete, evaluation, recordVictory]);

	// Auto-grass helper: surrounding placed tent & filling satisfied lines
	const applyAutoGrass = useCallback(
		(
			curBoard: BoardState,
			placedRow: number,
			placedCol: number,
		): { row: number; col: number; mark: PlayerMark }[] => {
			const grassCells: { row: number; col: number; mark: PlayerMark }[] = [];
			const tentCoord = { row: placedRow, col: placedCol };

			// 1. Surround placed tent with grass in all 8 surrounding cells
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (dr === 0 && dc === 0) continue;
					const nr = placedRow + dr;
					const nc = placedCol + dc;
					if (nr >= 0 && nr < curBoard.size && nc >= 0 && nc < curBoard.size) {
						const neighbor = curBoard.grid[nr][nc];
						if (neighbor.fixed !== 'tree' && neighbor.mark === 'none') {
							grassCells.push({ row: nr, col: nc, mark: 'grass' });
						}
					}
				}
			}

			// Temporary board to check line clue satisfaction with the newly placed tent
			const testBoard = cloneBoardState(curBoard);
			testBoard.grid[placedRow][placedCol].mark = 'tent';
			const rowEvals = checkRowClues(testBoard);
			const colEvals = checkColClues(testBoard);

			if (rowEvals[placedRow]?.status === 'satisfied') {
				autoGrassedRowsRef.current.add(placedRow);
				for (let c = 0; c < testBoard.size; c++) {
					const cell = testBoard.grid[placedRow][c];
					if (cell.fixed !== 'tree' && cell.mark === 'none') {
						grassCells.push({ row: placedRow, col: c, mark: 'grass' });
					}
				}
			}

			if (colEvals[placedCol]?.status === 'satisfied') {
				autoGrassedColsRef.current.add(placedCol);
				for (let r = 0; r < testBoard.size; r++) {
					const cell = testBoard.grid[r][placedCol];
					if (cell.fixed !== 'tree' && cell.mark === 'none') {
						grassCells.push({ row: r, col: placedCol, mark: 'grass' });
					}
				}
			}

			return grassCells;
		},
		[],
	);

	// Cell click handler
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (isComplete || isPaused) return;
			const cell = board.grid[row]?.[col];
			if (!cell || cell.fixed === 'tree') return;

			setFocusedCell({ row, col });

			let nextMark: PlayerMark = 'none';

			if (inputMode === 'tent') {
				if (cell.mark === 'none') {
					nextMark = 'tent';
				} else if (cell.mark === 'tent') {
					nextMark = 'grass';
				} else {
					nextMark = 'none';
				}
			} else {
				if (cell.mark === 'none') {
					nextMark = 'grass';
				} else if (cell.mark === 'grass') {
					nextMark = 'none';
				} else {
					nextMark = 'grass';
				}
			}

			// Check if this move violates touching tent or line overflow
			if (nextMark === 'tent') {
				let hasViolation = false;
				for (let r = 0; r < board.size; r++) {
					for (let c = 0; c < board.size; c++) {
						if (r === row && c === col) continue;
						if (
							board.grid[r][c].mark === 'tent' &&
							areChebyshevTouching({ row, col }, { row: r, col: c })
						) {
							hasViolation = true;
							break;
						}
					}
					if (hasViolation) break;
				}

				const testBoard = cloneBoardState(board);
				testBoard.grid[row][col].mark = 'tent';
				const rowStatus = checkRowClues(testBoard)[row]?.status;
				const colStatus = checkColClues(testBoard)[col]?.status;
				if (rowStatus === 'overflow' || colStatus === 'overflow') {
					hasViolation = true;
				}

				if (hasViolation) {
					setMistakesCount((prev) => prev + 1);
				}

				if (!placedThreeTentsInSixSecondsRef.current) {
					const now = Date.now();
					placedTentsTimestampsRef.current.push(now);
					const times = placedTentsTimestampsRef.current;
					if (times.length >= 3) {
						const thirdMostRecent = times[times.length - 1];
						const firstOfThree = times[times.length - 3];
						if (thirdMostRecent - firstOfThree <= 6000) {
							placedThreeTentsInSixSecondsRef.current = true;
						}
					}
				}
			}

			if (nextMark === 'tent' && settings.autoGrass) {
				const autoGrassCells = applyAutoGrass(board, row, col);
				const batch = [{ row, col, mark: 'tent' as const }, ...autoGrassCells];
				const nextHist = batchSetMarks(history, batch);
				setHistory(nextHist);
				setBoard(nextHist.present);
			} else {
				const nextHist = setCellMark(history, row, col, nextMark);
				setHistory(nextHist);
				setBoard(nextHist.present);
			}
		},
		[board, history, inputMode, isComplete, isPaused, settings.autoGrass, applyAutoGrass],
	);

	// Context menu (right click) toggles grass
	const handleCellContextMenu = useCallback(
		(row: number, col: number, e: MouseEvent) => {
			e.preventDefault();
			if (isComplete || isPaused) return;
			const cell = board.grid[row]?.[col];
			if (!cell || cell.fixed === 'tree') return;

			setFocusedCell({ row, col });
			const nextMark: PlayerMark = cell.mark === 'grass' ? 'none' : 'grass';
			const nextHist = setCellMark(history, row, col, nextMark);
			setHistory(nextHist);
			setBoard(nextHist.present);
		},
		[board, history, isComplete, isPaused],
	);

	// Clue click handler: fill satisfied row or col with grass
	const handleClueClick = useCallback(
		(type: 'row' | 'col', index: number) => {
			if (isComplete || isPaused) return;

			const cellsToGrass: { row: number; col: number; mark: PlayerMark }[] = [];
			if (type === 'row') {
				for (let c = 0; c < board.size; c++) {
					const cell = board.grid[index][c];
					if (cell.fixed !== 'tree' && cell.mark === 'none') {
						cellsToGrass.push({ row: index, col: c, mark: 'grass' });
					}
				}
			} else {
				for (let r = 0; r < board.size; r++) {
					const cell = board.grid[r][index];
					if (cell.fixed !== 'tree' && cell.mark === 'none') {
						cellsToGrass.push({ row: r, col: index, mark: 'grass' });
					}
				}
			}

			if (cellsToGrass.length > 0) {
				if (type === 'row') {
					autoGrassedRowsRef.current.add(index);
				} else {
					autoGrassedColsRef.current.add(index);
				}
				const nextHist = batchSetMarks(history, cellsToGrass);
				setHistory(nextHist);
				setBoard(nextHist.present);
			}
		},
		[board, history, isComplete, isPaused],
	);

	// Undo, redo, reset
	const handleUndo = useCallback(() => {
		if (isComplete || isPaused || !checkCanUndo(history)) return;
		const nextHist = undo(history);
		setHistory(nextHist);
		setBoard(nextHist.present);
	}, [history, isComplete, isPaused]);

	const handleRedo = useCallback(() => {
		if (isComplete || isPaused || !checkCanRedo(history)) return;
		const nextHist = redo(history);
		setHistory(nextHist);
		setBoard(nextHist.present);
	}, [history, isComplete, isPaused]);

	const handleReset = useCallback(() => {
		if (isComplete || isPaused) return;
		const nextHist = reset(history);
		setHistory(nextHist);
		setBoard(nextHist.present);
	}, [history, isComplete, isPaused]);

	// Hint: reveals one correct tent from solution or places grass
	const handleHint = useCallback(() => {
		if (isComplete || isPaused || !puzzle.solution) return;

		for (const tent of puzzle.solution) {
			const cell = board.grid[tent.row]?.[tent.col];
			if (cell && cell.mark !== 'tent') {
				setFocusedCell({ row: tent.row, col: tent.col });
				if (settings.autoGrass) {
					const autoGrass = applyAutoGrass(board, tent.row, tent.col);
					const batch = [{ row: tent.row, col: tent.col, mark: 'tent' as const }, ...autoGrass];
					const nextHist = batchSetMarks(history, batch);
					setHistory(nextHist);
					setBoard(nextHist.present);
				} else {
					const nextHist = setCellMark(history, tent.row, tent.col, 'tent');
					setHistory(nextHist);
					setBoard(nextHist.present);
				}
				return;
			}
		}
	}, [board, history, isComplete, isPaused, puzzle.solution, settings.autoGrass, applyAutoGrass]);

	// Keyboard shortcut handler
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isComplete) return;

			if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
				e.preventDefault();
				setIsPaused((prev) => !prev);
				return;
			}

			if (isPaused) return;

			const cur = focusedCell ?? { row: 0, col: 0 };
			const size = board.size;

			if (e.key === 'ArrowUp') {
				e.preventDefault();
				setFocusedCell({ row: Math.max(0, cur.row - 1), col: cur.col });
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				setFocusedCell({ row: Math.min(size - 1, cur.row + 1), col: cur.col });
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				setFocusedCell({ row: cur.row, col: Math.max(0, cur.col - 1) });
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				setFocusedCell({ row: cur.row, col: Math.min(size - 1, cur.col + 1) });
			} else if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				const cell = board.grid[cur.row]?.[cur.col];
				if (cell && cell.fixed !== 'tree') {
					let nextMark: PlayerMark = 'none';
					if (cell.mark === 'none') nextMark = 'tent';
					else if (cell.mark === 'tent') nextMark = 'grass';
					else nextMark = 'none';

					const nextHist = setCellMark(history, cur.row, cur.col, nextMark);
					setHistory(nextHist);
					setBoard(nextHist.present);
				}
			} else if (e.key.toLowerCase() === 't') {
				e.preventDefault();
				handleCellClick(cur.row, cur.col);
			} else if (e.key.toLowerCase() === 'g' || e.key.toLowerCase() === 'x') {
				e.preventDefault();
				const cell = board.grid[cur.row]?.[cur.col];
				if (cell && cell.fixed !== 'tree') {
					const nextMark: PlayerMark = cell.mark === 'grass' ? 'none' : 'grass';
					const nextHist = setCellMark(history, cur.row, cur.col, nextMark);
					setHistory(nextHist);
					setBoard(nextHist.present);
				}
			} else if (e.key === 'Backspace' || e.key === 'Delete') {
				e.preventDefault();
				const cell = board.grid[cur.row]?.[cur.col];
				if (cell && cell.fixed !== 'tree' && cell.mark !== 'none') {
					const nextHist = setCellMark(history, cur.row, cur.col, 'none');
					setHistory(nextHist);
					setBoard(nextHist.present);
				}
			} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
				e.preventDefault();
				if (e.shiftKey) {
					handleRedo();
				} else {
					handleUndo();
				}
			} else if (e.key.toLowerCase() === 'u') {
				e.preventDefault();
				handleUndo();
			} else if (e.key.toLowerCase() === 'y') {
				e.preventDefault();
				handleRedo();
			} else if (e.key.toLowerCase() === 'h') {
				e.preventDefault();
				handleHint();
			}
		},
		[
			board.grid,
			board.size,
			focusedCell,
			handleCellClick,
			handleHint,
			handleRedo,
			handleUndo,
			history,
			isComplete,
			isPaused,
		],
	);

	// Settings & dialog controls
	const handleTogglePause = useCallback(() => {
		setIsPaused((prev) => !prev);
	}, []);

	const openSettings = useCallback(() => {
		setIsPaused(true);
		setIsSettingsOpen(true);
	}, []);

	const closeSettings = useCallback(() => {
		setIsSettingsOpen(false);
	}, []);

	const handleUpdateSettings = useCallback((next: TentsSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	const closeVictory = useCallback(() => {
		setIsVictoryOpen(false);
	}, []);

	// Play again (restart current puzzle)
	const handlePlayAgain = useCallback(() => {
		const freshBoard = createBoardFromPuzzle(puzzle);
		setBoard(freshBoard);
		setHistory(createHistory(freshBoard));
		setElapsedSeconds(0);
		setMistakesCount(0);
		setIsPaused(false);
		setIsComplete(false);
		setIsVictoryOpen(false);
		hasRecordedResultRef.current = false;
		maxSimultaneousErrorsRef.current = 0;
		placedTentsTimestampsRef.current = [];
		placedThreeTentsInSixSecondsRef.current = false;
		autoGrassedRowsRef.current = new Set();
		autoGrassedColsRef.current = new Set();
	}, [puzzle]);

	// Next puzzle transition
	const nextPreset = useMemo(() => getNextPreset(puzzle.id), [puzzle.id]);
	const hasNextPuzzle = Boolean(nextPreset);

	const handleNextPuzzle = useCallback(() => {
		if (nextPreset) {
			setPuzzle(nextPreset);
			const freshBoard = createBoardFromPuzzle(nextPreset);
			setBoard(freshBoard);
			setHistory(createHistory(freshBoard));
			setElapsedSeconds(0);
			setMistakesCount(0);
			setIsPaused(false);
			setIsComplete(false);
			setIsVictoryOpen(false);
			hasRecordedResultRef.current = false;
			maxSimultaneousErrorsRef.current = 0;
			placedTentsTimestampsRef.current = [];
			placedThreeTentsInSixSecondsRef.current = false;
			autoGrassedRowsRef.current = new Set();
			autoGrassedColsRef.current = new Set();

			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.searchParams.set('puzzle', nextPreset.id);
				url.searchParams.set('difficulty', nextPreset.difficulty);
				url.searchParams.delete('random');
				url.searchParams.delete('resume');
				window.history.replaceState(null, '', url.toString());
			}
		}
	}, [nextPreset]);

	// Count currently placed tents
	const placedTents = useMemo(() => {
		let count = 0;
		for (let r = 0; r < board.size; r++) {
			for (let c = 0; c < board.size; c++) {
				if (board.grid[r][c].mark === 'tent') count++;
			}
		}
		return count;
	}, [board]);

	return {
		puzzle,
		board,
		evaluation,
		inputMode,
		setInputMode,
		focusedCell,
		elapsedSeconds,
		mistakesCount,
		isPaused,
		isComplete,
		isVictoryOpen,
		isSettingsOpen,
		isNewBestTime,
		settings,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		movesCount: history.moveCount,
		placedTents,
		totalTrees: puzzle.trees.length,
		hasNextPuzzle,
		handleCellClick,
		handleCellContextMenu,
		handleClueClick,
		handleCellFocus: (row: number, col: number) => setFocusedCell({ row, col }),
		handleUndo,
		handleRedo,
		handleReset,
		handleHint: puzzle.solution ? handleHint : undefined,
		handleKeyDown,
		handleTogglePause,
		openSettings,
		closeSettings,
		handleUpdateSettings,
		closeVictory,
		handlePlayAgain,
		handleNextPuzzle,
	};
}
