import { playDrop, playProgress, playTap, playVictoryFanfare } from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LASERS_MEDAL_DEFINITIONS } from '../../config/medals';
import { generatePuzzle } from '../../engine/generator';
import {
	type HistoryState,
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	createHistory,
	pushHistory,
	redoHistory,
	resetHistory,
	undoHistory,
} from '../../engine/history';
import { createRandomSeed } from '../../engine/prng';
import { findHintCell, rotateCellAt, traceBeams } from '../../engine/raytrace';
import {
	clearActiveGame,
	loadActiveGame,
	loadLastConfig,
	loadSettings,
	recordLasersRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	type CellCoord,
	DEFAULT_LASERS_SETTINGS,
	DIFFICULTIES,
	type Difficulty,
	type GameSnapshot,
	type LaserPuzzle,
	type LasersSettings,
	type MirrorOrientation,
} from '../../engine/types';

export type RotateOutcome =
	| { readonly rotated: false }
	| {
			readonly rotated: true;
			readonly kind: 'mirror' | 'splitter';
			readonly orientation: MirrorOrientation;
			readonly litTargets: number;
			readonly totalTargets: number;
			readonly isSolved: boolean;
	  };

export type HintOutcome =
	| { readonly applied: false }
	| {
			readonly applied: true;
			readonly row: number;
			readonly col: number;
			readonly litTargets: number;
			readonly totalTargets: number;
			readonly isSolved: boolean;
	  };

function parseDifficultyParam(): Difficulty | null {
	if (typeof window === 'undefined') return null;
	const params = new URLSearchParams(window.location.search);
	const raw = params.get('difficulty');
	if (raw && (DIFFICULTIES as readonly string[]).includes(raw)) {
		return raw as Difficulty;
	}
	return null;
}

export function useLasersGame(initialDifficulty: Difficulty = 'easy') {
	const [difficulty, setDifficulty] = useState<Difficulty>(() => parseDifficultyParam() ?? initialDifficulty);
	const [puzzle, setPuzzle] = useState<LaserPuzzle>(() => generatePuzzle(difficulty, createRandomSeed()));
	const [history, setHistory] = useState<HistoryState>(() => createHistory(puzzle.initialGrid));
	const [movesCount, setMovesCount] = useState(0);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [undosUsed, setUndosUsed] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [settings, setSettings] = useState<LasersSettings>(DEFAULT_LASERS_SETTINGS);
	const [focusedCoord, setFocusedCoord] = useState<CellCoord>({ row: 0, col: 0 });
	const [hintedCoord, setHintedCoord] = useState<CellCoord | null>(null);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');
	const [isInitialized, setIsInitialized] = useState(false);

	const solvedRecordedRef = useRef(false);
	const grid = history.present;
	const trace = useMemo(() => traceBeams(grid), [grid]);
	const isSolved = trace.isSolved;

	const startNewPuzzle = useCallback(async (nextDifficulty: Difficulty, seed?: number) => {
		const nextSeed = seed ?? createRandomSeed();
		const nextPuzzle = generatePuzzle(nextDifficulty, nextSeed);
		solvedRecordedRef.current = false;
		setDifficulty(nextDifficulty);
		setPuzzle(nextPuzzle);
		setHistory(createHistory(nextPuzzle.initialGrid));
		setMovesCount(0);
		setHintsUsed(0);
		setUndosUsed(0);
		setElapsedSeconds(0);
		setIsPaused(false);
		setIsVictoryOpen(false);
		setHintedCoord(null);
		setFocusedCoord({ row: 0, col: 0 });
		await clearActiveGame();
		await saveLastConfig({ difficulty: nextDifficulty });
	}, []);

	// Initialize settings and optionally restore saved session
	useEffect(() => {
		let cancelled = false;
		async function init() {
			const [loadedSettings, savedGame, lastConfig] = await Promise.all([
				loadSettings(),
				loadActiveGame(),
				loadLastConfig(),
			]);
			if (cancelled) return;

			setSettings(loadedSettings);

			const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
			const wantsResume = params?.get('resume') === 'true';
			const wantsNew = params?.get('new') === 'true';
			const paramDiff = parseDifficultyParam();

			if (!wantsNew && savedGame && savedGame.status === 'playing' && (wantsResume || !paramDiff)) {
				solvedRecordedRef.current = false;
				setDifficulty(savedGame.difficulty);
				setPuzzle({
					seed: savedGame.seed,
					difficulty: savedGame.difficulty,
					rows: savedGame.rows,
					cols: savedGame.cols,
					initialGrid: savedGame.initialGrid,
					parMoves: savedGame.parMoves,
					targetCount: traceBeams(savedGame.grid).totalTargetCount,
				});
				setHistory(createHistory(savedGame.grid));
				setMovesCount(savedGame.movesCount);
				setHintsUsed(savedGame.hintsUsed);
				setUndosUsed(savedGame.undosUsed);
				setElapsedSeconds(savedGame.elapsedSeconds);
				setIsPaused(true);
				setIsInitialized(true);
				return;
			}

			const targetDiff = paramDiff ?? lastConfig?.difficulty ?? initialDifficulty;
			const freshPuzzle = generatePuzzle(targetDiff, createRandomSeed());
			solvedRecordedRef.current = false;
			setDifficulty(targetDiff);
			setPuzzle(freshPuzzle);
			setHistory(createHistory(freshPuzzle.initialGrid));
			setMovesCount(0);
			setHintsUsed(0);
			setUndosUsed(0);
			setElapsedSeconds(0);
			setIsPaused(false);
			setIsInitialized(true);
		}
		void init();
		return () => {
			cancelled = true;
		};
	}, [initialDifficulty]);

	// Game timer
	useEffect(() => {
		if (!isInitialized || isPaused || isSolved || isSettingsOpen || isRulesOpen) return;
		const id = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(id);
	}, [isInitialized, isPaused, isSolved, isSettingsOpen, isRulesOpen]);

	// Persist active snapshot while playing
	useEffect(() => {
		if (!isInitialized || isSolved) return;
		if (movesCount === 0 && elapsedSeconds === 0) return;

		const snapshot: GameSnapshot = {
			seed: puzzle.seed,
			difficulty,
			rows: puzzle.rows,
			cols: puzzle.cols,
			grid,
			initialGrid: puzzle.initialGrid,
			parMoves: puzzle.parMoves,
			movesCount,
			hintsUsed,
			undosUsed,
			elapsedSeconds,
			status: 'playing',
		};
		void saveActiveGame(snapshot);
	}, [isInitialized, isSolved, puzzle, difficulty, grid, movesCount, hintsUsed, undosUsed, elapsedSeconds]);

	// Handle victory telemetry, medals, and dialog
	const triggerVictory = useCallback(
		(finalMoves: number, finalHints: number, finalUndos: number) => {
			if (solvedRecordedRef.current) return;
			solvedRecordedRef.current = true;
			playVictoryFanfare();
			setIsVictoryOpen(true);

			void clearActiveGame();
			void recordLasersRoundStats({
				difficulty,
				playTimeSeconds: elapsedSeconds,
				movesCount: finalMoves,
				parMoves: puzzle.parMoves,
				hintsUsed: finalHints,
				undosUsed: finalUndos,
			});
			void recordGameResult(
				{
					gameId: 'lasers',
					won: true,
					playTimeSeconds: elapsedSeconds,
					levelKey: difficulty,
					sizeKey: `${puzzle.rows}x${puzzle.cols}`,
					roundContext: {
						difficulty,
						movesCount: finalMoves,
						parMoves: puzzle.parMoves,
						hintsUsed: finalHints,
						undosUsed: finalUndos,
					},
				},
				{ definitions: LASERS_MEDAL_DEFINITIONS },
			);
		},
		[difficulty, elapsedSeconds, puzzle.cols, puzzle.parMoves, puzzle.rows],
	);

	const handleRotateCell = useCallback(
		(coord: CellCoord): RotateOutcome => {
			if (isPaused || isSolved) return { rotated: false };
			const nextGrid = rotateCellAt(grid, coord.row, coord.col);
			if (!nextGrid) return { rotated: false };

			const prevLit = trace.litTargetCount;
			const nextTrace = traceBeams(nextGrid);
			const nextCell = nextGrid[coord.row][coord.col];
			const nextMoves = movesCount + 1;

			setHistory((prev) => pushHistory(prev, nextGrid));
			setMovesCount(nextMoves);
			setHintedCoord(null);

			if (nextTrace.isSolved) {
				triggerVictory(nextMoves, hintsUsed, undosUsed);
			} else if (nextTrace.litTargetCount > prevLit) {
				playProgress(nextTrace.litTargetCount);
			} else {
				playTap();
			}

			return {
				rotated: true,
				kind: nextCell.kind === 'splitter' ? 'splitter' : 'mirror',
				orientation: nextCell.orientation ?? '/',
				litTargets: nextTrace.litTargetCount,
				totalTargets: nextTrace.totalTargetCount,
				isSolved: nextTrace.isSolved,
			};
		},
		[grid, hintsUsed, isPaused, isSolved, movesCount, trace.litTargetCount, triggerVictory, undosUsed],
	);

	const handleHint = useCallback((): HintOutcome => {
		if (isPaused || isSolved) return { applied: false };
		const target = findHintCell(grid);
		if (!target) return { applied: false };

		const nextGrid = rotateCellAt(grid, target.row, target.col);
		if (!nextGrid) return { applied: false };

		const nextTrace = traceBeams(nextGrid);
		const nextMoves = movesCount + 1;
		const nextHints = hintsUsed + 1;

		setHistory((prev) => pushHistory(prev, nextGrid));
		setMovesCount(nextMoves);
		setHintsUsed(nextHints);
		setHintedCoord(target);
		setFocusedCoord(target);

		if (nextTrace.isSolved) {
			triggerVictory(nextMoves, nextHints, undosUsed);
		} else {
			playDrop();
		}

		return {
			applied: true,
			row: target.row,
			col: target.col,
			litTargets: nextTrace.litTargetCount,
			totalTargets: nextTrace.totalTargetCount,
			isSolved: nextTrace.isSolved,
		};
	}, [grid, hintsUsed, isPaused, isSolved, movesCount, triggerVictory, undosUsed]);

	const handleUndo = useCallback(() => {
		if (!checkCanUndo(history) || isPaused || isSolved) return;
		setHistory((prev) => undoHistory(prev));
		setUndosUsed((prev) => prev + 1);
		setHintedCoord(null);
		playTap();
	}, [history, isPaused, isSolved]);

	const handleRedo = useCallback(() => {
		if (!checkCanRedo(history) || isPaused || isSolved) return;
		setHistory((prev) => redoHistory(prev));
		setHintedCoord(null);
		playTap();
	}, [history, isPaused, isSolved]);

	const handleReset = useCallback(() => {
		if (isPaused) return;
		solvedRecordedRef.current = false;
		setHistory(resetHistory(puzzle.initialGrid));
		setMovesCount(0);
		setHintedCoord(null);
		setIsVictoryOpen(false);
		playTap();
	}, [isPaused, puzzle.initialGrid]);

	const handleTogglePause = useCallback(() => {
		if (isSolved) return;
		setIsPaused((prev) => !prev);
	}, [isSolved]);

	const updateSettings = useCallback((next: LasersSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	return {
		difficulty,
		puzzle,
		grid,
		trace,
		movesCount,
		hintsUsed,
		undosUsed,
		elapsedSeconds,
		isPaused,
		isSolved,
		isSettingsOpen,
		isRulesOpen,
		isVictoryOpen,
		settings,
		focusedCoord,
		hintedCoord,
		liveAnnouncement,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		setFocusedCoord,
		setLiveAnnouncement,
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		openRules: () => setIsRulesOpen(true),
		closeRules: () => setIsRulesOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
		updateSettings,
		handleRotateCell,
		handleHint,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		startNewPuzzle,
	};
}
