import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useFavorites } from '@arcade/lib-user';
import type { MouseEvent } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import * as S from './_FavoriteButton.styles';
import type { FavoriteButtonProps } from './_FavoriteButton.types';

/**
 * Accessible button toggle for bookmarking / unbookmarking favorite games.
 * Directly reuses and extends the design system Button primitive (ghost variant, icon-only, round shape).
 */
export function FavoriteButton({ gameId, gameTitle, size = 'md', className }: FavoriteButtonProps) {
	const { t } = useI18n('common');
	const { isFavorite, toggleFavorite } = useFavorites();
	const active = isFavorite(gameId);

	const rawLabel = active
		? t('favorites.action_remove', { game: gameTitle })
		: t('favorites.action_add', { game: gameTitle });

	// Ensure any un-interpolated single-brace token {game} is safely resolved
	const label = rawLabel.replace(/\{game\}/g, gameTitle);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		void toggleFavorite(gameId);
	};

	const iconSize = size === 'sm' ? 'sm' : 'md';

	return (
		<Button
			variant="ghost"
			size={size}
			isIconOnly
			isRound
			type="button"
			aria-pressed={active}
			aria-label={label}
			title={label}
			onClick={handleClick}
			className={`${S.FavoriteButtonClass}${className ? ` ${className}` : ''}`}
			leadingIcon={<Icon name={active ? 'heart-filled' : 'heart'} size={iconSize} />}
		/>
	);
}
