export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'zen' | 'timed';
export type LanguageCode = 'en' | 'de' | 'pt';

export const SUPPORTED_VOCAB_LANGUAGES: readonly LanguageCode[] = ['en', 'de', 'pt'];

export interface DifficultyConfig {
	rackSize: number;
	minWordLength: number;
	targetWordCount: { min: number; max: number };
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
	easy: { rackSize: 5, minWordLength: 3, targetWordCount: { min: 6, max: 12 } },
	medium: { rackSize: 6, minWordLength: 3, targetWordCount: { min: 15, max: 25 } },
	hard: { rackSize: 7, minWordLength: 3, targetWordCount: { min: 30, max: 50 } },
	expert: { rackSize: 8, minWordLength: 4, targetWordCount: { min: 15, max: 25 } },
};

export const TIMED_MODE_INITIAL_SECONDS = 150;
export const TIMED_MODE_BONUS_SECONDS_PER_WORD = 5;

/** Schema of `lexicon.data.<language>.json`: a flat list of lowercase words and optional normalized signature map. */
export interface LexiconFile {
	words: string[];
	normalized?: Record<string, string[]>;
}

export interface AnagramData {
	/** Lowercase rack tiles; each tile is one user-perceived character (e.g. `ß`, `ä`). */
	rack: string[];
	/** All solvable words for this rack, sorted alphabetically. */
	words: string[];
	/** Solvable words that use every rack tile. */
	fullLengthWords: string[];
}

export interface GameSnapshot {
	rack: string[];
	words: string[];
	fullLengthWords: string[];
	difficulty: DifficultyLevel;
	mode: GameMode;
	language: LanguageCode;
	foundWords: string[];
	elapsedSeconds: number;
	remainingSeconds: number;
	score: number;
	hasClearedBaseline?: boolean;
	isComplete?: boolean;
	lastPlayed?: number;
}

export interface AnagramSettings {
	vocabLanguage?: LanguageCode;
}

export interface LevelProgress {
	completed: boolean;
	mastered: boolean;
	bestScore?: number;
	bestTimeSeconds?: number;
}

export type ProgressMap = Partial<Record<DifficultyLevel, LevelProgress>>;
