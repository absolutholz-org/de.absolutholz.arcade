import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { GameId, GameStats } from '@arcade/lib-storage';

export type SupportedLanguage = SupportedLanguageCode | string;

export interface GameStatsDashboardProps {
	/** Canonical identifier for the game */
	readonly gameId: GameId;
	/** Current interface language */
	readonly lang: SupportedLanguage;
	/** Optional pre-loaded stats object; falls back to loading via `getGameStats(gameId)` */
	readonly stats?: GameStats;
	/** Optional human-readable labels for bucket keys (e.g. { easy: 'Easy', hard: 'Hard' }) */
	readonly bucketLabels?: Record<string, string>;
	/** Optional URL target for the empty-state 'Play Now' button (defaults to `/${lang}/game`) */
	readonly playHref?: string;
	/** Whether to hide the redundant title header (e.g. when rendered within a page hero) */
	readonly hideTitle?: boolean;
	/** Whether to display the Top 10 Fastest Games list when recorded runs exist */
	readonly showFastestRuns?: boolean;
	/** Whether to display the Top 10 High Scores list when recorded scores exist */
	readonly showTopScores?: boolean;
	/** Whether to display the Top 10 Fewest Moves / Guesses list when recorded runs exist */
	readonly showFewestMoves?: boolean;
	/** Label variant for move-based metrics and leaderboard headings ('moves' | 'guesses') */
	readonly fewestMovesVariant?: 'moves' | 'guesses';
	/** Whether to hide win-rate and streak cards (for puzzle games without a defeat state) */
	readonly hideWinLossMetrics?: boolean;
	/** Display mode for primary KPI cards ('standard' | 'match-draw' for pass-and-play games like Tic-Tac-Toe) */
	readonly displayMode?: 'standard' | 'match-draw';
	/** Optional CSS class name */
	readonly className?: string;
}
