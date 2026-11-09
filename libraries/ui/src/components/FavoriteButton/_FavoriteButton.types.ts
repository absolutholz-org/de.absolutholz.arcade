export type FavoriteButtonSize = 'sm' | 'md';

export interface FavoriteButtonProps {
	/** Unique game identifier */
	gameId: string;
	/** Human-readable title of the game for accessibility announcements */
	gameTitle: string;
	/** Button sizing variant (default: 'md') */
	size?: FavoriteButtonSize;
	/** Optional class name */
	className?: string;
}
