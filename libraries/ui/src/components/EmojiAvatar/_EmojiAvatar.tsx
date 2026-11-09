import * as S from './_EmojiAvatar.styles';
import type { EmojiAvatarProps } from './_EmojiAvatar.types';

/**
 * EmojiAvatar displays a player's avatar emoji glyph inside a circular badge.
 */
export function EmojiAvatar({
	value,
	size = 'md',
	className,
	'aria-hidden': ariaHidden,
	'aria-label': ariaLabel,
}: EmojiAvatarProps) {
	const emoji = typeof value === 'string' ? value : value?.value || '👾';
	const isHidden = ariaHidden ?? (ariaLabel ? undefined : true);

	return (
		<S.EmojiAvatar
			data-size={size}
			className={className}
			aria-hidden={isHidden}
			aria-label={ariaLabel}
			role={ariaLabel ? 'img' : undefined}
		>
			<span>{emoji}</span>
		</S.EmojiAvatar>
	);
}
