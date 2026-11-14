import { ALL_GAMES } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { ClickableCard } from '@arcade/lib-ui/components/ClickableCard';
import { Text } from '@arcade/lib-ui/components/Text';
import { useFavorites } from '@arcade/lib-user';
import { useMemo } from 'react';
import * as S from './FavoritesSection.styles';
import type { FavoritesSectionProps } from './FavoritesSection.types';

const FAVORITES_STRIP_ID = 'hub-favorites-strip';

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
			<div id={FAVORITES_STRIP_ID} className={S.QuickLaunchStrip} aria-live="polite">
				{favoriteGames.map((game) => (
					<ClickableCard
						key={game.id}
						as="a"
						href={`${game.route}/${lang}/`}
						density="compact"
						className={S.QuickLaunchItem}
					>
						<span className={S.QuickLaunchIcon} aria-hidden="true">
							{game.assets.icon}
						</span>
						<span className={S.QuickLaunchTitle}>{getGameTitle(game.id, lang)}</span>
					</ClickableCard>
				))}
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
