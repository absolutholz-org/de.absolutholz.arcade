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
	/** Optional CSS class name */
	readonly className?: string;
}
