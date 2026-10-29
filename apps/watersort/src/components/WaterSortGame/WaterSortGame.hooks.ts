import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WATERSORT_MEDAL_DEFINITIONS } from '../../config/medals.js';
import { generatePuzzle } from '../../engine/generator.js';
import { canRedo, canUndo, createHistory, pushState, redo, reset, undo } from '../../engine/history.js';
import { type PresetPuzzleDefinition, getPreset, getPresetById } from '../../engine/presets/index.js';
import { suggestHint } from '../../engine/solver.js';
import { clearActiveGame, loadActiveGame, recordRoundResult, saveActiveGame } from '../../engine/storage.js';
import {
	type Board,
	DIFFICULTY_CONFIG,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type GameSnapshot,
	type Move,
} from '../../engine/types.js';
import { applyPour, canPour, isDeadlocked, isSolved } from '../../engine/validator.js';
import type { WaterSortSettings } from '../WaterSortSettingsDialog/WaterSortSettingsDialog.types.js';

const DEFAULT_SETTINGS: WaterSortSettings = {
	colorblindPatterns: false,
	fluidAnimations: true,
};

function parseUrlLaunchParams(
	initialDifficulty: DifficultyLevel,
	initialSeed?: number,
): {
	difficulty: DifficultyLevel;
	seed: number;
	hasExplicitUrlParams: boolean;
	isResume: boolean;
	preset?: PresetPuzzleDefinition;
} {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const rawPuzzle = params.get('puzzle');
		if (rawPuzzle) {
			const found = getPresetById(rawPuzzle);
			if (found) {
				return {
					difficulty: found.difficulty,
					seed: found.level,
					hasExplicitUrlParams: true,
					isResume: false,
					preset: found,
				};
			}
		}

		const rawDiff = params.get('difficulty');
		const difficultyParam =
			rawDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(rawDiff) ? (rawDiff as DifficultyLevel) : null;
		const rawSeed = params.get('seed');
		const parsedSeed = rawSeed !== null ? Number.parseInt(rawSeed, 10) : Number.NaN;
		const seedParam = !Number.isNaN(parsedSeed) && parsedSeed > 0 ? parsedSeed : null;
		const isNew = params.get('new') === 'true';
		const isResume = params.get('resume') === 'true';

		const diff = difficultyParam ?? initialDifficulty;
		const finalSeed = seedParam ?? initialSeed ?? Math.floor(Math.random() * 100000) + 1;

		if (finalSeed >= 1 && finalSeed <= 10) {
			const preset = getPreset(diff, finalSeed);
			return {
				difficulty: diff,
				seed: finalSeed,
				hasExplicitUrlParams: difficultyParam !== null || seedParam !== null || isNew,
				isResume,
				preset,
			};
		}

		return {
			difficulty: diff,
			seed: finalSeed,
			hasExplicitUrlParams: difficultyParam !== null || seedParam !== null || isNew,
			isResume,
		};
	}

	const fallbackSeed = initialSeed ?? 1;
	const preset = fallbackSeed >= 1 && fallbackSeed <= 10 ? getPreset(initialDifficulty, fallbackSeed) : undefined;

	return {
		difficulty: initialDifficulty,
		seed: fallbackSeed,
		hasExplicitUrlParams: false,
		isResume: false,
		preset,
	};
}

export function useWaterSortGame(initialDifficulty: DifficultyLevel = 'easy', initialSeed?: number) {
	const initialLaunch = useMemo(() => {
		const parsed = parseUrlLaunchParams(initialDifficulty, initialSeed);
		if (parsed.preset) {
			return {
				...parsed,
				board: parsed.preset.board,
				parMoves: parsed.preset.parMoves,
			};
		}
		const puzzle = generatePuzzle(parsed.difficulty, parsed.seed);
		return {
			...parsed,
			board: puzzle.board,
			parMoves: puzzle.solution.length,
		};
	}, [initialDifficulty, initialSeed]);

	const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialLaunch.difficulty);
	const [seed, setSeed] = useState<number>(initialLaunch.seed);
	const [parMoves, setParMoves] = useState<number>(initialLaunch.parMoves);
	const [history, setHistory] = useState(() => createHistory(initialLaunch.board));
	const [selectedTube, setSelectedTube] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isWon, setIsWon] = useState(false);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [undosUsed, setUndosUsed] = useState(0);
	const [consecutiveCompletions, setConsecutiveCompletions] = useState(0);
	const [maxConsecutiveCompletions, setMaxConsecutiveCompletions] = useState(0);
	const [usedBufferTubes, setUsedBufferTubes] = useState<readonly number[]>([]);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [settings, setSettings] = useState<WaterSortSettings>(DEFAULT_SETTINGS);
	const [ariaAnnouncement, setAriaAnnouncement] = useState('');

	const isDeadlockedState = useMemo(() => isDeadlocked(history.present), [history.present]);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Priority order for starting state:
	// 1. If isResume and snapshot exists: resume snapshot.
	// 2. If explicit difficulty and/or seed are in URL (or isNew is true): keep the fresh generated board.
	// 3. Fallback: load snapshot if present, otherwise keep default Easy board.
	useEffect(() => {
		async function restoreIfApplicable() {
			if (!initialLaunch.isResume && initialLaunch.hasExplicitUrlParams) {
				return;
			}

			const snapshot = await loadActiveGame();
			if (snapshot) {
				setDifficulty(snapshot.difficulty);
				setSeed(snapshot.seed);
				setHistory(snapshot.history);
				setMoves(snapshot.moves);
				setElapsedSeconds(snapshot.elapsedSeconds);
				setHintsUsed(snapshot.hintsUsed);
				setUndosUsed(snapshot.undosUsed);
				setMaxConsecutiveCompletions(snapshot.maxConsecutiveTubeCompletions ?? 0);
				setUsedBufferTubes(snapshot.usedBufferTubes ?? []);
				if (snapshot.parMoves !== undefined) {
					setParMoves(snapshot.parMoves);
				} else if (snapshot.seed >= 1 && snapshot.seed <= 10) {
					const preset = getPreset(snapshot.difficulty, snapshot.seed);
					setParMoves(preset.parMoves);
				} else {
					const puzzle = generatePuzzle(snapshot.difficulty, snapshot.seed);
					setParMoves(puzzle.solution.length);
				}
			}
		}
		restoreIfApplicable();
	}, [initialLaunch]);

	// Timer loop
	useEffect(() => {
		if (!isPaused && !isWon && !isDeadlockedState) {
			timerRef.current = setInterval(() => {
				setElapsedSeconds((prev) => prev + 1);
			}, 1000);
		} else if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [isPaused, isWon, isDeadlockedState]);

	// Auto-save snapshot
	useEffect(() => {
		if (!isWon && moves > 0) {
			const snapshot: GameSnapshot = {
				difficulty,
				seed,
				history,
				moves,
				elapsedSeconds,
				hintsUsed,
				undosUsed,
				parMoves,
				maxConsecutiveTubeCompletions: maxConsecutiveCompletions,
				usedBufferTubes,
			};
			saveActiveGame(snapshot);
		}
	}, [
		difficulty,
		seed,
		history,
		moves,
		elapsedSeconds,
		hintsUsed,
		undosUsed,
		parMoves,
		maxConsecutiveCompletions,
		usedBufferTubes,
		isWon,
	]);

	const handleSelectTube = useCallback(
		(index: number) => {
			if (isWon || isPaused || isDeadlockedState) return;

			if (selectedTube === null) {
				if (history.present[index].length > 0) {
					setSelectedTube(index);
					setAriaAnnouncement(`Selected tube ${index + 1}`);
				}
				return;
			}

			if (selectedTube === index) {
				setSelectedTube(null);
				setAriaAnnouncement(`Deselected tube ${index + 1}`);
				return;
			}

			const move: Move = { from: selectedTube, to: index };
			if (canPour(history.present, move)) {
				const prevCompleted = history.present.filter(
					(t) => t.length === 4 && t.every((c) => c === t[0]),
				).length;
				const nextBoard = applyPour(history.present, move);
				const nextCompleted = nextBoard.filter((t) => t.length === 4 && t.every((c) => c === t[0])).length;
				const nextMoves = moves + 1;
				const nextConsecutive =
					nextCompleted > prevCompleted ? consecutiveCompletions + (nextCompleted - prevCompleted) : 0;
				const nextMaxConsecutive = Math.max(maxConsecutiveCompletions, nextConsecutive);
				const colorCount = DIFFICULTY_CONFIG[difficulty].colorCount;
				const nextUsedBufferTubes =
					index >= colorCount && !usedBufferTubes.includes(index)
						? [...usedBufferTubes, index]
						: usedBufferTubes;

				setHistory((prev) => pushState(prev, nextBoard));
				setMoves(nextMoves);
				setConsecutiveCompletions(nextConsecutive);
				setMaxConsecutiveCompletions(nextMaxConsecutive);
				setUsedBufferTubes(nextUsedBufferTubes);
				setSelectedTube(null);
				setAriaAnnouncement(`Poured liquid from tube ${selectedTube + 1} into tube ${index + 1}`);

				if (isSolved(nextBoard)) {
					setIsWon(true);
					clearActiveGame();
					recordRoundResult(difficulty, elapsedSeconds, nextMoves, seed);
					recordGameResult(
						{
							gameId: 'watersort',
							won: true,
							playTimeSeconds: elapsedSeconds,
							levelKey: difficulty,
							sizeKey: `${history.present.length}tubes`,
							roundContext: {
								moves: nextMoves,
								undosUsed,
								hintsUsed,
								elapsedSeconds,
								difficulty,
								parMoves,
								maxConsecutiveTubeCompletions: nextMaxConsecutive,
								emptyBuffersUsed: nextUsedBufferTubes.length,
							},
						},
						{ definitions: WATERSORT_MEDAL_DEFINITIONS },
					);
				}
			} else {
				setSelectedTube(null);
				setAriaAnnouncement(`Cannot pour into tube ${index + 1}`);
			}
		},
		[
			selectedTube,
			history,
			isWon,
			isPaused,
			isDeadlockedState,
			difficulty,
			seed,
			elapsedSeconds,
			moves,
			hintsUsed,
			undosUsed,
			parMoves,
			consecutiveCompletions,
			maxConsecutiveCompletions,
			usedBufferTubes,
		],
	);

	const handleUndo = useCallback(() => {
		if (canUndo(history)) {
			setHistory((prev) => undo(prev));
			setSelectedTube(null);
			setUndosUsed((prev) => prev + 1);
			setConsecutiveCompletions(0);
			setAriaAnnouncement('Undid last pour');
		}
	}, [history]);

	const handleRedo = useCallback(() => {
		if (canRedo(history)) {
			setHistory((prev) => redo(prev));
			setSelectedTube(null);
			setAriaAnnouncement('Redid pour');
		}
	}, [history]);

	const handleReset = useCallback(() => {
		setHistory((prev) => reset(prev));
		setSelectedTube(null);
		setUndosUsed(0);
		setConsecutiveCompletions(0);
		setMaxConsecutiveCompletions(0);
		setUsedBufferTubes([]);
		setAriaAnnouncement('Reset puzzle to start');
	}, []);

	const handleHint = useCallback(() => {
		if (isWon || isPaused || isDeadlockedState) return;
		const hintMove = suggestHint(history.present);
		if (hintMove) {
			setSelectedTube(hintMove.from);
			setHintsUsed((prev) => prev + 1);
			setAriaAnnouncement(`Hint: Pour from tube ${hintMove.from + 1} into tube ${hintMove.to + 1}`);
		}
	}, [history.present, isWon, isPaused, isDeadlockedState]);

	const handleNextPuzzle = useCallback(() => {
		const nextSeed = seed >= 1 && seed < 10 ? seed + 1 : Math.floor(Math.random() * 100000) + 1;
		let nextBoard: Board;
		let nextParMoves: number;

		if (nextSeed >= 1 && nextSeed <= 10) {
			const preset = getPreset(difficulty, nextSeed);
			nextBoard = preset.board;
			nextParMoves = preset.parMoves;
		} else {
			const puzzle = generatePuzzle(difficulty, nextSeed);
			nextBoard = puzzle.board;
			nextParMoves = puzzle.solution.length;
		}

		setSeed(nextSeed);
		setParMoves(nextParMoves);
		setMoves(0);
		setElapsedSeconds(0);
		setIsWon(false);
		setSelectedTube(null);
		setHintsUsed(0);
		setUndosUsed(0);
		setConsecutiveCompletions(0);
		setMaxConsecutiveCompletions(0);
		setUsedBufferTubes([]);
		setHistory(createHistory(nextBoard));
	}, [difficulty, seed]);

	return {
		difficulty,
		seed,
		parMoves,
		board: history.present,
		selectedTube,
		moves,
		elapsedSeconds,
		isPaused,
		isWon,
		isDeadlocked: isDeadlockedState,
		canUndo: canUndo(history),
		canRedo: canRedo(history),
		settings,
		settingsOpen,
		ariaAnnouncement,
		totalColorTubes: DIFFICULTY_CONFIG[difficulty].colorCount,
		completedTubes: history.present.filter((t) => t.length === 4 && t.every((c) => c === t[0])).length,
		onSelectTube: handleSelectTube,
		onUndo: handleUndo,
		onRedo: handleRedo,
		onReset: handleReset,
		onHint: handleHint,
		onTogglePause: () => setIsPaused((prev) => !prev),
		onOpenSettings: () => setSettingsOpen(true),
		onCloseSettings: () => setSettingsOpen(false),
		onUpdateSettings: setSettings,
		onPlayAgain: () => {
			setIsWon(false);
			handleReset();
		},
		onNextPuzzle: handleNextPuzzle,
	};
}
