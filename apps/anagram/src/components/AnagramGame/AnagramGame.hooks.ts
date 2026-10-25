import { getGameMedalState, recordGameResult } from '@arcade/lib-medals';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateRound, shuffleRack } from '../../engine/generator.js';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordRoundResult,
	saveActiveGame,
} from '../../engine/storage.js';
import {
	type AnagramData,
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
	type GameMode,
	type GameSnapshot,
	type LanguageCode,
	SUPPORTED_VOCAB_LANGUAGES,
	TIMED_MODE_BONUS_SECONDS_PER_WORD,
	TIMED_MODE_INITIAL_SECONDS,
} from '../../engine/types.js';
import {
	getMatchingWords,
	isRoundCleared,
	isRoundMastered,
	normalizeTile,
	normalizeWord,
	scoreWord,
	validateGuess,
} from '../../engine/validator.js';
import type { Feedback, RackTile, RoundOutcome } from './AnagramGame.types.js';

const QUICK_SHUFFLE_COUNT = 3;
const QUICK_SHUFFLE_WINDOW_MS = 2000;
const LETTER_KEY_PATTERN = /^\p{L}$/u;

interface RoundStats {
	shuffles: number;
	shuffleTimestamps: number[];
	quickShuffleBurst: boolean;
	invalidGuesses: number;
	duplicateGuesses: number;
	usedCorrections: boolean;
	pausedSeconds: number;
	fullRackSecondsLeft: number | null;
	isRecorded: boolean;
}

const createStats = (): RoundStats => ({
	shuffles: 0,
	shuffleTimestamps: [],
	quickShuffleBurst: false,
	invalidGuesses: 0,
	duplicateGuesses: 0,
	usedCorrections: false,
	pausedSeconds: 0,
	fullRackSecondsLeft: null,
	isRecorded: false,
});

const createTiles = (round: AnagramData): RackTile[] => round.rack.map((letter, id) => ({ id, letter }));

function hasAnagramPair(words: readonly string[]): boolean {
	const signatures = new Set<string>();
	for (const word of words) {
		const signature = Array.from(word).sort().join('');
		if (signatures.has(signature)) return true;
		signatures.add(signature);
	}
	return false;
}

export function useAnagramGame(difficulty: DifficultyLevel, mode: GameMode, initialVocabLanguage: LanguageCode = 'en') {
	const [vocabLanguage, setVocabLanguage] = useState<LanguageCode>(initialVocabLanguage);
	const [round, setRound] = useState<AnagramData>(() => generateRound(difficulty, initialVocabLanguage));
	const [tiles, setTiles] = useState<RackTile[]>(() => createTiles(round));
	const [stagedIds, setStagedIds] = useState<number[]>([]);
	const [foundWords, setFoundWords] = useState<string[]>([]);
	const [score, setScore] = useState(0);
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [remainingSeconds, setRemainingSeconds] = useState(TIMED_MODE_INITIAL_SECONDS);
	const [isPaused, setIsPaused] = useState(false);
	const [isEnded, setIsEnded] = useState(false);
	const [isRevealed, setIsRevealed] = useState(false);
	const [outcome, setOutcome] = useState<RoundOutcome | null>(null);
	const [dialog, setDialog] = useState<'victory' | 'defeat' | null>(null);
	const [hasClearedBaseline, setHasClearedBaseline] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const stats = useRef<RoundStats>(createStats());
	const elapsedRef = useRef(0);
	elapsedRef.current = elapsedSeconds;

	// Load active game or saved language setting on mount
	useEffect(() => {
		async function init() {
			try {
				let forceNew = false;
				let forceResume = false;
				let hasExplicitVocabParam = false;
				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					if (params.get('new') === 'true') forceNew = true;
					if (params.get('resume') === 'true') forceResume = true;
					const queryVocab = params.get('vocab');
					if (queryVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(queryVocab)) {
						hasExplicitVocabParam = true;
					}
				}

				const [saved, savedSettings] = await Promise.all([loadActiveGame(), loadSettings()]);
				const resolvedLang: LanguageCode =
					!hasExplicitVocabParam &&
					savedSettings.vocabLanguage &&
					(SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(savedSettings.vocabLanguage)
						? savedSettings.vocabLanguage
						: initialVocabLanguage;

				if (!forceNew && saved && !saved.isComplete) {
					if (
						forceResume ||
						(saved.difficulty === difficulty && saved.mode === mode && saved.language === resolvedLang)
					) {
						const restoredRound: AnagramData = {
							rack: saved.rack,
							words: saved.words,
							fullLengthWords: saved.fullLengthWords,
						};
						setVocabLanguage(saved.language);
						setRound(restoredRound);
						setTiles(createTiles(restoredRound));
						setFoundWords(saved.foundWords);
						setScore(saved.score);
						setElapsedSeconds(saved.elapsedSeconds);
						setRemainingSeconds(saved.remainingSeconds);
						setHasClearedBaseline(Boolean(saved.hasClearedBaseline));
						setIsPaused(true);
						return;
					}
				}

				if (resolvedLang !== initialVocabLanguage) {
					const next = generateRound(difficulty, resolvedLang);
					setVocabLanguage(resolvedLang);
					setRound(next);
					setTiles(createTiles(next));
				}
			} catch {
				// Fallback to fresh round if error loading saved game
			} finally {
				setIsLoaded(true);
			}
		}
		init();
	}, [difficulty, mode, initialVocabLanguage]);

	// Auto-save active game state
	useEffect(() => {
		if (!isLoaded || isEnded) return;

		const snapshot: GameSnapshot = {
			rack: round.rack,
			words: round.words,
			fullLengthWords: round.fullLengthWords,
			difficulty,
			mode,
			language: vocabLanguage,
			foundWords,
			elapsedSeconds,
			remainingSeconds,
			score,
			hasClearedBaseline,
			isComplete: false,
			lastPlayed: Date.now(),
		};
		void saveActiveGame(snapshot);
	}, [
		isLoaded,
		isEnded,
		round,
		difficulty,
		mode,
		vocabLanguage,
		foundWords,
		elapsedSeconds,
		remainingSeconds,
		score,
		hasClearedBaseline,
	]);

	const recordRound = useCallback(
		(finalWords: readonly string[], finalScore: number, surrendered: boolean) => {
			if (stats.current.isRecorded || finalWords.length === 0) return;
			stats.current.isRecorded = true;

			const cleared = isRoundCleared(round, finalWords, mode);
			const mastered = isRoundMastered(round, finalWords);
			const foundFullRack = round.fullLengthWords.some((word) => finalWords.includes(word));
			const onlyShortWordsPlusRoot =
				foundFullRack &&
				finalWords.every((word) => Array.from(word).length === 3 || round.fullLengthWords.includes(word));
			const elapsed = elapsedRef.current;

			void (async () => {
				try {
					const activeState = await getGameMedalState('anagram');
					const prevLanguages = activeState.customStats.languagesPlayed ?? {};
					const languagesPlayed = cleared
						? {
								...prevLanguages,
								[vocabLanguage]: (prevLanguages[vocabLanguage] ?? 0) + 1,
							}
						: prevLanguages;
					const prevExpertLanguages = activeState.customStats.expertLanguagesWon ?? [];
					const expertLanguagesWon =
						cleared && difficulty === 'expert'
							? Array.from(new Set([...prevExpertLanguages, vocabLanguage]))
							: prevExpertLanguages;

					await recordGameResult({
						gameId: 'anagram',
						won: cleared,
						playTimeSeconds: elapsed,
						levelKey: difficulty,
						customData: {
							languagesPlayed,
							expertLanguagesWon,
						},
						roundContext: {
							wordsFound: finalWords.length,
							mode,
							language: vocabLanguage,
							secondsLeft: mode === 'timed' ? remainingSeconds : 0,
							foundFullRack,
							foundAnagramPair: hasAnagramPair(finalWords),
							mastered,
							shuffles: stats.current.shuffles,
							quickShuffleBurst: stats.current.quickShuffleBurst,
							invalidGuesses: stats.current.invalidGuesses,
							duplicateGuesses: stats.current.duplicateGuesses,
							usedCorrections: stats.current.usedCorrections,
							surrendered,
							secondsBeforeSurrender: surrendered ? elapsed : 0,
							pausedSeconds: stats.current.pausedSeconds,
							fullRackSecondsLeft: stats.current.fullRackSecondsLeft ?? -1,
							onlyShortWordsPlusRoot,
						},
					});
				} catch {
					// Ignore storage errors during medal recording
				}
			})();
			void recordRoundResult(difficulty, { cleared, mastered, score: finalScore, elapsedSeconds: elapsed });
		},
		[round, mode, difficulty, remainingSeconds, vocabLanguage],
	);

	const endRound = useCallback(
		(reason: RoundOutcome, finalWords: readonly string[], finalScore: number) => {
			if (isEnded) return;
			const cleared = isRoundCleared(round, finalWords, mode);
			setIsEnded(true);
			setOutcome(reason);
			void clearActiveGame();
			if (reason === 'revealed') setIsRevealed(true);
			if (reason === 'mastered' || (reason === 'timeUp' && cleared)) setDialog('victory');
			if (reason === 'timeUp' && !cleared) setDialog('defeat');
			recordRound(finalWords, finalScore, reason === 'revealed');
		},
		[isEnded, round, mode, recordRound],
	);

	useEffect(() => {
		if (!isLoaded || isEnded) return;
		const intervalId = setInterval(() => {
			if (isPaused) {
				stats.current.pausedSeconds += 1;
				return;
			}
			setElapsedSeconds((seconds) => seconds + 1);
			if (mode === 'timed') setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
		}, 1000);
		return () => clearInterval(intervalId);
	}, [isLoaded, isEnded, isPaused, mode]);

	useEffect(() => {
		if (mode === 'timed' && remainingSeconds <= 0 && !isEnded) endRound('timeUp', foundWords, score);
	}, [mode, remainingSeconds, isEnded, endRound, foundWords, score]);

	const isInteractive = !isEnded && !isPaused && dialog === null;

	const stageTile = useCallback(
		(id: number) => {
			if (!isInteractive) return;
			setStagedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
		},
		[isInteractive],
	);

	const recallTile = useCallback(
		(id: number) => {
			if (!isInteractive) return;
			setStagedIds((ids) => ids.filter((stagedId) => stagedId !== id));
		},
		[isInteractive],
	);

	const typeLetter = useCallback(
		(rawLetter: string) => {
			if (!isInteractive) return;
			const letter =
				vocabLanguage === 'pt' || vocabLanguage === 'fr' ? normalizeWord(rawLetter) : normalizeTile(rawLetter);
			const freeTile = tiles.find((tile) => tile.letter === letter && !stagedIds.includes(tile.id));
			if (freeTile) setStagedIds((ids) => [...ids, freeTile.id]);
		},
		[isInteractive, tiles, stagedIds, vocabLanguage],
	);

	const recallLast = useCallback(() => {
		if (!isInteractive) return;
		stats.current.usedCorrections = true;
		setStagedIds((ids) => ids.slice(0, -1));
	}, [isInteractive]);

	const clearStaged = useCallback(() => {
		if (!isInteractive) return;
		stats.current.usedCorrections = true;
		setStagedIds([]);
	}, [isInteractive]);

	const shuffle = useCallback(() => {
		if (!isInteractive) return;
		const now = Date.now();
		stats.current.shuffles += 1;
		stats.current.shuffleTimestamps = [...stats.current.shuffleTimestamps, now].slice(-QUICK_SHUFFLE_COUNT);
		const [oldest] = stats.current.shuffleTimestamps;
		if (
			stats.current.shuffleTimestamps.length === QUICK_SHUFFLE_COUNT &&
			oldest !== undefined &&
			now - oldest <= QUICK_SHUFFLE_WINDOW_MS
		) {
			stats.current.quickShuffleBurst = true;
		}
		setTiles((current) => shuffleRack(current));
	}, [isInteractive]);

	const submit = useCallback(() => {
		if (!isInteractive || stagedIds.length === 0) return;
		const word = stagedIds.map((id) => tiles.find((tile) => tile.id === id)?.letter ?? '').join('');
		const result = validateGuess(word, round, foundWords, difficulty);
		setStagedIds([]);

		if (result !== 'accepted') {
			const matched = getMatchingWords(word, round);
			if (result === 'duplicate') stats.current.duplicateGuesses += 1;
			else stats.current.invalidGuesses += 1;
			setFeedback({ kind: result, word: matched[0] ?? word });
			return;
		}

		const matchedWords = getMatchingWords(word, round);
		const displayWord = matchedWords[0] ?? word;
		const newlyFound = matchedWords.filter((candidate) => !foundWords.includes(candidate));
		const points = scoreWord(displayWord);
		const nextWords = [...foundWords, ...(newlyFound.length > 0 ? newlyFound : [word])];
		const nextScore = score + points;
		const newlyClearedBaseline = !hasClearedBaseline && isRoundCleared(round, nextWords, mode);

		setFoundWords(nextWords);
		setScore(nextScore);
		if (newlyClearedBaseline) setHasClearedBaseline(true);
		setFeedback({ kind: 'accepted', word: displayWord, points, clearedBaseline: newlyClearedBaseline });

		if (
			round.fullLengthWords.some((fullWord) => matchedWords.includes(fullWord) || fullWord === word) &&
			stats.current.fullRackSecondsLeft === null
		) {
			stats.current.fullRackSecondsLeft = mode === 'timed' ? remainingSeconds : 0;
		}
		if (mode === 'timed') setRemainingSeconds((seconds) => seconds + TIMED_MODE_BONUS_SECONDS_PER_WORD);

		if (isRoundMastered(round, nextWords)) {
			endRound('mastered', nextWords, nextScore);
		}
	}, [
		isInteractive,
		stagedIds,
		tiles,
		round,
		foundWords,
		difficulty,
		score,
		mode,
		remainingSeconds,
		hasClearedBaseline,
		endRound,
	]);

	const reveal = useCallback(() => {
		if (isEnded) return;
		endRound('revealed', foundWords, score);
	}, [isEnded, endRound, foundWords, score]);

	const newRound = useCallback(() => {
		if (!isEnded) recordRound(foundWords, score, false);
		void clearActiveGame();
		const next = generateRound(difficulty, vocabLanguage);
		stats.current = createStats();
		setRound(next);
		setTiles(createTiles(next));
		setStagedIds([]);
		setFoundWords([]);
		setScore(0);
		setFeedback(null);
		setElapsedSeconds(0);
		setRemainingSeconds(TIMED_MODE_INITIAL_SECONDS);
		setIsPaused(false);
		setIsEnded(false);
		setIsRevealed(false);
		setOutcome(null);
		setDialog(null);
		setHasClearedBaseline(false);
	}, [isEnded, recordRound, foundWords, score, difficulty, vocabLanguage]);

	const togglePause = useCallback(() => {
		if (!isEnded && dialog === null) setIsPaused((paused) => !paused);
	}, [isEnded, dialog]);

	const closeDialog = useCallback(() => setDialog(null), []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Backspace') {
				event.preventDefault();
				if (isInteractive) {
					recallLast();
				}
				return;
			}

			if (event.ctrlKey || event.metaKey || event.altKey || !isInteractive) return;
			const isButtonTarget = event.target instanceof HTMLButtonElement;

			if (event.key === 'Enter') {
				if (isButtonTarget) return;
				event.preventDefault();
				submit();
			} else if (event.key === 'Escape') {
				event.preventDefault();
				clearStaged();
			} else if (event.key === ' ') {
				event.preventDefault();
				shuffle();
			} else if (LETTER_KEY_PATTERN.test(event.key)) {
				typeLetter(event.key);
			}
		};
		window.addEventListener('keydown', handleKeyDown, { capture: true });
		return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
	}, [isInteractive, submit, recallLast, clearStaged, shuffle, typeLetter]);

	const minWordLength = DIFFICULTY_CONFIGS[difficulty].minWordLength;

	return {
		round,
		tiles,
		stagedIds,
		foundWords,
		score,
		feedback,
		elapsedSeconds,
		remainingSeconds,
		isPaused,
		isEnded,
		isRevealed,
		outcome,
		dialog,
		hasClearedBaseline,
		isInteractive,
		vocabLanguage,
		minWordLength,
		isMastered: isRoundMastered(round, foundWords),
		stageTile,
		recallTile,
		clearStaged,
		shuffle,
		submit,
		reveal,
		newRound,
		togglePause,
		closeDialog,
	};
}
