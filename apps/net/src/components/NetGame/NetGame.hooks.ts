import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_NET_SETTINGS, type NetSettings } from '../../config/settings.ts';
import { createBoardFromSnapshot, generateNetPuzzle } from '../../engine/generator.ts';
import {
	type HistoryState,
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	createHistory,
	pushMove,
	redoMove,
	undoMove,
} from '../../engine/history.ts';
import { rotateCCW, rotateCW } from '../../engine/rotator.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.ts';
import type { Board, Difficulty, GameSnapshot, Move } from '../../engine/types.ts';
import { type ValidationResult, updateBoardPoweredState, validateBoard } from '../../engine/validator.ts';

export interface UseNetGameOptions {
	initialDifficulty?: Difficulty;
	formatLiveStatus?: (powered: number, total: number, moves: number) => string;
	formatSolvedAnnouncement?: () => string;
}

export function useNetGame({
	initialDifficulty = 'easy',
	formatLiveStatus,
	formatSolvedAnnouncement,
}: UseNetGameOptions) {
	const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
	const [board, setBoard] = useState<Board>(() => generateNetPuzzle(initialDifficulty));
	const [history, setHistory] = useState<HistoryState>(createHistory());
	const [movesCount, setMovesCount] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);

	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');

	const [settings, setSettings] = useState<NetSettings>(DEFAULT_NET_SETTINGS);
	const [isLoaded, setIsLoaded] = useState(false);

	const undoUsedRef = useRef(false);
	const hasRecordedWinRef = useRef(false);
	const boardRef = useRef(board);
	boardRef.current = board;

	// Initial load: settings and active session restore
	useEffect(() => {
		let isMounted = true;
		async function initSession() {
			const savedSettings = await loadSettings();
			if (!isMounted) return;
			setSettings(savedSettings);

			const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
			const shouldResume = searchParams?.get('resume') === 'true';
			const isExplicitNew = searchParams?.get('new') === 'true';

			if (shouldResume && !isExplicitNew) {
				const activeSnapshot = await loadActiveGame();
				if (activeSnapshot && !activeSnapshot.isSolved && isMounted) {
					const restored = createBoardFromSnapshot(activeSnapshot);
					setBoard(restored);
					setDifficulty(activeSnapshot.difficulty);
					setMovesCount(activeSnapshot.movesCount);
					setElapsedSeconds(activeSnapshot.elapsedTimeSeconds);
					setIsPaused(true); // Resume paused
					setIsLoaded(true);
					return;
				}
			}

			if (isMounted) {
				setIsLoaded(true);
			}
		}

		void initSession();
		return () => {
			isMounted = false;
		};
	}, []);

	// Timer ticker
	useEffect(() => {
		if (!isLoaded || isPaused || isComplete || settings.casualMode) return;
		const timer = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(timer);
	}, [isLoaded, isPaused, isComplete, settings.casualMode]);

	// Auto-save active game snapshot
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		const snapshot: GameSnapshot = {
			difficulty,
			rows: board.rows,
			cols: board.cols,
			rootRow: board.rootRow,
			rootCol: board.rootCol,
			cells: board.grid.flatMap((row) =>
				row.map((cell) => ({
					row: cell.row,
					col: cell.col,
					solutionMask: cell.solutionMask,
					currentMask: cell.currentMask,
					rotation: cell.rotation,
					isLocked: cell.isLocked,
				})),
			),
			movesCount,
			elapsedTimeSeconds: elapsedSeconds,
			isSolved: false,
			timestamp: Date.now(),
		};

		void saveActiveGame(snapshot);
	}, [isLoaded, isComplete, board, difficulty, movesCount, elapsedSeconds]);

	// Win detection and telemetry
	const checkWinCondition = useCallback(
		async (nextBoard: Board, nextMoves: number) => {
			const validation = validateBoard(nextBoard);
			if (validation.isSolved && !hasRecordedWinRef.current) {
				hasRecordedWinRef.current = true;
				setIsComplete(true);
				setIsVictoryOpen(true);
				void clearActiveGame();

				if (formatSolvedAnnouncement) {
					setLiveAnnouncement(formatSolvedAnnouncement());
				}

				try {
					const completion = await recordPuzzleCompletion(difficulty, elapsedSeconds, nextMoves);
					setIsNewBestTime(completion.isNewBestTime);
				} catch {
					// Non-fatal stats error
				}

				try {
					await recordGameResult({
						gameId: 'net',
						won: true,
						playTimeSeconds: elapsedSeconds,
						levelKey: difficulty,
						roundContext: {
							difficulty,
							movesCount: nextMoves,
							undoUsed: undoUsedRef.current,
						},
					});
				} catch {
					// Non-fatal medals error
				}
			} else if (formatLiveStatus) {
				setLiveAnnouncement(formatLiveStatus(validation.poweredCount, validation.totalCells, nextMoves));
			}
		},
		[difficulty, elapsedSeconds, formatLiveStatus, formatSolvedAnnouncement],
	);

	const handleRotateCW = useCallback(
		(r: number, c: number) => {
			if (isComplete || isPaused) return;
			const currentCell = board.grid[r][c];
			if (currentCell.isLocked) return;

			const newMask = rotateCW(currentCell.currentMask);
			const newRot = currentCell.rotation + 90;

			const move: Move = {
				row: r,
				col: c,
				previousMask: currentCell.currentMask,
				newMask,
				previousRotation: currentCell.rotation,
				newRotation: newRot,
			};

			setHistory((prev) => pushMove(prev, move));

			const newGrid = board.grid.map((rowCells, rowIdx) =>
				rowCells.map((cell, colIdx) => {
					if (rowIdx === r && colIdx === c) {
						return { ...cell, currentMask: newMask, rotation: newRot };
					}
					return cell;
				}),
			);

			const updatedBoard = updateBoardPoweredState({ ...board, grid: newGrid });
			const nextMoves = movesCount + 1;
			setBoard(updatedBoard);
			setMovesCount(nextMoves);

			void checkWinCondition(updatedBoard, nextMoves);
		},
		[board, checkWinCondition, isComplete, isPaused, movesCount],
	);

	const handleRotateCCW = useCallback(
		(r: number, c: number) => {
			if (isComplete || isPaused) return;
			const currentCell = board.grid[r][c];
			if (currentCell.isLocked) return;

			const newMask = rotateCCW(currentCell.currentMask);
			const newRot = currentCell.rotation - 90;

			const move: Move = {
				row: r,
				col: c,
				previousMask: currentCell.currentMask,
				newMask,
				previousRotation: currentCell.rotation,
				newRotation: newRot,
			};

			setHistory((prev) => pushMove(prev, move));

			const newGrid = board.grid.map((rowCells, rowIdx) =>
				rowCells.map((cell, colIdx) => {
					if (rowIdx === r && colIdx === c) {
						return { ...cell, currentMask: newMask, rotation: newRot };
					}
					return cell;
				}),
			);

			const updatedBoard = updateBoardPoweredState({ ...board, grid: newGrid });
			const nextMoves = movesCount + 1;
			setBoard(updatedBoard);
			setMovesCount(nextMoves);

			void checkWinCondition(updatedBoard, nextMoves);
		},
		[board, checkWinCondition, isComplete, isPaused, movesCount],
	);

	const handleToggleLock = useCallback(
		(r: number, c: number) => {
			if (isComplete || isPaused) return;
			const newGrid = board.grid.map((rowCells, rowIdx) =>
				rowCells.map((cell, colIdx) => {
					if (rowIdx === r && colIdx === c) {
						return { ...cell, isLocked: !cell.isLocked };
					}
					return cell;
				}),
			);
			setBoard({ ...board, grid: newGrid });
		},
		[board, isComplete, isPaused],
	);

	const handleUndo = useCallback(() => {
		if (isComplete || isPaused || !checkCanUndo(history)) return;
		undoUsedRef.current = true;
		const { nextHistory, move } = undoMove(history);
		if (!move) return;

		setHistory(nextHistory);
		const newGrid = board.grid.map((rowCells, r) =>
			rowCells.map((cell, c) => {
				if (r === move.row && c === move.col) {
					return {
						...cell,
						currentMask: move.previousMask,
						rotation: move.previousRotation,
					};
				}
				return cell;
			}),
		);

		const updatedBoard = updateBoardPoweredState({ ...board, grid: newGrid });
		setBoard(updatedBoard);
	}, [board, history, isComplete, isPaused]);

	const handleRedo = useCallback(() => {
		if (isComplete || isPaused || !checkCanRedo(history)) return;
		const { nextHistory, move } = redoMove(history);
		if (!move) return;

		setHistory(nextHistory);
		const newGrid = board.grid.map((rowCells, r) =>
			rowCells.map((cell, c) => {
				if (r === move.row && c === move.col) {
					return {
						...cell,
						currentMask: move.newMask,
						rotation: move.newRotation,
					};
				}
				return cell;
			}),
		);

		const updatedBoard = updateBoardPoweredState({ ...board, grid: newGrid });
		setBoard(updatedBoard);
	}, [board, history, isComplete, isPaused]);

	const handleReset = useCallback(() => {
		const newPuzzle = generateNetPuzzle(difficulty);
		setBoard(newPuzzle);
		setHistory(createHistory());
		setMovesCount(0);
		setElapsedSeconds(0);
		setIsComplete(false);
		setIsVictoryOpen(false);
		hasRecordedWinRef.current = false;
		undoUsedRef.current = false;
	}, [difficulty]);

	const handleNewPuzzle = useCallback(
		(nextDiff?: Difficulty) => {
			const targetDiff = nextDiff ?? difficulty;
			if (nextDiff) {
				setDifficulty(nextDiff);
			}
			const newPuzzle = generateNetPuzzle(targetDiff);
			setBoard(newPuzzle);
			setHistory(createHistory());
			setMovesCount(0);
			setElapsedSeconds(0);
			setIsComplete(false);
			setIsVictoryOpen(false);
			hasRecordedWinRef.current = false;
			undoUsedRef.current = false;
		},
		[difficulty],
	);

	const handleTogglePause = useCallback(() => {
		setIsPaused((prev) => !prev);
	}, []);

	const handleUpdateSettings = useCallback((newSettings: NetSettings) => {
		setSettings(newSettings);
		void saveSettings(newSettings);
	}, []);

	return {
		board,
		difficulty,
		validation: validateBoard(board),
		movesCount,
		elapsedSeconds,
		isPaused,
		isComplete,
		isNewBestTime,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		isRulesOpen,
		isSettingsOpen,
		isVictoryOpen,
		liveAnnouncement,
		settings,
		handleRotateCW,
		handleRotateCCW,
		handleToggleLock,
		handleUndo,
		handleRedo,
		handleReset,
		handleNewPuzzle,
		handleTogglePause,
		handleUpdateSettings,
		openRules: () => setIsRulesOpen(true),
		closeRules: () => setIsRulesOpen(false),
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
