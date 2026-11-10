import type { SpacingKey } from '../../styles/spacing';
import type { ButtonSize, ButtonVariant } from '../Button';
import type { StackJustify } from '../Stack/_Stack.types';

export interface GameActionBarProps {
	/**
	 * Unique identifier for the game. When provided, automatically integrates
	 * with offline storage and user favorite systems unless overridden by state/callback props.
	 */
	gameId?: string;
	/**
	 * Display title of the game for accessible labels and share metadata.
	 */
	gameTitle?: string;
	/**
	 * State indicating whether the game is favorited.
	 * When provided, directly controls the favorite button toggle state.
	 */
	isFavorited?: boolean;
	/**
	 * Callback triggered when the favorite button is clicked.
	 */
	onToggleFavorite?: () => void | Promise<void>;
	/**
	 * State indicating whether the game is saved offline.
	 * When true, shows clear visual feedback reflecting cached offline state.
	 */
	isSavedOffline?: boolean;
	/**
	 * Callback triggered when the Save Offline button is clicked.
	 */
	onSaveOffline?: () => void | Promise<void>;
	/**
	 * Callback triggered when the Share Game button is clicked.
	 * If omitted, invokes navigator.share when available, falling back to ShareDialog.
	 */
	onShare?: () => void | Promise<void>;
	/**
	 * Canonical URL to share. If omitted, derives from gameId or current browser URL.
	 */
	shareUrl?: string;
	/**
	 * Custom text or tagline for the share payload.
	 */
	shareText?: string;
	/**
	 * Accessible label for the favorite button.
	 * @default 'Favorite game'
	 */
	favoriteAriaLabel?: string;
	/**
	 * Custom text for the favorite button label.
	 * Defaults to localized "Favorite" (or "Favorited" when pressed).
	 */
	favoriteLabel?: string;
	/**
	 * Custom text for the favorite button label when active/favorited.
	 * If omitted, defaults to favoriteLabel or localized "Favorited".
	 */
	favoritedLabel?: string;
	/**
	 * Custom text for the Save Offline button.
	 * Defaults to localized "Save Offline".
	 */
	saveOfflineLabel?: string;
	/**
	 * Custom text for the Share Game button.
	 * Defaults to localized "Share Game".
	 */
	shareLabel?: string;
	/**
	 * Visual variant for action buttons in the bar.
	 * @default 'outline'
	 */
	variant?: ButtonVariant;
	/**
	 * Horizontal alignment/justification of action buttons inside the Stack.
	 * @default 'start'
	 */
	justify?: StackJustify;
	/**
	 * Theme spacing token between controls.
	 * @default 'sm'
	 */
	spacing?: SpacingKey;
	/**
	 * Sizing preset dictating padding, font size, and touch target dimensions.
	 * @default 'sm'
	 */
	size?: ButtonSize;
	/**
	 * Additional CSS class name.
	 */
	className?: string;
}
