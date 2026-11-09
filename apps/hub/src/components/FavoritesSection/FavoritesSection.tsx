import { ALL_GAMES } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getGameDescription, getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { getCategoryLabel } from '@arcade/lib-i18n/utils/taxonomy';
import { GameCard } from '@arcade/lib-ui/components/GameCard';
import { GamesGrid } from '@arcade/lib-ui/components/GamesGrid';
import { Text } from '@arcade/lib-ui/components/Text';
import { useFavorites } from '@arcade/lib-user';
import { useMemo } from 'react';
import * as S from './FavoritesSection.styles';
import type { FavoritesSectionProps } from './FavoritesSection.types';

const FAVORITES_GRID_ID = 'hub-favorites-grid';

function FavoritesSectionContent({ lang, className }: FavoritesSectionProps) {
	const { t } = useI18n('common');
	const { favorites, isHydrated } = useFavorites();

	const favoriteGames = useMemo(() => {
		if (!isHydrated || favorites.length === 0) {
			return [];
		}
		return ALL_GAMES.filter((game) => favorites.includes(game.id));
	}, [favorites, isHydrated]);

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
			<Text as="h2" variant="h2" id="favorites-section-heading">
				{t('favorites.title')}
			</Text>
			<GamesGrid id={FAVORITES_GRID_ID} aria-live="polite">
				{favoriteGames.map((game) => (
					<GameCard
						key={game.id}
						gameId={game.id}
						href={`${game.route}/${lang}/`}
						title={getGameTitle(game.id, lang)}
						description={getGameDescription(game.id, lang)}
						icon={game.assets.icon}
						badge={getCategoryLabel(game.category.primary, lang)}
					/>
				))}
			</GamesGrid>
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
