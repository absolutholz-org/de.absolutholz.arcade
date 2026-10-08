import { useCallback, useEffect, useRef, useState } from 'react';
import {
	BOARD_SIZES,
	type BoardSizeId,
	type Cell,
	DEFAULT_MINESWEEPER_SETTINGS,
	DIFFICULTIES,
	type DifficultyId,
	type GameStatus,
	type MinesweeperSettings,
	chordCell,
	createEmptyBoard,
	cycleFlagState,
	getMineCount,
	loadActiveGame,
	loadLastConfig,
	loadSettings,
	placeMines,
	recordHighScore,
	revealCell,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine';

export function useMinesweeperGame(initialSize: BoardSizeId = 'md', initialDifficulty: DifficultyId = 'medium') {
	const [size, setSize] = useState<BoardSizeId>(initialSize);
	const [difficulty, setDifficulty] = useState<DifficultyId>(initialDifficulty);
	const [cells, setCells] = useState<Cell[]>(() => {
		const config = BOARD_SIZES[initialSize] ?? BOARD_SIZES.md;
		return createEmptyBoard(config.columns, config.rows);
	});
	const [minesPlaced, setMinesPlaced] = useState(false);
	const [status, setStatus] = useState<GameStatus>('not_started');
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [focusedCell, setFocusedCell] = useState<{ col: number; row: number } | null>({ col: 0, row: 0 });
	const [interactionMode, setInteractionMode] = useState<'reveal' | 'flag'>('reveal');
	const [settings, setSettings] = useState<MinesweeperSettings>(DEFAULT_MINESWEEPER_SETTINGS);
	const [rankPosition, setRankPosition] = useState(-1);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isDefeatOpen, setIsDefeatOpen] = useState(false);
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
			setCells(createEmptyBoard(cfg.columns, cfg.rows));
			setMinesPlaced(false);
			setStatus('not_started');
			setElapsedSeconds(0);
		}
		init();
	}, [initialSize, initialDifficulty]);

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

			if (result.detonated) {
				setStatus('lost');
				setIsDefeatOpen(true);
				await saveActiveGame(null);
			} else if (result.won) {
				setStatus('won');
				const finalSeconds = elapsedRef.current;
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
		},
		[interactionMode],
	);

	// Handle flag toggle
	const handleFlag = useCallback(async (col: number, row: number) => {
		if (statusRef.current === 'won' || statusRef.current === 'lost') return;

		const currentSizeConfig = BOARD_SIZES[sizeRef.current];
		const index = row * currentSizeConfig.columns + col;
		const cell = cellsRef.current[index];
		if (!cell || cell.state === 'revealed') return;

		const nextState = cycleFlagState(cell.state, settingsRef.current.questionMarks);
		const newCells = cellsRef.current.map((c, i) => (i === index ? { ...c, state: nextState } : c));
		cellsRef.current = newCells;
		setCells(newCells);

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
	const handleChord = useCallback(async (col: number, row: number) => {
		if (statusRef.current !== 'playing') return;

		const currentSizeConfig = BOARD_SIZES[sizeRef.current];
		const count = getMineCount(currentSizeConfig.fieldCount, difficultyRef.current);
		const result = chordCell(cellsRef.current, currentSizeConfig.columns, currentSizeConfig.rows, col, row, count);

		cellsRef.current = result.cells;
		setCells(result.cells);

		if (result.detonated) {
			setStatus('lost');
			setIsDefeatOpen(true);
			await saveActiveGame(null);
		} else if (result.won) {
			setStatus('won');
			const finalSeconds = elapsedRef.current;
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
	}, []);

	const handleTogglePause = useCallback(() => {
		if (status === 'playing') {
			setStatus('paused');
		} else if (status === 'paused') {
			setStatus('playing');
		}
	}, [status]);

	const handleRestart = useCallback(async () => {
		const cfg = BOARD_SIZES[sizeRef.current];
		setCells(createEmptyBoard(cfg.columns, cfg.rows));
		setMinesPlaced(false);
		setStatus('not_started');
		setElapsedSeconds(0);
		setIsVictoryOpen(false);
		setIsDefeatOpen(false);
		await saveActiveGame(null);
	}, []);

	const handleStartNewGame = useCallback(async (newSize: BoardSizeId, newDiff: DifficultyId) => {
		setSize(newSize);
		setDifficulty(newDiff);
		saveLastConfig({ size: newSize, difficulty: newDiff });
		const cfg = BOARD_SIZES[newSize];
		setCells(createEmptyBoard(cfg.columns, cfg.rows));
		setMinesPlaced(false);
		setStatus('not_started');
		setElapsedSeconds(0);
		setIsVictoryOpen(false);
		setIsDefeatOpen(false);
		await saveActiveGame(null);
	}, []);

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
		isSettingsOpen,
		setFocusedCell,
		handleReveal,
		handleFlag,
		handleChord,
		handleTogglePause,
		handleRestart,
		handleStartNewGame,
		handleUpdateSettings,
		handleToggleInteractionMode,
		handleToggleFitToScreen,
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		closeDefeat: () => setIsDefeatOpen(false),
	};
}
