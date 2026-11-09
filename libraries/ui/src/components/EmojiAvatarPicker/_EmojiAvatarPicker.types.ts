import type { PlayerAvatar } from '@arcade/lib-user';
import type { PopoverAlign } from '../Popover/_Popover.types';

export interface EmojiAvatarPickerProps {
	/**
	 * Currently selected player avatar or raw emoji string.
	 */
	readonly value: PlayerAvatar | string;

	/**
	 * Callback dispatched when an avatar emoji is selected or submitted.
	 */
	readonly onChange: (avatar: PlayerAvatar) => void;

	/**
	 * Whether the avatar picker trigger button is disabled.
	 */
	readonly disabled?: boolean;

	/**
	 * Accessible label for the trigger button.
	 */
	readonly ariaLabel?: string;

	/**
	 * Preferred popover alignment relative to trigger button.
	 */
	readonly align?: PopoverAlign;

	/**
	 * Optional CSS class name.
	 */
	readonly className?: string;

	/**
	 * Optional custom element ID.
	 */
	readonly id?: string;
}
