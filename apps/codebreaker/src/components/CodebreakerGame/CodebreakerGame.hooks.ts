import { playDrop, playRegression, playTap, triggerHaptic } from '@arcade/lib-audio';
import { recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CODEBREAKER_MEDAL_DEFINITIONS } from '../../config/medals';
import { generateSecretCode } from '../../engine/generator';
import {
	type DraftHistoryState,
	canRedoDraft,
	canUndoDraft,
	createDraftHistory,
	pushDraftState,
	redoDraftState,
	undoDraftState,
} from '../../engine/history';
import { scoreGuess } from '../../engine/scorer';
import { computeHint } from '../../engine/solver';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordCodebreakerRoundStats,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage';
import {
	type CodebreakerSettings,
	DEFAULT_CODEBREAKER_SETTINGS,
	DIFFICULTY_CONFIGS,
	type Difficulty,
	type GameStatus,
	type GuessRow,
	type HintResult,
	type PegColorId,
	isDifficulty,
} from '../../engine/types';

function parseDifficultyParam(raw: string | null, fallback: Difficulty): Difficulty {
	return isDifficulty(raw) ? raw : fallback;
}

export function useCodebreakerGame(initialDifficulty: Difficulty = 'easy') {
	const initialConfig = DIFFICULTY_CONFIGS[initialDifficulty];
	const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
	const [allowDuplicates, setAllowDuplicates] = useState<boolean>(DEFAULT_CODEBREAKER_SETTINGS.allowDuplicates);
	const [secret, setSecret] = useState<readonly PegColorId[]>(() =>
		generateSecretCode({
			codeLength: initialConfig.codeLength,
			colorCount: initialConfig.colorCount,
			allowDuplicates: DEFAULT_CODEBREAKER_SETTINGS.allowDuplicates,
		}),
	);
	const [history, setHistory] = useState<readonly GuessRow[]>([]);
	const [draftHistory, setDraftHistory] = useState<DraftHistoryState>(() =>
		createDraftHistory(initialConfig.codeLength),
	);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [status, setStatus] = useState<GameStatus>('playing');
	const [isPaused, setIsPaused] = useState(false);
	const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [settings, setSettings] = useState<CodebreakerSettings>(DEFAULT_CODEBREAKER_SETTINGS);
	const [conflictingRowIndex, setConflictingRowIndex] = useState<number | null>(null);
	const [hintedSlotIndex, setHintedSlotIndex] = useState<number | null>(null);
	const [activeHint, setActiveHint] = useState<HintResult | null>(null);
	const [liveAnnouncement, setLiveAnnouncement] = useState('');
	const [isHydrated, setIsHydrated] = useState(false);

	const config = DIFFICULTY_CONFIGS[difficulty];
	const draft = draftHistory.present.draft;
	const selectedSlot = draftHistory.present.selectedSlot;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;
	const hintsRef = useRef(hintsUsed);
	hintsRef.current = hintsUsed;
	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const isComplete = status !== 'playing';
	const canUndo = canUndoDraft(draftHistory);
	const canRedo = canRedoDraft(draftHistory);
	const canSubmit = useMemo(
		() => status === 'playing' && draft.length === config.codeLength && draft.every((peg) => peg !== null),
		[status, draft, config.codeLength],
	);
	const canClear = useMemo(() => status === 'playing' && draft.some((peg) => peg !== null), [status, draft]);

	// Hydrate settings & active session snapshot on mount
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

			if (
				!isNew &&
				savedSnapshot &&
				savedSnapshot.status === 'playing' &&
				(isResume || savedSnapshot.difficulty === requestedDifficulty)
			) {
				const snapConfig = DIFFICULTY_CONFIGS[savedSnapshot.difficulty];
				setDifficulty(savedSnapshot.difficulty);
				setAllowDuplicates(savedSnapshot.allowDuplicates);
				setSecret(savedSnapshot.secret);
				setHistory(savedSnapshot.history);
				setDraftHistory(
					createDraftHistory(snapConfig.codeLength, savedSnapshot.draft, savedSnapshot.selectedSlot),
				);
				setElapsedSeconds(savedSnapshot.elapsedSeconds);
				setHintsUsed(savedSnapshot.hintsUsed);
				setStatus('playing');
				setIsPaused(true);
			} else {
				const freshConfig = DIFFICULTY_CONFIGS[requestedDifficulty];
				const freshSecret = generateSecretCode({
					codeLength: freshConfig.codeLength,
					colorCount: freshConfig.colorCount,
					allowDuplicates: savedSettings.allowDuplicates,
				});
				setDifficulty(requestedDifficulty);
				setAllowDuplicates(savedSettings.allowDuplicates);
				setSecret(freshSecret);
				setHistory([]);
				setDraftHistory(createDraftHistory(freshConfig.codeLength));
				setElapsedSeconds(0);
				setHintsUsed(0);
				setStatus('playing');
				setIsPaused(false);
				await clearActiveGame();
				void saveLastConfig({ difficulty: requestedDifficulty });
			}

			setIsHydrated(true);
		}

		void hydrate();
		return () => {
			cancelled = true;
		};
	}, [initialDifficulty]);

	// Timer tick while actively playing
	useEffect(() => {
		if (!isHydrated || isPaused || isComplete || isRulesOpen || isSettingsOpen) {
			return;
		}
		const interval = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(interval);
	}, [isHydrated, isPaused, isComplete, isRulesOpen, isSettingsOpen]);

	// Auto-save active session snapshot
	useEffect(() => {
		if (!isHydrated || status !== 'playing') {
			return;
		}
		if (history.length === 0 && draft.every((peg) => peg === null) && elapsedSeconds === 0) {
			return;
		}
		void saveActiveGame({
			difficulty,
			allowDuplicates,
			secret,
			history,
			draft,
			selectedSlot,
			elapsedSeconds,
			hintsUsed,
			status,
			updatedAt: Date.now(),
		});
	}, [
		isHydrated,
		difficulty,
		allowDuplicates,
		secret,
		history,
		draft,
		selectedSlot,
		elapsedSeconds,
		hintsUsed,
		status,
	]);

	const clearHintIndicators = useCallback(() => {
		setConflictingRowIndex(null);
		setHintedSlotIndex(null);
		setActiveHint(null);
	}, []);

	const handleSelectSlot = useCallback(
		(slotIndex: number) => {
			if (isPaused || isComplete) return;
			const clamped = Math.max(0, Math.min(config.codeLength - 1, slotIndex));
			clearHintIndicators();
			setDraftHistory((prev) => {
				// Tapping an already-selected filled slot clears it for ergonomic tap-only play
				if (prev.present.selectedSlot === clamped && prev.present.draft[clamped] !== null) {
					const nextDraft = [...prev.present.draft];
					nextDraft[clamped] = null;
					playTap();
					return pushDraftState(prev, nextDraft, clamped);
				}
				return pushDraftState(prev, prev.present.draft, clamped);
			});
		},
		[isPaused, isComplete, config.codeLength, clearHintIndicators],
	);

	const handlePlaceColor = useCallback(
		(colorId: PegColorId) => {
			if (isPaused || isComplete) return;
			if (colorId < 0 || colorId >= config.colorCount) return;

			clearHintIndicators();
			setDraftHistory((prev) => {
				const currentDraft = prev.present.draft;
				const slot = prev.present.selectedSlot;

				if (!allowDuplicates) {
					const alreadyUsedElsewhere = currentDraft.some((peg, idx) => peg === colorId && idx !== slot);
					if (alreadyUsedElsewhere) {
						playRegression();
						return prev;
					}
				}

				const nextDraft = [...currentDraft];
				nextDraft[slot] = colorId;

				let nextSlot = slot;
				if (settingsRef.current.autoAdvanceSlot) {
					const nextEmptyAfter = nextDraft.findIndex((peg, idx) => idx > slot && peg === null);
					if (nextEmptyAfter !== -1) {
						nextSlot = nextEmptyAfter;
					} else {
						const firstEmpty = nextDraft.findIndex((peg) => peg === null);
						if (firstEmpty !== -1) {
							nextSlot = firstEmpty;
						}
					}
				}

				playTap();
				triggerHaptic('light');
				return pushDraftState(prev, nextDraft, nextSlot);
			});
		},
		[isPaused, isComplete, config.colorCount, allowDuplicates, clearHintIndicators],
	);

	const handleClearSlot = useCallback(() => {
		if (isPaused || isComplete) return;
		clearHintIndicators();
		setDraftHistory((prev) => {
			const currentDraft = prev.present.draft;
			const slot = prev.present.selectedSlot;

			if (currentDraft[slot] !== null) {
				const nextDraft = [...currentDraft];
				nextDraft[slot] = null;
				playTap();
				return pushDraftState(prev, nextDraft, slot);
			}

			// If active slot is already empty, step back and clear the previous filled slot
			for (let i = slot - 1; i >= 0; i -= 1) {
				if (currentDraft[i] !== null) {
					const nextDraft = [...currentDraft];
					nextDraft[i] = null;
					playTap();
					return pushDraftState(prev, nextDraft, i);
				}
			}

			return prev;
		});
	}, [isPaused, isComplete, clearHintIndicators]);

	const handleUndo = useCallback(() => {
		if (isPaused || isComplete) return;
		clearHintIndicators();
		setDraftHistory((prev) => {
			if (!canUndoDraft(prev)) return prev;
			playTap();
			return undoDraftState(prev);
		});
	}, [isPaused, isComplete, clearHintIndicators]);

	const handleRedo = useCallback(() => {
		if (isPaused || isComplete) return;
		clearHintIndicators();
		setDraftHistory((prev) => {
			if (!canRedoDraft(prev)) return prev;
			playTap();
			return redoDraftState(prev);
		});
	}, [isPaused, isComplete, clearHintIndicators]);

	const finalizeRound = useCallback(
		(won: boolean, guessesUsed: number) => {
			setStatus(won ? 'won' : 'lost');
			setIsEndDialogOpen(true);
			void clearActiveGame();

			const playTimeSeconds = elapsedRef.current;
			const totalHints = hintsRef.current;

			void recordCodebreakerRoundStats({
				difficulty,
				won,
				playTimeSeconds,
				guessesUsed,
				hintsUsed: totalHints,
			});

			void recordGameResult(
				{
					gameId: 'codebreaker',
					won,
					playTimeSeconds,
					levelKey: difficulty,
					roundContext: {
						difficulty,
						guessesUsed,
						hintsUsed: totalHints,
						allowDuplicates,
					},
				},
				{ definitions: CODEBREAKER_MEDAL_DEFINITIONS },
			);
		},
		[difficulty, allowDuplicates],
	);

	const handleSubmitGuess = useCallback((): GuessRow | null => {
		if (isPaused || isComplete || !canSubmit) {
			return null;
		}

		const fullGuess = draft as readonly PegColorId[];
		const feedback = scoreGuess(secret, fullGuess);
		const nextRow: GuessRow = { guess: [...fullGuess], feedback };
		const nextHistory = [...history, nextRow];

		clearHintIndicators();
		setHistory(nextHistory);
		setDraftHistory(createDraftHistory(config.codeLength));

		if (feedback.exact === config.codeLength) {
			playDrop();
			triggerHaptic('success');
			finalizeRound(true, nextHistory.length);
		} else if (nextHistory.length >= config.maxAttempts) {
			playRegression();
			triggerHaptic('warning');
			finalizeRound(false, nextHistory.length);
		} else {
			playDrop();
			triggerHaptic('medium');
		}

		return nextRow;
	}, [
		isPaused,
		isComplete,
		canSubmit,
		draft,
		secret,
		history,
		config.codeLength,
		config.maxAttempts,
		clearHintIndicators,
		finalizeRound,
	]);

	const handleHint = useCallback((): HintResult | null => {
		if (isPaused || isComplete) return null;

		const result = computeHint(history, draft, {
			codeLength: config.codeLength,
			colorCount: config.colorCount,
			allowDuplicates,
		});

		setHintsUsed((prev) => prev + 1);
		setActiveHint(result);

		if (result.kind === 'contradiction') {
			setConflictingRowIndex(result.conflictingRowIndex);
			setHintedSlotIndex(null);
			playRegression();
			triggerHaptic('warning');
		} else if (result.kind === 'suggestion') {
			setConflictingRowIndex(null);
			setHintedSlotIndex(result.slotIndex);
			setDraftHistory((prev) => {
				const nextDraft = [...prev.present.draft];
				nextDraft[result.slotIndex] = result.colorId;
				const nextEmpty = nextDraft.findIndex((peg) => peg === null);
				const nextSlot = nextEmpty === -1 ? result.slotIndex : nextEmpty;
				return pushDraftState(prev, nextDraft, nextSlot);
			});
			playTap();
			triggerHaptic('light');
		} else {
			setConflictingRowIndex(null);
			setHintedSlotIndex(null);
			playTap();
		}

		return result;
	}, [isPaused, isComplete, history, draft, config.codeLength, config.colorCount, allowDuplicates]);

	const handleStartNewGame = useCallback(
		(nextDifficulty: Difficulty = difficulty) => {
			const nextConfig = DIFFICULTY_CONFIGS[nextDifficulty];
			const nextAllowDuplicates = settingsRef.current.allowDuplicates;
			const nextSecret = generateSecretCode({
				codeLength: nextConfig.codeLength,
				colorCount: nextConfig.colorCount,
				allowDuplicates: nextAllowDuplicates,
			});

			setDifficulty(nextDifficulty);
			setAllowDuplicates(nextAllowDuplicates);
			setSecret(nextSecret);
			setHistory([]);
			setDraftHistory(createDraftHistory(nextConfig.codeLength));
			setElapsedSeconds(0);
			setHintsUsed(0);
			setStatus('playing');
			setIsPaused(false);
			setIsEndDialogOpen(false);
			clearHintIndicators();
			void clearActiveGame();
			void saveLastConfig({ difficulty: nextDifficulty });
		},
		[difficulty, clearHintIndicators],
	);

	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	const openRules = useCallback(() => setIsRulesOpen(true), []);
	const closeRules = useCallback(() => setIsRulesOpen(false), []);
	const openSettings = useCallback(() => setIsSettingsOpen(true), []);
	const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
	const closeEndDialog = useCallback(() => setIsEndDialogOpen(false), []);

	const updateSettings = useCallback((nextSettings: CodebreakerSettings) => {
		setSettings(nextSettings);
		void saveSettings(nextSettings);
	}, []);

	return {
		difficulty,
		config,
		allowDuplicates,
		secret,
		history,
		draft,
		selectedSlot,
		elapsedSeconds,
		hintsUsed,
		status,
		isComplete,
		isPaused,
		isEndDialogOpen,
		isRulesOpen,
		isSettingsOpen,
		settings,
		canUndo,
		canRedo,
		canSubmit,
		canClear,
		conflictingRowIndex,
		hintedSlotIndex,
		activeHint,
		liveAnnouncement,
		setLiveAnnouncement,
		handleSelectSlot,
		handlePlaceColor,
		handleClearSlot,
		handleUndo,
		handleRedo,
		handleSubmitGuess,
		handleHint,
		handleStartNewGame,
		handleTogglePause,
		openRules,
		closeRules,
		openSettings,
		closeSettings,
		closeEndDialog,
		updateSettings,
	};
}
