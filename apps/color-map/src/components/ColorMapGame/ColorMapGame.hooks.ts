import { playDrop, playRegression, playTap, triggerHaptic } from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COLOR_MAP_MEDAL_DEFINITIONS } from '../../config/medals';
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
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordColorMapRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	type ColorIndex,
	type ColorMapBoardState,
	type ColorMapPuzzle,
	type ColorMapSettings,
	DEFAULT_COLOR_MAP_SETTINGS,
	DIFFICULTIES,
	type Difficulty,
} from '../../engine/types';
import { countUncoloredRegions, isBoardComplete, validateBoard } from '../../engine/validator';
import type { ActiveTool } from '../ColorMapPalette/ColorMapPalette';

function createInitialBoardState(puzzle: ColorMapPuzzle): ColorMapBoardState {
	return {
		colors: [...puzzle.givens],
		candidates: Array.from({ length: puzzle.regions.length }, () => [] as ColorIndex[]),
	};
}

function findFirstUnlockedRegion(puzzle: ColorMapPuzzle): number {
	const idx = puzzle.givens.findIndex((g) => g === null);
	return idx >= 0 ? idx : 0;
}

function parseDifficultyParam(raw: string | null, fallback: Difficulty): Difficulty {
	if (raw && (DIFFICULTIES as readonly string[]).includes(raw)) {
		return raw as Difficulty;
	}
	return fallback;
}

export function getNextDifficulty(difficulty: Difficulty): Difficulty | null {
	const idx = DIFFICULTIES.indexOf(difficulty);
	if (idx < 0 || idx >= DIFFICULTIES.length - 1) return null;
	return DIFFICULTIES[idx + 1];
}

export function useColorMapGame(initialDifficulty: Difficulty = 'easy') {
	const [puzzle, setPuzzle] = useState<ColorMapPuzzle>(() => generatePuzzle(initialDifficulty));
	const [history, setHistory] = useState<HistoryState<ColorMapBoardState>>(() =>
		createHistory(createInitialBoardState(puzzle)),
	);
	const [activeTool, setActiveTool] = useState<ActiveTool>(0);
	const [isPencilMode, setIsPencilMode] = useState(false);
	const [focusedRegionId, setFocusedRegionId] = useState<number>(() => findFirstUnlockedRegion(puzzle));
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [movesCount, setMovesCount] = useState(0);
	const [mistakesCount, setMistakesCount] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [settings, setSettings] = useState<ColorMapSettings>(DEFAULT_COLOR_MAP_SETTINGS);
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

	// Hydrate settings and URL / saved active game snapshot on mount
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
						colors: savedSnapshot.colors,
						candidates: savedSnapshot.candidates,
					}),
				);
				setElapsedSeconds(savedSnapshot.elapsedSeconds);
				setMovesCount(savedSnapshot.movesCount);
				setMistakesCount(savedSnapshot.mistakesCount);
				setFocusedRegionId(findFirstUnlockedRegion(savedSnapshot.puzzle));
				setIsPaused(true);
			} else {
				const fresh = generatePuzzle(requestedDifficulty);
				setPuzzle(fresh);
				setHistory(createHistory(createInitialBoardState(fresh)));
				setElapsedSeconds(0);
				setMovesCount(0);
				setMistakesCount(0);
				setFocusedRegionId(findFirstUnlockedRegion(fresh));
				setIsPaused(false);
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

	const conflicts = useMemo(
		() => validateBoard(puzzle.regions, history.present.colors),
		[puzzle.regions, history.present.colors],
	);

	const uncoloredCount = useMemo(() => countUncoloredRegions(history.present.colors), [history.present.colors]);

	// Timer loop
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
			colors: history.present.colors,
			candidates: history.present.candidates,
			elapsedSeconds,
			movesCount,
			mistakesCount,
			updatedAt: Date.now(),
		});
	}, [isHydrated, isComplete, puzzle, history.present, elapsedSeconds, movesCount, mistakesCount]);

	const finalizeVictory = useCallback((nextMoves: number, nextMistakes: number) => {
		setIsComplete(true);
		setIsVictoryOpen(true);
		void clearActiveGame();

		const currentPuzzle = puzzleRef.current;
		const finalSeconds = elapsedRef.current;

		void recordColorMapRoundStats({
			difficulty: currentPuzzle.difficulty,
			won: true,
			playTimeSeconds: finalSeconds,
			movesCount: nextMoves,
			mistakesCount: nextMistakes,
		});

		void recordGameResult(
			{
				gameId: 'color-map',
				won: true,
				playTimeSeconds: finalSeconds,
				levelKey: currentPuzzle.difficulty,
				sizeKey: `${currentPuzzle.gridSize}x${currentPuzzle.gridSize}`,
				roundContext: {
					difficulty: currentPuzzle.difficulty,
					movesCount: nextMoves,
					mistakesCount: nextMistakes,
				},
			},
			{ definitions: COLOR_MAP_MEDAL_DEFINITIONS },
		);
	}, []);

	const commitState = useCallback(
		(nextState: ColorMapBoardState, countMove: boolean, addedMistake: boolean) => {
			const nextMoves = countMove ? movesRef.current + 1 : movesRef.current;
			const nextMistakes = addedMistake ? mistakesRef.current + 1 : mistakesRef.current;

			setHistory((prev) => pushHistory(prev, nextState));
			if (countMove) setMovesCount(nextMoves);
			if (addedMistake) setMistakesCount(nextMistakes);

			if (isBoardComplete(puzzleRef.current.regions, nextState.colors)) {
				playDrop();
				triggerHaptic('success');
				finalizeVictory(nextMoves, nextMistakes);
			}
		},
		[finalizeVictory],
	);

	const applyColor = useCallback(
		(regionId: number, color: ColorIndex): 'applied' | 'locked' | 'unchanged' => {
			if (isPaused || isComplete) return 'unchanged';
			const currentPuzzle = puzzleRef.current;
			if (currentPuzzle.givens[regionId] !== null) {
				playRegression();
				return 'locked';
			}

			const prevColors = history.present.colors;
			const prevCandidates = history.present.candidates;
			if (prevColors[regionId] === color) return 'unchanged';

			const nextColors = prevColors.map((c, idx) => (idx === regionId ? color : c));
			const neighborSet = new Set(currentPuzzle.regions[regionId]?.neighbors ?? []);

			const nextCandidates = prevCandidates.map((cands, idx) => {
				if (idx === regionId) return [];
				if (settings.autoClearCandidates && neighborSet.has(idx) && cands.includes(color)) {
					return cands.filter((c) => c !== color);
				}
				return cands;
			});

			const prevConflicts = validateBoard(currentPuzzle.regions, prevColors);
			const nextConflicts = validateBoard(currentPuzzle.regions, nextColors);
			const createdConflict =
				nextConflicts.conflictingRegions.has(regionId) &&
				nextConflicts.conflictingPairs.size > prevConflicts.conflictingPairs.size;

			if (createdConflict) {
				playRegression();
				triggerHaptic('warning');
			} else {
				playTap();
			}

			commitState({ colors: nextColors, candidates: nextCandidates }, true, createdConflict);
			return 'applied';
		},
		[commitState, history.present, isComplete, isPaused, settings.autoClearCandidates],
	);

	const eraseRegion = useCallback(
		(regionId: number): 'erased' | 'locked' | 'unchanged' => {
			if (isPaused || isComplete) return 'unchanged';
			const currentPuzzle = puzzleRef.current;
			if (currentPuzzle.givens[regionId] !== null) {
				playRegression();
				return 'locked';
			}

			const prevColors = history.present.colors;
			const prevCandidates = history.present.candidates;
			if (prevColors[regionId] === null && prevCandidates[regionId].length === 0) {
				return 'unchanged';
			}

			const nextColors = prevColors.map((c, idx) => (idx === regionId ? null : c));
			const nextCandidates = prevCandidates.map((cands, idx) => (idx === regionId ? [] : cands));
			playTap();
			commitState({ colors: nextColors, candidates: nextCandidates }, false, false);
			return 'erased';
		},
		[commitState, history.present, isComplete, isPaused],
	);

	const toggleCandidate = useCallback(
		(regionId: number, color: ColorIndex): 'added' | 'removed' | 'locked' | 'unchanged' => {
			if (isPaused || isComplete) return 'unchanged';
			const currentPuzzle = puzzleRef.current;
			if (currentPuzzle.givens[regionId] !== null) {
				playRegression();
				return 'locked';
			}
			// Only toggle candidate dots on uncolored regions
			if (history.present.colors[regionId] !== null) return 'unchanged';

			const prevCandidates = history.present.candidates;
			const currentList = prevCandidates[regionId] ?? [];
			const exists = currentList.includes(color);
			const updatedList = exists
				? currentList.filter((c) => c !== color)
				: ([...currentList, color].sort((a, b) => a - b) as ColorIndex[]);

			const nextCandidates = prevCandidates.map((cands, idx) => (idx === regionId ? updatedList : cands));
			playTap();
			commitState({ colors: history.present.colors, candidates: nextCandidates }, false, false);
			return exists ? 'removed' : 'added';
		},
		[commitState, history.present, isComplete, isPaused],
	);

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
		setHistory(createHistory(createInitialBoardState(puzzleRef.current)));
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
		setHistory(createHistory(createInitialBoardState(fresh)));
		setFocusedRegionId(findFirstUnlockedRegion(fresh));
		setIsPencilMode(false);
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

	const handleTogglePencilMode = useCallback(() => {
		setIsPencilMode((prev) => !prev);
	}, []);

	const updateSettings = useCallback((next: ColorMapSettings) => {
		setSettings(next);
		void saveSettings(next);
	}, []);

	const handleToggleHighlightConflicts = useCallback(() => {
		setSettings((prev) => {
			const next: ColorMapSettings = { ...prev, highlightConflicts: !prev.highlightConflicts };
			void saveSettings(next);
			return next;
		});
	}, []);

	// Global keyboard shortcuts when not typing in inputs or already handled by region buttons
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (isRulesOpen || isSettingsOpen || isVictoryOpen) return;
			const target = e.target as HTMLElement | null;
			if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
			if (target?.getAttribute('data-color-map-region') === 'true') return;

			if (e.key === 'Escape') {
				e.preventDefault();
				handleTogglePause();
				return;
			}
			if (isPaused || isComplete) return;

			if (e.key === 'p' || e.key === 'P') {
				e.preventDefault();
				handleTogglePencilMode();
			} else if ((e.key === 'z' || e.key === 'Z') && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				handleUndo();
			} else if ((e.key === 'y' || e.key === 'Y') && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				handleRedo();
			} else if (e.key === '0') {
				e.preventDefault();
				setActiveTool('eraser');
			} else if (/^[1-4]$/.test(e.key)) {
				e.preventDefault();
				setActiveTool((Number.parseInt(e.key, 10) - 1) as ColorIndex);
			}
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => window.removeEventListener('keydown', handleGlobalKeyDown);
	}, [
		handleRedo,
		handleTogglePause,
		handleTogglePencilMode,
		handleUndo,
		isComplete,
		isPaused,
		isRulesOpen,
		isSettingsOpen,
		isVictoryOpen,
	]);

	return {
		puzzle,
		colors: history.present.colors,
		candidates: history.present.candidates,
		difficulty: puzzle.difficulty,
		nextDifficulty: getNextDifficulty(puzzle.difficulty),
		activeTool,
		setActiveTool,
		isPencilMode,
		focusedRegionId,
		setFocusedRegionId,
		conflicts,
		uncoloredCount,
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
		applyColor,
		eraseRegion,
		toggleCandidate,
		handleUndo,
		handleRedo,
		handleRestart,
		handleStartNewGame,
		handleTogglePause,
		handleTogglePencilMode,
		handleToggleHighlightConflicts,
		updateSettings,
		openRules: () => setIsRulesOpen(true),
		closeRules: () => setIsRulesOpen(false),
		openSettings: () => setIsSettingsOpen(true),
		closeSettings: () => setIsSettingsOpen(false),
		closeVictory: () => setIsVictoryOpen(false),
	};
}
