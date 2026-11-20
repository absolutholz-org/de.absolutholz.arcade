import { playDrop, playRegression, playTap, triggerHaptic } from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FUTOSHIKI_MEDAL_DEFINITIONS } from '../../config/medals';
import { generatePuzzle } from '../../engine/generator';
import {
	type HistoryState,
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	createHistory,
	pushHistory,
	redoHistory,
	undoHistory,
} from '../../engine/history';
import { getNextHint } from '../../engine/solver';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordFutoshikiRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	DEFAULT_FUTOSHIKI_SETTINGS,
	DIFFICULTIES,
	type Difficulty,
	type FutoshikiPuzzle,
	type FutoshikiSettings,
} from '../../engine/types';
import { createBoardFromPuzzle, isBoardComplete, validateBoard } from '../../engine/validator';

interface BoardEntryState {
	readonly values: readonly (readonly (number | null)[])[];
	readonly notes: readonly (readonly (readonly number[])[])[];
}

function createEmptyEntryState(puzzle: FutoshikiPuzzle): BoardEntryState {
	return {
		values: puzzle.givens.map((row) => [...row]),
		notes: Array.from({ length: puzzle.size }, () => Array.from({ length: puzzle.size }, () => [] as number[])),
	};
}

function parseDifficultyParam(raw: string | null, fallback: Difficulty): Difficulty {
	if (raw && (DIFFICULTIES as readonly string[]).includes(raw)) {
		return raw as Difficulty;
	}
	return fallback;
}

export function useFutoshikiGame(initialDifficulty: Difficulty = 'easy') {
	const [puzzle, setPuzzle] = useState<FutoshikiPuzzle>(() => generatePuzzle(initialDifficulty));
	const [history, setHistory] = useState<HistoryState<BoardEntryState>>(() =>
		createHistory(createEmptyEntryState(puzzle)),
	);
	const [activeCell, setActiveCell] = useState<{ readonly row: number; readonly col: number }>({
		row: 0,
		col: 0,
	});
	const [isNotesMode, setIsNotesMode] = useState(false);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [movesCount, setMovesCount] = useState(0);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [mistakesCount, setMistakesCount] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [settings, setSettings] = useState<FutoshikiSettings>(DEFAULT_FUTOSHIKI_SETTINGS);
	const [hintedCell, setHintedCell] = useState<{ readonly row: number; readonly col: number } | null>(null);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');
	const [isHydrated, setIsHydrated] = useState(false);

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;
	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;
	const movesRef = useRef(movesCount);
	movesRef.current = movesCount;
	const hintsRef = useRef(hintsUsed);
	hintsRef.current = hintsUsed;
	const mistakesRef = useRef(mistakesCount);
	mistakesRef.current = mistakesCount;

	// Hydrate settings and URL / saved game snapshot on mount
	useEffect(() => {
		let cancelled = false;

		async function hydrate() {
			const [savedSettings, savedSnapshot] = await Promise.all([loadSettings(), loadActiveGame()]);
			if (cancelled) return;
			setSettings(savedSettings);

			const params =
				typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
			const isResume = params.get('resume') === 'true';
			const isNew = params.get('new') === 'true';
			const requestedDifficulty = parseDifficultyParam(params.get('difficulty'), initialDifficulty);

			if (!isNew && savedSnapshot && (isResume || savedSnapshot.puzzle.difficulty === requestedDifficulty)) {
				setPuzzle(savedSnapshot.puzzle);
				setHistory(
					createHistory({
						values: savedSnapshot.values,
						notes: savedSnapshot.notes,
					}),
				);
				setElapsedSeconds(savedSnapshot.elapsedSeconds);
				setMovesCount(savedSnapshot.movesCount);
				setHintsUsed(savedSnapshot.hintsUsed);
				setMistakesCount(savedSnapshot.mistakesCount);
				setIsPaused(true);
				setActiveCell({ row: 0, col: 0 });
			} else {
				const fresh = generatePuzzle(requestedDifficulty);
				setPuzzle(fresh);
				setHistory(createHistory(createEmptyEntryState(fresh)));
				setElapsedSeconds(0);
				setMovesCount(0);
				setHintsUsed(0);
				setMistakesCount(0);
				setIsPaused(false);
				setActiveCell({ row: 0, col: 0 });
				void saveLastConfig({ difficulty: requestedDifficulty });
				if (isNew) {
					void clearActiveGame();
				}
			}

			setIsHydrated(true);
		}

		void hydrate();
		return () => {
			cancelled = true;
		};
	}, [initialDifficulty]);

	const board = useMemo(
		() => createBoardFromPuzzle(puzzle, history.present.values, history.present.notes),
		[puzzle, history.present],
	);

	const conflicts = useMemo(() => validateBoard(board), [board]);

	const digitCounts = useMemo(() => {
		const counts: Record<number, number> = {};
		for (let d = 1; d <= board.size; d += 1) {
			counts[d] = 0;
		}
		for (const row of board.cells) {
			for (const cell of row) {
				if (cell.value !== null) {
					counts[cell.value] = (counts[cell.value] ?? 0) + 1;
				}
			}
		}
		return counts;
	}, [board]);

	const emptyCellsCount = useMemo(() => {
		let count = 0;
		for (const row of board.cells) {
			for (const cell of row) {
				if (cell.value === null) count += 1;
			}
		}
		return count;
	}, [board]);

	const totalConflicts =
		conflicts.duplicateCells.size + conflicts.violatedHorizontal.size + conflicts.violatedVertical.size;

	// Active timer tick
	useEffect(() => {
		if (!isHydrated || isPaused || isComplete || isRulesOpen || isSettingsOpen) return;
		const timerId = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(timerId);
	}, [isHydrated, isPaused, isComplete, isRulesOpen, isSettingsOpen]);

	// Persist active session snapshot for resume support
	useEffect(() => {
		if (!isHydrated || isComplete) return;
		if (movesCount === 0 && elapsedSeconds === 0) return;

		void saveActiveGame({
			puzzle,
			values: history.present.values,
			notes: history.present.notes,
			elapsedSeconds,
			movesCount,
			hintsUsed,
			mistakesCount,
			updatedAt: Date.now(),
		});
	}, [isHydrated, isComplete, puzzle, history.present, elapsedSeconds, movesCount, hintsUsed, mistakesCount]);

	const finalizeVictory = useCallback((nextMoves: number, nextHints: number, nextMistakes: number) => {
		setIsComplete(true);
		setIsVictoryOpen(true);
		setHintedCell(null);
		void clearActiveGame();

		const currentPuzzle = puzzleRef.current;
		const finalSeconds = elapsedRef.current;

		void recordFutoshikiRoundStats({
			difficulty: currentPuzzle.difficulty,
			won: true,
			playTimeSeconds: finalSeconds,
			movesCount: nextMoves,
			hintsUsed: nextHints,
			mistakesCount: nextMistakes,
		});

		void recordGameResult(
			{
				gameId: 'futoshiki',
				won: true,
				playTimeSeconds: finalSeconds,
				levelKey: currentPuzzle.difficulty,
				sizeKey: `${currentPuzzle.size}x${currentPuzzle.size}`,
				roundContext: {
					difficulty: currentPuzzle.difficulty,
					movesCount: nextMoves,
					hintsUsed: nextHints,
					mistakesCount: nextMistakes,
				},
			},
			{ definitions: FUTOSHIKI_MEDAL_DEFINITIONS },
		);
	}, []);

	const applyBoardChange = useCallback(
		(nextState: BoardEntryState, countMove = true, addedMistake = false) => {
			const nextMoves = countMove ? movesRef.current + 1 : movesRef.current;
			const nextMistakes = addedMistake ? mistakesRef.current + 1 : mistakesRef.current;

			setHistory((prev) => pushHistory(prev, nextState));
			if (countMove) setMovesCount(nextMoves);
			if (addedMistake) setMistakesCount(nextMistakes);
			setHintedCell(null);

			const nextBoard = createBoardFromPuzzle(puzzleRef.current, nextState.values, nextState.notes);
			if (isBoardComplete(nextBoard)) {
				playDrop();
				triggerHaptic('success');
				finalizeVictory(nextMoves, hintsRef.current, nextMistakes);
			}
		},
		[finalizeVictory],
	);

	const handleSelectCell = useCallback((row: number, col: number) => {
		setActiveCell({ row, col });
	}, []);

	const handleDigitPress = useCallback(
		(digit: number) => {
			if (isPaused || isComplete) return;
			const { row, col } = activeCell;
			const currentPuzzle = puzzleRef.current;
			if (digit < 1 || digit > currentPuzzle.size) return;
			if (currentPuzzle.givens[row][col] !== null) return;

			const prevValues = history.present.values;
			const prevNotes = history.present.notes;

			if (isNotesMode) {
				if (prevValues[row][col] !== null) return;
				const currentNotes = prevNotes[row][col];
				const nextCellNotes = currentNotes.includes(digit)
					? currentNotes.filter((n) => n !== digit)
					: [...currentNotes, digit].sort((a, b) => a - b);

				const nextNotes = prevNotes.map((rArr, rIdx) =>
					rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? nextCellNotes : cNotes)) : rArr,
				);
				playTap();
				applyBoardChange({ values: prevValues, notes: nextNotes }, false, false);
				return;
			}

			const currentVal = prevValues[row][col];
			const nextVal = currentVal === digit ? null : digit;
			const nextValues = prevValues.map((rArr, rIdx) =>
				rIdx === row ? rArr.map((val, cIdx) => (cIdx === col ? nextVal : val)) : rArr,
			);

			let nextNotes = prevNotes.map((rArr, rIdx) =>
				rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? [] : cNotes)) : rArr,
			);

			if (nextVal !== null && settings.autoClearNotes) {
				nextNotes = nextNotes.map((rArr, rIdx) =>
					rArr.map((cNotes, cIdx) =>
						rIdx === row || cIdx === col ? cNotes.filter((n) => n !== nextVal) : cNotes,
					),
				);
			}

			const candidateBoard = createBoardFromPuzzle(currentPuzzle, nextValues, nextNotes);
			const nextConflicts = validateBoard(candidateBoard);
			const hasNewConflict = nextVal !== null && nextConflicts.hasConflicts;

			if (hasNewConflict) {
				playRegression();
				triggerHaptic('warning');
			} else {
				playTap();
			}

			applyBoardChange({ values: nextValues, notes: nextNotes }, true, hasNewConflict);
		},
		[activeCell, applyBoardChange, history.present, isComplete, isNotesMode, isPaused, settings.autoClearNotes],
	);

	const handleErase = useCallback(() => {
		if (isPaused || isComplete) return;
		const { row, col } = activeCell;
		const currentPuzzle = puzzleRef.current;
		if (currentPuzzle.givens[row][col] !== null) return;

		const prevValues = history.present.values;
		const prevNotes = history.present.notes;
		if (prevValues[row][col] === null && prevNotes[row][col].length === 0) return;

		const nextValues = prevValues.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((val, cIdx) => (cIdx === col ? null : val)) : rArr,
		);
		const nextNotes = prevNotes.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? [] : cNotes)) : rArr,
		);
		playTap();
		applyBoardChange({ values: nextValues, notes: nextNotes }, false, false);
	}, [activeCell, applyBoardChange, history.present, isComplete, isPaused]);

	const handleHint = useCallback(() => {
		if (isPaused || isComplete) return null;
		const hint = getNextHint(board, puzzle.solution);
		if (!hint) return null;

		const { row, col, value } = hint;
		const prevValues = history.present.values;
		const prevNotes = history.present.notes;
		const nextValues = prevValues.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((val, cIdx) => (cIdx === col ? value : val)) : rArr,
		);
		let nextNotes = prevNotes.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? [] : cNotes)) : rArr,
		);
		if (settings.autoClearNotes) {
			nextNotes = nextNotes.map((rArr, rIdx) =>
				rArr.map((cNotes, cIdx) => (rIdx === row || cIdx === col ? cNotes.filter((n) => n !== value) : cNotes)),
			);
		}

		const nextHints = hintsRef.current + 1;
		setHintsUsed(nextHints);
		hintsRef.current = nextHints;
		setActiveCell({ row, col });
		setHintedCell({ row, col });
		playDrop();
		applyBoardChange({ values: nextValues, notes: nextNotes }, true, false);
		return hint;
	}, [applyBoardChange, board, history.present, isComplete, isPaused, puzzle.solution, settings.autoClearNotes]);

	const handleUndo = useCallback(() => {
		if (isPaused || isComplete) return;
		if (!checkCanUndo(history)) return;
		playTap();
		setHistory((prev) => undoHistory(prev));
		setHintedCell(null);
	}, [history, isComplete, isPaused]);

	const handleRedo = useCallback(() => {
		if (isPaused || isComplete) return;
		if (!checkCanRedo(history)) return;
		playTap();
		setHistory((prev) => redoHistory(prev));
		setHintedCell(null);
	}, [history, isComplete, isPaused]);

	const handleRestart = useCallback(() => {
		const freshEntry = createEmptyEntryState(puzzleRef.current);
		setHistory(createHistory(freshEntry));
		setElapsedSeconds(0);
		setMovesCount(0);
		setHintsUsed(0);
		setMistakesCount(0);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setIsPaused(false);
		setHintedCell(null);
		void clearActiveGame();
	}, []);

	const handleStartNewGame = useCallback((nextDifficulty: Difficulty) => {
		const fresh = generatePuzzle(nextDifficulty);
		setPuzzle(fresh);
		setHistory(createHistory(createEmptyEntryState(fresh)));
		setActiveCell({ row: 0, col: 0 });
		setIsNotesMode(false);
		setElapsedSeconds(0);
		setMovesCount(0);
		setHintsUsed(0);
		setMistakesCount(0);
		setIsPaused(false);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setHintedCell(null);
		void clearActiveGame();
		void saveLastConfig({ difficulty: nextDifficulty });
	}, []);

	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	const handleToggleNotes = useCallback(() => {
		setIsNotesMode((prev) => !prev);
	}, []);

	const updateSettings = useCallback((next: FutoshikiSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	return {
		puzzle,
		board,
		difficulty: puzzle.difficulty,
		activeCell,
		conflicts,
		totalConflicts,
		emptyCellsCount,
		digitCounts,
		isNotesMode,
		elapsedSeconds,
		movesCount,
		hintsUsed,
		mistakesCount,
		isPaused,
		isComplete,
		isVictoryOpen,
		isRulesOpen,
		isSettingsOpen,
		settings,
		hintedCell,
		liveAnnouncement,
		setLiveAnnouncement,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		handleSelectCell,
		handleDigitPress,
		handleErase,
		handleHint,
		handleUndo,
		handleRedo,
		handleRestart,
		handleStartNewGame,
		handleTogglePause,
		handleToggleNotes,
		updateSettings,
		openRules: () => setIsRulesOpen(true),
		closeRules: () => setIsRulesOpen(false),
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
