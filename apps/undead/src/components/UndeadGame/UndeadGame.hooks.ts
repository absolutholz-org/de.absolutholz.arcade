import { playDrop, playRegression, playTap, triggerHaptic } from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UNDEAD_MEDAL_DEFINITIONS } from '../../config/medals';
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
import { traceAllRays } from '../../engine/raycast';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordUndeadRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	DEFAULT_UNDEAD_SETTINGS,
	DIFFICULTIES,
	type Difficulty,
	MONSTER_TYPES,
	type MonsterType,
	type UndeadPuzzle,
	type UndeadSettings,
} from '../../engine/types';
import { createBoardFromPuzzle, validateBoard } from '../../engine/validator';

interface BoardEntryState {
	readonly placements: readonly (readonly (MonsterType | null)[])[];
	readonly notes: readonly (readonly (readonly MonsterType[])[])[];
}

function createEmptyEntryState(puzzle: UndeadPuzzle): BoardEntryState {
	return {
		placements: Array.from({ length: puzzle.size }, () => Array.from({ length: puzzle.size }, () => null)),
		notes: Array.from({ length: puzzle.size }, () =>
			Array.from({ length: puzzle.size }, () => [] as MonsterType[]),
		),
	};
}

function findFirstPlayableCell(puzzle: UndeadPuzzle): { readonly row: number; readonly col: number } {
	for (let r = 0; r < puzzle.size; r += 1) {
		for (let c = 0; c < puzzle.size; c += 1) {
			if (puzzle.mirrors[r]?.[c] === null) {
				return { row: r, col: c };
			}
		}
	}
	return { row: 0, col: 0 };
}

function parseDifficultyParam(raw: string | null, fallback: Difficulty): Difficulty {
	if (raw && (DIFFICULTIES as readonly string[]).includes(raw)) {
		return raw as Difficulty;
	}
	return fallback;
}

export function useUndeadGame(initialDifficulty: Difficulty = 'easy') {
	const [puzzle, setPuzzle] = useState<UndeadPuzzle>(() => generatePuzzle(initialDifficulty));
	const [history, setHistory] = useState<HistoryState<BoardEntryState>>(() =>
		createHistory(createEmptyEntryState(puzzle)),
	);
	const [activeCell, setActiveCell] = useState<{ readonly row: number; readonly col: number }>(() =>
		findFirstPlayableCell(puzzle),
	);
	const [selectedMonster, setSelectedMonster] = useState<MonsterType>('ghost');
	const [isNotesMode, setIsNotesMode] = useState(false);
	const [completedClues, setCompletedClues] = useState<ReadonlySet<string>>(() => new Set());
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [movesCount, setMovesCount] = useState(0);
	const [mistakesCount, setMistakesCount] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [settings, setSettings] = useState<UndeadSettings>(DEFAULT_UNDEAD_SETTINGS);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');
	const [isHydrated, setIsHydrated] = useState(false);

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;
	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;
	const movesRef = useRef(movesCount);
	movesRef.current = movesCount;
	const mistakesRef = useRef(mistakesCount);
	mistakesRef.current = mistakesCount;

	// Hydrate settings & resume snapshot on mount
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
						placements: savedSnapshot.placements,
						notes: savedSnapshot.notes,
					}),
				);
				setCompletedClues(new Set(savedSnapshot.completedClues ?? []));
				setElapsedSeconds(savedSnapshot.elapsedSeconds);
				setMovesCount(savedSnapshot.movesCount);
				setMistakesCount(savedSnapshot.mistakesCount);
				setIsPaused(true);
				setActiveCell(findFirstPlayableCell(savedSnapshot.puzzle));
			} else {
				const fresh = generatePuzzle(requestedDifficulty);
				setPuzzle(fresh);
				setHistory(createHistory(createEmptyEntryState(fresh)));
				setCompletedClues(new Set());
				setElapsedSeconds(0);
				setMovesCount(0);
				setMistakesCount(0);
				setIsPaused(false);
				setActiveCell(findFirstPlayableCell(fresh));
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

	const rays = useMemo(() => traceAllRays(puzzle.mirrors), [puzzle.mirrors]);

	const board = useMemo(
		() => createBoardFromPuzzle(puzzle, history.present.placements, history.present.notes),
		[puzzle, history.present],
	);

	const validation = useMemo(
		() => validateBoard(puzzle, history.present.placements, rays),
		[puzzle, history.present.placements, rays],
	);

	// Active timer tick
	useEffect(() => {
		if (!isHydrated || isPaused || isComplete || isRulesOpen || isSettingsOpen) return;
		const timerId = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(timerId);
	}, [isHydrated, isPaused, isComplete, isRulesOpen, isSettingsOpen]);

	// Auto-save active session snapshot
	useEffect(() => {
		if (!isHydrated || isComplete) return;
		if (movesCount === 0 && elapsedSeconds === 0) return;

		void saveActiveGame({
			puzzle,
			placements: history.present.placements,
			notes: history.present.notes,
			completedClues: Array.from(completedClues),
			elapsedSeconds,
			movesCount,
			mistakesCount,
			updatedAt: Date.now(),
		});
	}, [isHydrated, isComplete, puzzle, history.present, completedClues, elapsedSeconds, movesCount, mistakesCount]);

	const finalizeVictory = useCallback((nextMoves: number, nextMistakes: number) => {
		setIsComplete(true);
		setIsVictoryOpen(true);
		void clearActiveGame();

		const currentPuzzle = puzzleRef.current;
		const finalSeconds = elapsedRef.current;

		void recordUndeadRoundStats({
			difficulty: currentPuzzle.difficulty,
			won: true,
			playTimeSeconds: finalSeconds,
			movesCount: nextMoves,
			mistakesCount: nextMistakes,
		});

		void recordGameResult(
			{
				gameId: 'undead',
				won: true,
				playTimeSeconds: finalSeconds,
				levelKey: currentPuzzle.difficulty,
				sizeKey: `${currentPuzzle.size}x${currentPuzzle.size}`,
				roundContext: {
					difficulty: currentPuzzle.difficulty,
					movesCount: nextMoves,
					mistakesCount: nextMistakes,
				},
			},
			{ definitions: UNDEAD_MEDAL_DEFINITIONS },
		);
	}, []);

	const applyBoardChange = useCallback(
		(nextState: BoardEntryState, countMove = true, addedMistake = false) => {
			const nextMoves = countMove ? movesRef.current + 1 : movesRef.current;
			const nextMistakes = addedMistake ? mistakesRef.current + 1 : mistakesRef.current;

			setHistory((prev) => pushHistory(prev, nextState));
			if (countMove) setMovesCount(nextMoves);
			if (addedMistake) setMistakesCount(nextMistakes);

			const nextValidation = validateBoard(puzzleRef.current, nextState.placements);
			if (nextValidation.isSolved) {
				playDrop();
				triggerHaptic('success');
				finalizeVictory(nextMoves, nextMistakes);
			}
		},
		[finalizeVictory],
	);

	const handleSelectCell = useCallback((row: number, col: number) => {
		setActiveCell({ row, col });
	}, []);

	const applyMonsterToCell = useCallback(
		(row: number, col: number, monster: MonsterType, useNote: boolean) => {
			if (isPaused || isComplete) return;
			const currentPuzzle = puzzleRef.current;
			if (currentPuzzle.mirrors[row]?.[col] !== null) return;

			setSelectedMonster(monster);
			const prevPlacements = history.present.placements;
			const prevNotes = history.present.notes;

			if (useNote) {
				if (prevPlacements[row]?.[col] !== null) return;
				const currentCellNotes = prevNotes[row]?.[col] ?? [];
				const nextCellNotes = currentCellNotes.includes(monster)
					? currentCellNotes.filter((m) => m !== monster)
					: MONSTER_TYPES.filter((m) => m === monster || currentCellNotes.includes(m));

				const nextNotes = prevNotes.map((rArr, rIdx) =>
					rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? nextCellNotes : cNotes)) : rArr,
				);
				playTap();
				applyBoardChange({ placements: prevPlacements, notes: nextNotes }, false, false);
				return;
			}

			const currentVal = prevPlacements[row]?.[col] ?? null;
			const nextVal = currentVal === monster ? null : monster;
			const nextPlacements = prevPlacements.map((rArr, rIdx) =>
				rIdx === row ? rArr.map((val, cIdx) => (cIdx === col ? nextVal : val)) : rArr,
			);
			const nextNotes = prevNotes.map((rArr, rIdx) =>
				rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? [] : cNotes)) : rArr,
			);

			const candidateValidation = validateBoard(currentPuzzle, nextPlacements);
			const hasNewError = nextVal !== null && candidateValidation.hasErrors;

			if (hasNewError) {
				playRegression();
				triggerHaptic('warning');
			} else {
				playTap();
			}

			applyBoardChange({ placements: nextPlacements, notes: nextNotes }, true, hasNewError);
		},
		[applyBoardChange, history.present, isComplete, isPaused],
	);

	const handleMonsterInput = useCallback(
		(monster: MonsterType, forceNote = false) => {
			applyMonsterToCell(activeCell.row, activeCell.col, monster, forceNote || isNotesMode);
		},
		[activeCell.col, activeCell.row, applyMonsterToCell, isNotesMode],
	);

	const handleRightClickCell = useCallback(
		(row: number, col: number) => {
			setActiveCell({ row, col });
			applyMonsterToCell(row, col, selectedMonster, true);
		},
		[applyMonsterToCell, selectedMonster],
	);

	const handleErase = useCallback(() => {
		if (isPaused || isComplete) return;
		const { row, col } = activeCell;
		const currentPuzzle = puzzleRef.current;
		if (currentPuzzle.mirrors[row]?.[col] !== null) return;

		const prevPlacements = history.present.placements;
		const prevNotes = history.present.notes;
		if (prevPlacements[row]?.[col] === null && (prevNotes[row]?.[col]?.length ?? 0) === 0) return;

		const nextPlacements = prevPlacements.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((val, cIdx) => (cIdx === col ? null : val)) : rArr,
		);
		const nextNotes = prevNotes.map((rArr, rIdx) =>
			rIdx === row ? rArr.map((cNotes, cIdx) => (cIdx === col ? [] : cNotes)) : rArr,
		);
		playTap();
		applyBoardChange({ placements: nextPlacements, notes: nextNotes }, false, false);
	}, [activeCell, applyBoardChange, history.present, isComplete, isPaused]);

	const handleToggleClueDone = useCallback((clueId: string) => {
		playTap();
		setCompletedClues((prev) => {
			const next = new Set(prev);
			if (next.has(clueId)) {
				next.delete(clueId);
			} else {
				next.add(clueId);
			}
			return next;
		});
	}, []);

	const handleUndo = useCallback(() => {
		if (isPaused || isComplete) return;
		if (!checkCanUndo(history)) return;
		playTap();
		setHistory((prev) => undoHistory(prev));
	}, [history, isComplete, isPaused]);

	const handleRedo = useCallback(() => {
		if (isPaused || isComplete) return;
		if (!checkCanRedo(history)) return;
		playTap();
		setHistory((prev) => redoHistory(prev));
	}, [history, isComplete, isPaused]);

	const handleRestart = useCallback(() => {
		const freshEntry = createEmptyEntryState(puzzleRef.current);
		setHistory(createHistory(freshEntry));
		setCompletedClues(new Set());
		setElapsedSeconds(0);
		setMovesCount(0);
		setMistakesCount(0);
		setIsComplete(false);
		setIsVictoryOpen(false);
		setIsPaused(false);
		void clearActiveGame();
	}, []);

	const handleStartNewGame = useCallback((nextDifficulty: Difficulty) => {
		const fresh = generatePuzzle(nextDifficulty);
		setPuzzle(fresh);
		setHistory(createHistory(createEmptyEntryState(fresh)));
		setActiveCell(findFirstPlayableCell(fresh));
		setIsNotesMode(false);
		setCompletedClues(new Set());
		setElapsedSeconds(0);
		setMovesCount(0);
		setMistakesCount(0);
		setIsPaused(false);
		setIsComplete(false);
		setIsVictoryOpen(false);
		void clearActiveGame();
		void saveLastConfig({ difficulty: nextDifficulty });
	}, []);

	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	const handleToggleNotes = useCallback(() => {
		playTap();
		setIsNotesMode((prev) => !prev);
	}, []);

	const updateSettings = useCallback((next: UndeadSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	return {
		puzzle,
		board,
		rays,
		validation,
		difficulty: puzzle.difficulty,
		activeCell,
		selectedMonster,
		isNotesMode,
		completedClues,
		elapsedSeconds,
		movesCount,
		mistakesCount,
		isPaused,
		isComplete,
		isVictoryOpen,
		isRulesOpen,
		isSettingsOpen,
		settings,
		liveAnnouncement,
		setLiveAnnouncement,
		canUndo: checkCanUndo(history),
		canRedo: checkCanRedo(history),
		handleSelectCell,
		handleMonsterInput,
		handleRightClickCell,
		handleErase,
		handleToggleClueDone,
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
