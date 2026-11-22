import { ALL_GAMES } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { Button } from '@arcade/lib-ui/components/Button';
import { ClickableCard } from '@arcade/lib-ui/components/ClickableCard';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Text } from '@arcade/lib-ui/components/Text';
import { useFavorites } from '@arcade/lib-user';
import { useEffect, useMemo, useState } from 'react';
import * as S from './FavoritesSection.styles';
import type { FavoritesSectionProps } from './FavoritesSection.types';

const FAVORITES_STRIP_ID = 'hub-favorites-strip';

function FavoritesSectionContent({ lang, className }: FavoritesSectionProps) {
	const { t } = useI18n('common');
	const { favorites, isHydrated, toggleFavorite } = useFavorites();
	const [isEditing, setIsEditing] = useState(false);

	const favoriteGames = useMemo(() => {
		if (!isHydrated || favorites.length === 0) {
			return [];
		}
		return ALL_GAMES.filter((game) => favorites.includes(game.id));
	}, [favorites, isHydrated]);

	useEffect(() => {
		if (favoriteGames.length === 0 && isEditing) {
			setIsEditing(false);
		}
	}, [favoriteGames.length, isEditing]);

	// Guard rendering: only display post-hydration when favorites.length > 0
	// Do not reserve blank space or render empty DOM wrappers during SSR
	if (!isHydrated || favoriteGames.length === 0) {
		return null;
	}

	return (
		<section
			className={`${S.FavoritesSectionRoot}${className ? ` ${className}` : ''}`}
			aria-labelledby="favorites-section-heading"
		>
			<div className={S.FavoritesHeader}>
				<Text as="h2" variant="h2" id="favorites-section-heading">
					{t('favorites.title')}
				</Text>
				<Button
					variant="ghost"
					size="sm"
					type="button"
					aria-pressed={isEditing}
					onClick={() => setIsEditing((prev) => !prev)}
				>
					{isEditing ? t('favorites.done') : t('favorites.edit')}
				</Button>
			</div>
			<div id={FAVORITES_STRIP_ID} className={S.QuickLaunchStrip} aria-live="polite">
				{favoriteGames.map((game) => {
					const gameTitle = getGameTitle(game.id, lang);
					const removeLabel = t('favorites.action_remove', { game: gameTitle }).replace(
						/\{game\}/g,
						gameTitle,
					);

					return (
						<div key={game.id} className={S.QuickLaunchItemWrapper}>
							<ClickableCard
								as="a"
								href={`${game.route}/${lang}/`}
								density="compact"
								aria-label={gameTitle}
								title={gameTitle}
								className={S.QuickLaunchItem}
							>
								<span className={S.QuickLaunchIcon} aria-hidden="true">
									{game.assets.icon}
								</span>
							</ClickableCard>
							{isEditing && (
								<Button
									variant="ghost"
									size="sm"
									isIconOnly
									isRound
									type="button"
									aria-label={removeLabel}
									title={removeLabel}
									onClick={() => void toggleFavorite(game.id)}
									leadingIcon={<Icon text="×" size="sm" />}
								/>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}

export function FavoritesSection({ lang, className }: FavoritesSectionProps) {
	return (
		<I18nProvider language={lang}>
			<FavoritesSectionContent lang={lang} className={className} />
		</I18nProvider>
	);
}
