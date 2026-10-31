import { recordGameResult } from '@arcade/lib-medals';
import { recordGameStats } from '@arcade/lib-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MINESWEEPER_MEDAL_DEFINITIONS } from '../../config/medals';
import {
	BOARD_SIZES,
	type BoardSizeId,
	type Cell,
	DEFAULT_MINESWEEPER_SETTINGS,
	DIFFICULTIES,
	type DifficultyId,
	type GameStatus,
	type HistoryState,
	type MinesweeperSettings,
	canRedo,
	canUndo,
	chordCell,
	createEmptyBoard,
	createHistory,
	cycleFlagState,
	getMineCount,
	loadActiveGame,
	loadLastConfig,
	loadSettings,
	placeMines,
	pushHistory,
	recordHighScore,
	redoHistory,
	revealCell,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
	undoHistory,
} from '../../engine';

const BOARD_SIZE_NAME_MAP: Record<BoardSizeId, string> = {
	xs: 'extraSmall',
	sm: 'small',
	md: 'medium',
	lg: 'large',
	xl: 'extraLarge',
};

export function useMinesweeperGame(initialSize: BoardSizeId = 'md', initialDifficulty: DifficultyId = 'medium') {
	const [size, setSize] = useState<BoardSizeId>(initialSize);
	const [difficulty, setDifficulty] = useState<DifficultyId>(initialDifficulty);
	const [cells, setCells] = useState<Cell[]>(() => {
		const config = BOARD_SIZES[initialSize] ?? BOARD_SIZES.md;
		return createEmptyBoard(config.columns, config.rows);
	});
	const [minesPlaced, setMinesPlaced] = useState(false);
	const [status, setStatus] = useState<GameStatus>('not_started');
	const [history, setHistory] = useState<HistoryState>(() => {
		const config = BOARD_SIZES[initialSize] ?? BOARD_SIZES.md;
		return createHistory({
			cells: createEmptyBoard(config.columns, config.rows),
			minesPlaced: false,
			status: 'not_started',
		});
	});
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [focusedCell, setFocusedCell] = useState<{ col: number; row: number } | null>({ col: 0, row: 0 });
	const [interactionMode, setInteractionMode] = useState<'reveal' | 'flag'>('reveal');
	const [settings, setSettings] = useState<MinesweeperSettings>(DEFAULT_MINESWEEPER_SETTINGS);
	const [rankPosition, setRankPosition] = useState(-1);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isDefeatOpen, setIsDefeatOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const sizeConfig = BOARD_SIZES[size] ?? BOARD_SIZES.md;
	const { columns, rows, fieldCount } = sizeConfig;
	const mineCount = getMineCount(fieldCount, difficulty);

	const flagCount = cells.filter((c) => c.state === 'flagged').length;
	const minesLeft = mineCount - flagCount;

	const statusRef = useRef(status);
	statusRef.current = status;

	const cellsRef = useRef(cells);
	cellsRef.current = cells;

	const minesPlacedRef = useRef(minesPlaced);
	minesPlacedRef.current = minesPlaced;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const sizeRef = useRef(size);
	sizeRef.current = size;

	const difficultyRef = useRef(difficulty);
	difficultyRef.current = difficulty;

	const flagsPlacedRef = useRef(0);
	const chordsUsedRef = useRef(0);
	const maxCascadeTilesRef = useRef(0);
	const hasRevealedEightRef = useRef(false);
	const safeMoveIndexRef = useRef(0);
	const cornerMovesCountRef = useRef(0);
	const cornersClearedInFirstFourRef = useRef(false);
	const perfectFlaggingRef = useRef(true);

	const resetSessionTracking = useCallback(() => {
		flagsPlacedRef.current = 0;
		chordsUsedRef.current = 0;
		maxCascadeTilesRef.current = 0;
		hasRevealedEightRef.current = false;
		safeMoveIndexRef.current = 0;
		cornerMovesCountRef.current = 0;
		cornersClearedInFirstFourRef.current = false;
		perfectFlaggingRef.current = true;
	}, []);

	const dispatchMedalResult = useCallback((won: boolean, finalSeconds: number) => {
		const currentSizeConfig = BOARD_SIZES[sizeRef.current];
		const totalMines = getMineCount(currentSizeConfig.fieldCount, difficultyRef.current);
		const safeTilesCleared = cellsRef.current.filter((c) => c.state === 'revealed' && !c.mine).length;
		const currentSizeName = BOARD_SIZE_NAME_MAP[sizeRef.current];

		void recordGameStats({
			gameId: 'minesweeper',
			won,
			bucketKey: difficultyRef.current,
			playTimeSeconds: Math.max(1, finalSeconds),
			moves: safeMoveIndexRef.current,
			isFlawless: won && perfectFlaggingRef.current,
		});

		void recordGameResult(
			{
				gameId: 'minesweeper',
				won,
				playTimeSeconds: finalSeconds,
				levelKey: difficultyRef.current,
				sizeKey: sizeRef.current,
				roundContext: {
					flagsPlaced: flagsPlacedRef.current,
					chordsUsed: chordsUsedRef.current,
					boardSize: currentSizeName,
					size: currentSizeName,
					difficulty: difficultyRef.current,
					firstMoveLoss: !won && finalSeconds <= 3,
					maxCascadeTiles: maxCascadeTilesRef.current,
					hasRevealedEight: hasRevealedEightRef.current,
					cornerMovesCount: cornerMovesCountRef.current,
					cornersClearedInFirstFour: cornersClearedInFirstFourRef.current,
					perfectFlagging: perfectFlaggingRef.current,
					safeTilesCleared,
					totalMines,
				},
			},
			{ definitions: MINESWEEPER_MEDAL_DEFINITIONS },
		).catch((error) => {
			console.warn(`[@arcade/minesweeper] Failed to record ${won ? 'victory' : 'defeat'} medals result:`, error);
		});
	}, []);

	// Load settings & active game on initial mount
	useEffect(() => {
		async function init() {
			const loadedSettings = await loadSettings();
			setSettings(loadedSettings);

			let targetSize = initialSize;
			let targetDiff = initialDifficulty;

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const querySize = params.get('size') as BoardSizeId;
				const queryDiff = params.get('difficulty') as DifficultyId;
				const isNew = params.get('new') === 'true';
				const isResume = params.get('resume') === 'true';

				if (querySize && BOARD_SIZES[querySize]) targetSize = querySize;
				if (queryDiff && DIFFICULTIES[queryDiff]) targetDiff = queryDiff;

				if (isResume || !isNew) {
					const saved = await loadActiveGame();
					if (saved && saved.status === 'playing') {
						setSize(saved.size);
						setDifficulty(saved.difficulty);
						setCells(saved.cells);
						setMinesPlaced(saved.minesPlaced);
						setElapsedSeconds(saved.elapsedSeconds);
						setStatus('playing');
						setHistory(
							createHistory({
								cells: saved.cells,
								minesPlaced: saved.minesPlaced,
								status: 'playing',
							}),
						);
						return;
					}
				}
			}

			const lastConfig = await loadLastConfig();
			if (!targetSize && lastConfig?.size) targetSize = lastConfig.size;
			if (!targetDiff && lastConfig?.difficulty) targetDiff = lastConfig.difficulty;

			setSize(targetSize);
			setDifficulty(targetDiff);
			const cfg = BOARD_SIZES[targetSize] ?? BOARD_SIZES.md;
			const empty = createEmptyBoard(cfg.columns, cfg.rows);
			setCells(empty);
			setMinesPlaced(false);
			setStatus('not_started');
			setElapsedSeconds(0);
			setHistory(
				createHistory({
					cells: empty,
					minesPlaced: false,
					status: 'not_started',
				}),
			);
			resetSessionTracking();
		}
		init();
	}, [initialSize, initialDifficulty, resetSessionTracking]);

	// Timer ticker
	useEffect(() => {
		if (status !== 'playing') return;

		const timer = setInterval(() => {
			setElapsedSeconds((prev) => {
				const next = prev + 1;
				// Persist active game periodically
				saveActiveGame({
					size: sizeRef.current,
					difficulty: difficultyRef.current,
					columns: BOARD_SIZES[sizeRef.current].columns,
					rows: BOARD_SIZES[sizeRef.current].rows,
					cells: cellsRef.current,
					mineCount: getMineCount(BOARD_SIZES[sizeRef.current].fieldCount, difficultyRef.current),
					elapsedSeconds: next,
					minesPlaced: minesPlacedRef.current,
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

	// Handle reveal
	const handleReveal = useCallback(
		async (col: number, row: number) => {
			if (statusRef.current === 'won' || statusRef.current === 'lost') return;

			if (interactionMode === 'flag') {
				handleFlag(col, row);
				return;
			}

			let currentCells = cellsRef.current;
			let isPlaced = minesPlacedRef.current;

			if (!isPlaced) {
				const currentSizeConfig = BOARD_SIZES[sizeRef.current];
				const count = getMineCount(currentSizeConfig.fieldCount, difficultyRef.current);
				currentCells = placeMines(
					currentCells,
					currentSizeConfig.columns,
					currentSizeConfig.rows,
					count,
					settingsRef.current.firstClickSafe ? col : undefined,
					settingsRef.current.firstClickSafe ? row : undefined,
				);
				isPlaced = true;
				setMinesPlaced(true);
			}

			if (statusRef.current === 'not_started') {
				setStatus('playing');
			}

			const currentSizeConfig = BOARD_SIZES[sizeRef.current];
			const count = getMineCount(currentSizeConfig.fieldCount, difficultyRef.current);
			const result = revealCell(currentCells, currentSizeConfig.columns, currentSizeConfig.rows, col, row, count);

			cellsRef.current = result.cells;
			setCells(result.cells);

			if (result.revealedCountChange > 0) {
				maxCascadeTilesRef.current = Math.max(maxCascadeTilesRef.current, result.revealedCountChange);
			}

			if (result.cells.some((c) => c.state === 'revealed' && c.nearMineCount === 8)) {
				hasRevealedEightRef.current = true;
			}

			if (!result.detonated && safeMoveIndexRef.current < 4) {
				safeMoveIndexRef.current += 1;
				const maxCol = currentSizeConfig.columns - 1;
				const maxRow = currentSizeConfig.rows - 1;
				const isCorner =
					(col === 0 && row === 0) ||
					(col === maxCol && row === 0) ||
					(col === 0 && row === maxRow) ||
					(col === maxCol && row === maxRow);

				if (isCorner) {
					cornerMovesCountRef.current += 1;
				}

				const isCornerRevealed = (c: number, r: number) => {
					const cell = result.cells[r * currentSizeConfig.columns + c];
					return cell?.state === 'revealed';
				};
				const allCornersRevealed =
					isCornerRevealed(0, 0) &&
					isCornerRevealed(maxCol, 0) &&
					isCornerRevealed(0, maxRow) &&
					isCornerRevealed(maxCol, maxRow);

				if (allCornersRevealed) {
					cornersClearedInFirstFourRef.current = true;
				}
			}

			if (result.detonated) {
				setStatus('lost');
				setIsDefeatOpen(true);
				await saveActiveGame(null);
				dispatchMedalResult(false, elapsedRef.current);
			} else if (result.won) {
				setStatus('won');
				const finalSeconds = elapsedRef.current;
				dispatchMedalResult(true, finalSeconds);
				const { position } = await recordHighScore({
					id: `${Date.now()}`,
					seconds: finalSeconds,
					size: sizeRef.current,
					difficulty: difficultyRef.current,
					fields: currentSizeConfig.fieldCount,
					mines: count,
					timestamp: new Date().toISOString(),
				});
				setRankPosition(position);
				setIsVictoryOpen(true);
				await saveActiveGame(null);
			}

			const nextStatus: GameStatus = result.detonated ? 'lost' : result.won ? 'won' : 'playing';
			setHistory((prev) =>
				pushHistory(prev, {
					cells: result.cells,
					minesPlaced: true,
					status: nextStatus,
				}),
			);
		},
		[interactionMode, dispatchMedalResult],
	);

	// Handle flag toggle
	const handleFlag = useCallback(async (col: number, row: number) => {
		if (statusRef.current === 'won' || statusRef.current === 'lost') return;

		const currentSizeConfig = BOARD_SIZES[sizeRef.current];
		const index = row * currentSizeConfig.columns + col;
		const cell = cellsRef.current[index];
		if (!cell || cell.state === 'revealed') return;

		const nextState = cycleFlagState(cell.state, settingsRef.current.questionMarks);
		if (nextState === 'flagged') {
			flagsPlacedRef.current += 1;
			if (!cell.mine) {
				perfectFlaggingRef.current = false;
			}
		} else if (cell.state === 'flagged') {
			perfectFlaggingRef.current = false;
		}
		const newCells = cellsRef.current.map((c, i) => (i === index ? { ...c, state: nextState } : c));
		cellsRef.current = newCells;
		setCells(newCells);

		const nextStatus: GameStatus = statusRef.current === 'not_started' ? 'playing' : statusRef.current;
		setHistory((prev) =>
			pushHistory(prev, {
				cells: newCells,
				minesPlaced: minesPlacedRef.current,
				status: nextStatus,
			}),
		);

		if (statusRef.current === 'playing') {
			saveActiveGame({
				size: sizeRef.current,
				difficulty: difficultyRef.current,
				columns: currentSizeConfig.columns,
				rows: currentSizeConfig.rows,
				cells: newCells,
				mineCount: getMineCount(currentSizeConfig.fieldCount, difficultyRef.current),
				elapsedSeconds: elapsedRef.current,
				minesPlaced: minesPlacedRef.current,
				status: 'playing',
			});
		}
	}, []);

	// Handle chord
	const handleChord = useCallback(
		async (col: number, row: number) => {
			if (statusRef.current !== 'playing') return;

			chordsUsedRef.current += 1;
			const currentSizeConfig = BOARD_SIZES[sizeRef.current];
			const count = getMineCount(currentSizeConfig.fieldCount, difficultyRef.current);
			const result = chordCell(
				cellsRef.current,
				currentSizeConfig.columns,
				currentSizeConfig.rows,
				col,
				row,
				count,
			);

			cellsRef.current = result.cells;
			setCells(result.cells);

			if (result.revealedCountChange > 0) {
				maxCascadeTilesRef.current = Math.max(maxCascadeTilesRef.current, result.revealedCountChange);
			}

			if (result.cells.some((c) => c.state === 'revealed' && c.nearMineCount === 8)) {
				hasRevealedEightRef.current = true;
			}

			if (result.detonated) {
				setStatus('lost');
				setIsDefeatOpen(true);
				await saveActiveGame(null);
				dispatchMedalResult(false, elapsedRef.current);
			} else if (result.won) {
				setStatus('won');
				const finalSeconds = elapsedRef.current;
				dispatchMedalResult(true, finalSeconds);
				const { position } = await recordHighScore({
					id: `${Date.now()}`,
					seconds: finalSeconds,
					size: sizeRef.current,
					difficulty: difficultyRef.current,
					fields: currentSizeConfig.fieldCount,
					mines: count,
					timestamp: new Date().toISOString(),
				});
				setRankPosition(position);
				setIsVictoryOpen(true);
				await saveActiveGame(null);
			}

			const nextStatus: GameStatus = result.detonated ? 'lost' : result.won ? 'won' : 'playing';
			setHistory((prev) =>
				pushHistory(prev, {
					cells: result.cells,
					minesPlaced: true,
					status: nextStatus,
				}),
			);
		},
		[dispatchMedalResult],
	);

	const handleTogglePause = useCallback(() => {
		if (status === 'playing') {
			setStatus('paused');
		} else if (status === 'paused') {
			setStatus('playing');
		}
	}, [status]);

	const handleRestart = useCallback(async () => {
		const cfg = BOARD_SIZES[sizeRef.current];
		const empty = createEmptyBoard(cfg.columns, cfg.rows);
		setCells(empty);
		setMinesPlaced(false);
		setStatus('not_started');
		setElapsedSeconds(0);
		setHistory(
			createHistory({
				cells: empty,
				minesPlaced: false,
				status: 'not_started',
			}),
		);
		resetSessionTracking();
		setIsVictoryOpen(false);
		setIsDefeatOpen(false);
		await saveActiveGame(null);
	}, [resetSessionTracking]);

	const handleStartNewGame = useCallback(
		async (newSize: BoardSizeId, newDiff: DifficultyId) => {
			setSize(newSize);
			setDifficulty(newDiff);
			saveLastConfig({ size: newSize, difficulty: newDiff });
			const cfg = BOARD_SIZES[newSize];
			const empty = createEmptyBoard(cfg.columns, cfg.rows);
			setCells(empty);
			setMinesPlaced(false);
			setStatus('not_started');
			setElapsedSeconds(0);
			setHistory(
				createHistory({
					cells: empty,
					minesPlaced: false,
					status: 'not_started',
				}),
			);
			resetSessionTracking();
			setIsVictoryOpen(false);
			setIsDefeatOpen(false);
			await saveActiveGame(null);
		},
		[resetSessionTracking],
	);

	const handleUndo = useCallback(() => {
		setHistory((prev) => {
			if (!canUndo(prev)) return prev;
			const next = undoHistory(prev);
			const step = next.present;
			cellsRef.current = step.cells;
			minesPlacedRef.current = step.minesPlaced;
			statusRef.current = step.status;
			setCells(step.cells);
			setMinesPlaced(step.minesPlaced);
			setStatus(step.status);
			if (step.status !== 'lost') {
				setIsDefeatOpen(false);
			}
			if (step.status !== 'won') {
				setIsVictoryOpen(false);
			}
			const currentSizeConfig = BOARD_SIZES[sizeRef.current];
			if (step.status === 'playing') {
				saveActiveGame({
					size: sizeRef.current,
					difficulty: difficultyRef.current,
					columns: currentSizeConfig.columns,
					rows: currentSizeConfig.rows,
					cells: step.cells,
					mineCount: getMineCount(currentSizeConfig.fieldCount, difficultyRef.current),
					elapsedSeconds: elapsedRef.current,
					minesPlaced: step.minesPlaced,
					status: 'playing',
				});
			}
			return next;
		});
	}, []);

	const handleRedo = useCallback(() => {
		setHistory((prev) => {
			if (!canRedo(prev)) return prev;
			const next = redoHistory(prev);
			const step = next.present;
			cellsRef.current = step.cells;
			minesPlacedRef.current = step.minesPlaced;
			statusRef.current = step.status;
			setCells(step.cells);
			setMinesPlaced(step.minesPlaced);
			setStatus(step.status);
			if (step.status === 'lost') {
				setIsDefeatOpen(true);
			} else if (step.status === 'won') {
				setIsVictoryOpen(true);
			}
			const currentSizeConfig = BOARD_SIZES[sizeRef.current];
			if (step.status === 'playing') {
				saveActiveGame({
					size: sizeRef.current,
					difficulty: difficultyRef.current,
					columns: currentSizeConfig.columns,
					rows: currentSizeConfig.rows,
					cells: step.cells,
					mineCount: getMineCount(currentSizeConfig.fieldCount, difficultyRef.current),
					elapsedSeconds: elapsedRef.current,
					minesPlaced: step.minesPlaced,
					status: 'playing',
				});
			}
			return next;
		});
	}, []);

	// Keyboard shortcuts for Undo and Redo
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isSettingsOpen || isRulesOpen) return;

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
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isSettingsOpen, isRulesOpen, handleUndo, handleRedo]);

	const handleUpdateSettings = useCallback(async (newSettings: MinesweeperSettings) => {
		setSettings(newSettings);
		await saveSettings(newSettings);
	}, []);

	const handleToggleInteractionMode = useCallback(() => {
		setInteractionMode((prev) => (prev === 'reveal' ? 'flag' : 'reveal'));
	}, []);

	const handleToggleFitToScreen = useCallback(async () => {
		const nextFit = !settingsRef.current.fitToScreen;
		const nextSettings: MinesweeperSettings = {
			...settingsRef.current,
			fitToScreen: nextFit,
		};
		setSettings(nextSettings);
		await saveSettings(nextSettings);
	}, []);

	return {
		size,
		difficulty,
		columns,
		rows,
		cells,
		mineCount,
		minesLeft,
		elapsedSeconds,
		status,
		isPaused: status === 'paused',
		isGameOver: status === 'lost' || status === 'won',
		isWon: status === 'won',
		focusedCell,
		interactionMode,
		settings,
		rankPosition,
		isVictoryOpen,
		isDefeatOpen,
		isRulesOpen,
		isSettingsOpen,
		canUndo: canUndo(history),
		canRedo: canRedo(history),
		setFocusedCell,
		handleReveal,
		handleFlag,
		handleChord,
		handleUndo,
		handleRedo,
		handleTogglePause,
		handleRestart,
		handleStartNewGame,
		handleUpdateSettings,
		handleToggleInteractionMode,
		handleToggleFitToScreen,
		openSettings: () => {
			setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
			setIsSettingsOpen(true);
		},
		closeSettings: () => {
			setIsSettingsOpen(false);
			setStatus((prev) => (prev === 'paused' ? 'playing' : prev));
		},
		openRules: () => {
			setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
			setIsRulesOpen(true);
		},
		closeRules: () => {
			setIsRulesOpen(false);
			setStatus((prev) => (prev === 'paused' ? 'playing' : prev));
		},
		closeVictory: () => setIsVictoryOpen(false),
		closeDefeat: () => setIsDefeatOpen(false),
	};
}
