import { ALL_GAMES, type GameMetadata } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getGameDescription, getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { getCategoryLabel, getPlayModeLabel, getPlayersLabel } from '@arcade/lib-i18n/utils/taxonomy';
import { GameCard } from '@arcade/lib-ui/components/GameCard';
import { GamesGrid } from '@arcade/lib-ui/components/GamesGrid';
import { Text } from '@arcade/lib-ui/components/Text';
import { useMemo } from 'react';
import * as S from './HubGamesCatalog.styles';
import type { HubGamesCatalogProps } from './HubGamesCatalog.types';

function renderGameCard(game: GameMetadata, lang: HubGamesCatalogProps['lang']) {
	const isMultiplayer = game.mode === 'multiplayer' || game.mode === 'both';
	const playersLabel = getPlayersLabel(game.players, lang);
	const modeLabel = getPlayModeLabel(game.mode, lang);
	const modeChipText = playersLabel ? `👥 ${playersLabel}` : `👥 ${modeLabel}`;

	return (
		<GameCard
			key={game.id}
			gameId={game.id}
			href={`${game.route}/${lang}/`}
			title={getGameTitle(game.id, lang)}
			description={getGameDescription(game.id, lang)}
			icon={game.assets.icon}
			badge={getCategoryLabel(game.category.primary, lang)}
			modeBadge={isMultiplayer ? { label: modeChipText, variant: 'accent' } : undefined}
		/>
	);
}

function HubGamesCatalogContent({ lang }: HubGamesCatalogProps) {
	const { t } = useI18n('common');

	const singlePlayerGames = useMemo(
		() => ALL_GAMES.filter((game) => game.mode === 'singleplayer' || game.mode === 'both'),
		[],
	);

	const multiplayerGames = useMemo(
		() => ALL_GAMES.filter((game) => game.mode === 'multiplayer' || game.mode === 'both'),
		[],
	);

	return (
		<>
			<section className={S.Section} aria-labelledby="hub-singleplayer-games-heading">
				<div className={S.SectionTitle}>
					<Text as="h2" variant="h2" id="hub-singleplayer-games-heading">
						{t('hub.singlePlayerTitle')}
					</Text>
				</div>
				<GamesGrid id="hub-singleplayer-grid" aria-live="polite">
					{singlePlayerGames.length === 0 ? (
						<div className={S.EmptyState}>
							<Text as="p" variant="base">
								{t('hub.emptyCategoryMessage')}
							</Text>
						</div>
					) : (
						singlePlayerGames.map((game) => renderGameCard(game, lang))
					)}
				</GamesGrid>
			</section>

			<section className={S.Section} aria-labelledby="hub-multiplayer-games-heading">
				<div className={S.SectionTitle}>
					<Text as="h2" variant="h2" id="hub-multiplayer-games-heading">
						{t('hub.multiplayerTitle')}
					</Text>
				</div>
				<GamesGrid id="hub-multiplayer-grid" aria-live="polite">
					{multiplayerGames.length === 0 ? (
						<div className={S.EmptyState}>
							<Text as="p" variant="base">
								{t('hub.emptyCategoryMessage')}
							</Text>
						</div>
					) : (
						multiplayerGames.map((game) => renderGameCard(game, lang))
					)}
				</GamesGrid>
			</section>
		</>
	);
}

export function HubGamesCatalog({ lang }: HubGamesCatalogProps) {
	return (
		<I18nProvider language={lang}>
			<HubGamesCatalogContent lang={lang} />
		</I18nProvider>
	);
}
