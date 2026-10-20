import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isLineCompleted, isPuzzleSolved } from '../../engine/clues';
import { PUZZLE_CATALOG, getDefaultPuzzle, getPuzzleById } from '../../engine/puzzles';
import {
	loadActiveGame,
	loadLastConfig,
	loadSettings,
	loadSolvedPuzzles,
	recordPuzzleCompletion,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	type CellState,
	DEFAULT_NONOGRAM_SETTINGS,
	type DifficultyId,
	type GameStatus,
	type InteractionMode,
	type MoveAction,
	type NonogramPuzzle,
	type NonogramSettings,
	type PuzzleRecord,
	type StrokeHistory,
} from '../../engine/types';

export function useNonogramEngine(initialDifficulty: DifficultyId = 'easy', initialPuzzleId?: string) {
	const [puzzle, setPuzzle] = useState<NonogramPuzzle>(() => {
		if (initialPuzzleId) {
			const found = getPuzzleById(initialPuzzleId);
			if (found) return found;
		}
		return getDefaultPuzzle(initialDifficulty);
	});

	const [cells, setCells] = useState<CellState[]>(() => new Array(puzzle.width * puzzle.height).fill('empty'));

	const [status, setStatus] = useState<GameStatus>('not_started');
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [moves, setMoves] = useState(0);
	const [focusedCell, setFocusedCell] = useState<{ col: number; row: number } | null>({
		col: 0,
		row: 0,
	});
	const [interactionMode, setInteractionMode] = useState<InteractionMode>('fill');
	const [settings, setSettings] = useState<NonogramSettings>(DEFAULT_NONOGRAM_SETTINGS);
	const [solvedRecords, setSolvedRecords] = useState<Record<string, PuzzleRecord>>({});
	const [isNewBestTime, setIsNewBestTime] = useState(false);

	const [history, setHistory] = useState<StrokeHistory[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);

	// Dialog states
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isPuzzleSelectOpen, setIsPuzzleSelectOpen] = useState(false);

	// Refs for event callbacks and timer tickers
	const statusRef = useRef(status);
	statusRef.current = status;

	const cellsRef = useRef(cells);
	cellsRef.current = cells;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const movesRef = useRef(moves);
	movesRef.current = moves;

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	// Round context tracking for medal achievements
	const [mistakesCount, setMistakesCount] = useState(0);
	const [hintsUsed, setHintsUsed] = useState(0);

	const mistakesCountRef = useRef(0);
	mistakesCountRef.current = mistakesCount;

	const hintsUsedRef = useRef(0);
	hintsUsedRef.current = hintsUsed;

	const crossesPlacedRef = useRef(0);
	const crossesBeforeFirstFillRef = useRef(0);
	const hasPlacedFirstFillRef = useRef(false);
	const cellTogglesRef = useRef<Record<number, number>>({});

	const getMaxSameCellToggles = useCallback(() => {
		const vals = Object.values(cellTogglesRef.current);
		return vals.length > 0 ? Math.max(...vals) : 0;
	}, []);

	const handleStrikeout = useCallback(async () => {
		if (statusRef.current === 'won' || statusRef.current === 'lost') return;
		setStatus('lost');
		const curPuzzle = puzzleRef.current;
		const finalSeconds = elapsedRef.current;
		const filledCount = cellsRef.current.filter((c) => c === 'filled').length;
		const totalCells = curPuzzle.width * curPuzzle.height;
		const boardFillRatioOnDefeat = totalCells > 0 ? filledCount / totalCells : 0;
		const maxToggles = getMaxSameCellToggles();

		void recordGameResult({
			gameId: 'nonogram',
			won: false,
			playTimeSeconds: finalSeconds,
			levelKey: curPuzzle.difficulty,
			sizeKey: `${curPuzzle.width}x${curPuzzle.height}`,
			roundContext: {
				mistakesCount: mistakesCountRef.current,
				hintsUsed: hintsUsedRef.current,
				crossesPlaced: crossesPlacedRef.current,
				crossesBeforeFirstFill: crossesBeforeFirstFillRef.current,
				maxSameCellToggles: maxToggles,
				boardFillRatioOnDefeat,
				completedPuzzleId: curPuzzle.id,
				difficulty: curPuzzle.difficulty,
				size: `${curPuzzle.width}x${curPuzzle.height}`,
			},
		}).catch((error) => {
			console.warn('[@arcade/nonogram] Failed to record defeat medals result:', error);
		});

		await saveActiveGame(null);
	}, [getMaxSameCellToggles]);

	// Load settings & active game on mount
	useEffect(() => {
		async function init() {
			const [loadedSettings, loadedSolved] = await Promise.all([loadSettings(), loadSolvedPuzzles()]);
			setSettings(loadedSettings);
			setSolvedRecords(loadedSolved);

			let targetDiff = initialDifficulty;
			let targetId = initialPuzzleId;

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const queryDiff = params.get('difficulty') as DifficultyId;
				const queryPuzzle = params.get('puzzle');
				const isNew = params.get('new') === 'true';
				const isResume = params.get('resume') === 'true';

				if (queryDiff) targetDiff = queryDiff;
				if (queryPuzzle) targetId = queryPuzzle;

				if (isResume || !isNew) {
					const saved = await loadActiveGame();
					if (saved && saved.status === 'playing') {
						const savedPuzzle = getPuzzleById(saved.puzzleId);
						if (savedPuzzle) {
							setPuzzle(savedPuzzle);
							setCells(saved.cells);
							setElapsedSeconds(saved.elapsedSeconds);
							setMoves(saved.moves);
							setStatus('playing');
							return;
						}
					}
				}
			}

			if (!targetId) {
				const last = await loadLastConfig();
				if (last) {
					targetDiff = last.difficulty;
					targetId = last.puzzleId;
				}
			}

			const activePuz = targetId
				? (getPuzzleById(targetId) ?? getDefaultPuzzle(targetDiff))
				: getDefaultPuzzle(targetDiff);

			setPuzzle(activePuz);
			setCells(new Array(activePuz.width * activePuz.height).fill('empty'));
			setStatus('not_started');
			setElapsedSeconds(0);
			setMoves(0);
			setHistory([]);
			setHistoryIndex(-1);
		}
		init();
	}, [initialDifficulty, initialPuzzleId]);

	// Timer ticker
	useEffect(() => {
		if (status !== 'playing') return;

		const timer = setInterval(() => {
			setElapsedSeconds((prev) => {
				const next = prev + 1;
				// Persist active game periodically
				saveActiveGame({
					puzzleId: puzzleRef.current.id,
					cells: cellsRef.current,
					elapsedSeconds: next,
					moves: movesRef.current,
					status: 'playing',
				});
				return next;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [status]);

	// Auto-pause when page loses focus / window blur
	useEffect(() => {
		const handleBlur = () => {
			if (statusRef.current === 'playing') {
				setStatus('paused');
			}
		};

		window.addEventListener('blur', handleBlur);
		return () => window.removeEventListener('blur', handleBlur);
	}, []);

	// Handle applying a stroke (single click or drag line)
	const handleApplyStroke = useCallback(
		async (actions: MoveAction[]) => {
			if (statusRef.current === 'won' || statusRef.current === 'lost') return;

			const curPuzzle = puzzleRef.current;
			const nextCells = [...cellsRef.current];

			let hasNewMistake = false;
			for (const act of actions) {
				const idx = act.row * curPuzzle.width + act.col;
				cellTogglesRef.current[idx] = (cellTogglesRef.current[idx] ?? 0) + 1;

				if (act.nextState === 'crossed') {
					crossesPlacedRef.current += 1;
					if (!hasPlacedFirstFillRef.current) {
						crossesBeforeFirstFillRef.current += 1;
					}
				} else if (act.nextState === 'filled') {
					hasPlacedFirstFillRef.current = true;
					if (curPuzzle.grid[idx] === 0) {
						mistakesCountRef.current += 1;
						setMistakesCount(mistakesCountRef.current);
						hasNewMistake = true;
					}
				}

				nextCells[idx] = act.nextState;
			}

			// Strikeout check (3 errors committed)
			if (hasNewMistake && mistakesCountRef.current >= 3) {
				cellsRef.current = nextCells;
				setCells(nextCells);
				await handleStrikeout();
				return;
			}

			// Auto-cross completed lines if setting enabled
			if (settingsRef.current.autoCross) {
				// Check rows
				for (let r = 0; r < curPuzzle.height; r++) {
					const rowSlice = nextCells.slice(r * curPuzzle.width, (r + 1) * curPuzzle.width);
					if (isLineCompleted(rowSlice, curPuzzle.rowClues[r])) {
						for (let c = 0; c < curPuzzle.width; c++) {
							const idx = r * curPuzzle.width + c;
							if (nextCells[idx] === 'empty') {
								nextCells[idx] = 'crossed';
							}
						}
					}
				}
				// Check cols
				for (let c = 0; c < curPuzzle.width; c++) {
					const colSlice: CellState[] = [];
					for (let r = 0; r < curPuzzle.height; r++) {
						colSlice.push(nextCells[r * curPuzzle.width + c]);
					}
					if (isLineCompleted(colSlice, curPuzzle.colClues[c])) {
						for (let r = 0; r < curPuzzle.height; r++) {
							const idx = r * curPuzzle.width + c;
							if (nextCells[idx] === 'empty') {
								nextCells[idx] = 'crossed';
							}
						}
					}
				}
			}

			cellsRef.current = nextCells;
			setCells(nextCells);

			// Record in undo/redo history
			setHistory((prev) => {
				const trimmed = prev.slice(0, historyIndex + 1);
				return [...trimmed, { actions }];
			});
			setHistoryIndex((prev) => prev + 1);

			const nextMoves = movesRef.current + 1;
			setMoves(nextMoves);

			if (statusRef.current === 'not_started') {
				setStatus('playing');
			}

			// Win detection
			if (isPuzzleSolved(nextCells, curPuzzle.grid)) {
				setStatus('won');
				const finalSeconds = elapsedRef.current;
				const maxToggles = getMaxSameCellToggles();
				const { isNewBestTime: newBest, record } = await recordPuzzleCompletion(
					curPuzzle.id,
					finalSeconds,
					nextMoves,
				);
				setIsNewBestTime(newBest);
				setSolvedRecords((prev) => ({ ...prev, [curPuzzle.id]: record }));
				setIsVictoryOpen(true);
				await saveActiveGame(null);

				void recordGameResult({
					gameId: 'nonogram',
					won: true,
					playTimeSeconds: finalSeconds,
					levelKey: curPuzzle.difficulty,
					sizeKey: `${curPuzzle.width}x${curPuzzle.height}`,
					roundContext: {
						mistakesCount: mistakesCountRef.current,
						hintsUsed: hintsUsedRef.current,
						crossesPlaced: crossesPlacedRef.current,
						crossesBeforeFirstFill: crossesBeforeFirstFillRef.current,
						maxSameCellToggles: maxToggles,
						boardFillRatioOnDefeat: 0,
						completedPuzzleId: curPuzzle.id,
						difficulty: curPuzzle.difficulty,
						size: `${curPuzzle.width}x${curPuzzle.height}`,
					},
				}).catch((error) => {
					console.warn('[@arcade/nonogram] Failed to record victory medals result:', error);
				});
			} else {
				saveActiveGame({
					puzzleId: curPuzzle.id,
					cells: nextCells,
					elapsedSeconds: elapsedRef.current,
					moves: nextMoves,
					status: 'playing',
				});
			}
		},
		[historyIndex, handleStrikeout, getMaxSameCellToggles],
	);

	// Handle single cell toggle (from keyboard or click)
	const handleToggleCell = useCallback(
		(col: number, row: number, mode: InteractionMode) => {
			if (statusRef.current === 'won' || statusRef.current === 'lost') return;

			const idx = row * puzzleRef.current.width + col;
			const current = cellsRef.current[idx];
			let nextState: CellState = 'empty';

			if (mode === 'fill') {
				nextState = current === 'filled' ? 'empty' : 'filled';
			} else {
				nextState = current === 'crossed' ? 'empty' : 'crossed';
			}

			handleApplyStroke([{ col, row, previousState: current, nextState }]);
		},
		[handleApplyStroke],
	);

	// Undo action
	const handleUndo = useCallback(() => {
		if (historyIndex < 0 || statusRef.current === 'won') return;

		const stroke = history[historyIndex];
		const nextCells = [...cellsRef.current];

		for (const act of stroke.actions) {
			const idx = act.row * puzzleRef.current.width + act.col;
			nextCells[idx] = act.previousState;
		}

		cellsRef.current = nextCells;
		setCells(nextCells);
		setHistoryIndex((prev) => prev - 1);
	}, [history, historyIndex]);

	// Redo action
	const handleRedo = useCallback(() => {
		if (historyIndex >= history.length - 1 || statusRef.current === 'won') return;

		const nextStroke = history[historyIndex + 1];
		const nextCells = [...cellsRef.current];

		for (const act of nextStroke.actions) {
			const idx = act.row * puzzleRef.current.width + act.col;
			nextCells[idx] = act.nextState;
		}

		cellsRef.current = nextCells;
		setCells(nextCells);
		setHistoryIndex((prev) => prev + 1);
	}, [history, historyIndex]);

	// Reset board to initial empty state
	const handleReset = useCallback(async () => {
		const emptyCells = new Array(puzzleRef.current.width * puzzleRef.current.height).fill('empty');
		setCells(emptyCells);
		cellsRef.current = emptyCells;
		setHistory([]);
		setHistoryIndex(-1);
		setStatus('not_started');
		setElapsedSeconds(0);
		setMoves(0);
		mistakesCountRef.current = 0;
		setMistakesCount(0);
		hintsUsedRef.current = 0;
		setHintsUsed(0);
		crossesPlacedRef.current = 0;
		crossesBeforeFirstFillRef.current = 0;
		hasPlacedFirstFillRef.current = false;
		cellTogglesRef.current = {};
		setIsVictoryOpen(false);
		await saveActiveGame(null);
	}, []);

	// Select a new puzzle
	const handleSelectPuzzle = useCallback(async (newPuzzle: NonogramPuzzle) => {
		setPuzzle(newPuzzle);
		puzzleRef.current = newPuzzle;
		saveLastConfig({ difficulty: newPuzzle.difficulty, puzzleId: newPuzzle.id });

		const emptyCells = new Array(newPuzzle.width * newPuzzle.height).fill('empty');
		setCells(emptyCells);
		cellsRef.current = emptyCells;
		setHistory([]);
		setHistoryIndex(-1);
		setStatus('not_started');
		setElapsedSeconds(0);
		setMoves(0);
		mistakesCountRef.current = 0;
		setMistakesCount(0);
		hintsUsedRef.current = 0;
		setHintsUsed(0);
		crossesPlacedRef.current = 0;
		crossesBeforeFirstFillRef.current = 0;
		hasPlacedFirstFillRef.current = false;
		cellTogglesRef.current = {};
		setFocusedCell({ col: 0, row: 0 });
		setIsVictoryOpen(false);
		await saveActiveGame(null);
	}, []);

	// Advance to next puzzle in catalog
	const handleNextPuzzle = useCallback(async () => {
		const currentIdx = PUZZLE_CATALOG.findIndex((p) => p.id === puzzle.id);
		const nextIdx = (currentIdx + 1) % PUZZLE_CATALOG.length;
		await handleSelectPuzzle(PUZZLE_CATALOG[nextIdx]);
	}, [puzzle.id, handleSelectPuzzle]);

	// Pause toggle
	const handleTogglePause = useCallback(() => {
		if (status === 'playing') {
			setStatus('paused');
		} else if (status === 'paused') {
			setStatus('playing');
		}
	}, [status]);

	// Update settings
	const handleUpdateSettings = useCallback(async (newSettings: NonogramSettings) => {
		setSettings(newSettings);
		settingsRef.current = newSettings;
		await saveSettings(newSettings);
	}, []);

	const currentPuzzleIndex = PUZZLE_CATALOG.findIndex((p) => p.id === puzzle.id);
	const hasNextPuzzle = currentPuzzleIndex < PUZZLE_CATALOG.length - 1;

	return {
		puzzle,
		cells,
		status,
		isPaused: status === 'paused',
		isGameOver: status === 'won' || status === 'lost',
		isWon: status === 'won',
		isLost: status === 'lost',
		elapsedSeconds,
		moves,
		mistakesCount,
		hintsUsed,
		focusedCell,
		interactionMode,
		settings,
		solvedRecords,
		isNewBestTime,
		canUndo: historyIndex >= 0,
		canRedo: historyIndex < history.length - 1,
		hasNextPuzzle,
		isVictoryOpen,
		isSettingsOpen,
		isPuzzleSelectOpen,
		setFocusedCell,
		setInteractionMode,
		handleToggleMode: () => setInteractionMode((prev) => (prev === 'fill' ? 'cross' : 'fill')),
		handleApplyStroke,
		handleToggleCell,
		handleUndo,
		handleRedo,
		handleReset,
		handleSelectPuzzle,
		handleNextPuzzle,
		handleTogglePause,
		handleUpdateSettings,
		handleStrikeout,
		handleUseHint: () => {
			hintsUsedRef.current += 1;
			setHintsUsed(hintsUsedRef.current);
		},
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		openPuzzleSelect: () => setIsPuzzleSelectOpen(true),
		closePuzzleSelect: () => setIsPuzzleSelectOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
