import type { PlayerAvatar } from '@arcade/lib-user';
import type { EMOJI_AVATAR_SIZES } from './_EmojiAvatar.constants';

export type EmojiAvatarSize = (typeof EMOJI_AVATAR_SIZES)[number];

export interface EmojiAvatarProps {
	/**
	 * Player avatar instance or raw emoji character string.
	 */
	readonly value: PlayerAvatar | string;

	/**
	 * Visual size variant.
	 */
	readonly size?: EmojiAvatarSize;

	/**
	 * Optional CSS class name.
	 */
	readonly className?: string;

	/**
	 * Whether the emoji avatar is hidden from the accessibility tree.
	 */
	readonly 'aria-hidden'?: boolean;

	/**
	 * Accessible label when rendered as an informative standalone graphic.
	 */
	readonly 'aria-label'?: string;
}
