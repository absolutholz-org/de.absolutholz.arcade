import { ALL_GAMES, GAME_CATEGORIES, type GameCategory, isGameCategory } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getGameDescription, getGameTitle } from '@arcade/lib-i18n/utils/gameTitle';
import { getCategoryLabel } from '@arcade/lib-i18n/utils/taxonomy';
import { GameCard } from '@arcade/lib-ui/components/GameCard';
import { GameSegmentedControl, type GameSegmentedOption } from '@arcade/lib-ui/components/GameSegmentedControl';
import { GamesGrid } from '@arcade/lib-ui/components/GamesGrid';
import { Text } from '@arcade/lib-ui/components/Text';
import { useMemo, useState } from 'react';
import * as S from './HubGamesCatalog.styles';
import type { HubGamesCatalogProps } from './HubGamesCatalog.types';

const GAMES_GRID_ID = 'hub-games-grid';

type CategoryFilterValue = 'all' | GameCategory;

function HubGamesCatalogContent({ lang }: HubGamesCatalogProps) {
	const { t } = useI18n('common');
	const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('all');

	const categoryOptions = useMemo<readonly GameSegmentedOption[]>(() => {
		const counts = new Map<GameCategory, number>();
		for (const game of ALL_GAMES) {
			const primary = game.category.primary;
			counts.set(primary, (counts.get(primary) ?? 0) + 1);
		}

		const activeTabs: GameSegmentedOption[] = [];
		for (const category of GAME_CATEGORIES) {
			const count = counts.get(category) ?? 0;
			if (count > 0) {
				const label = getCategoryLabel(category, lang);
				activeTabs.push({
					id: category,
					label: `${label} (${count})`,
				});
			}
		}

		return [
			{
				id: 'all',
				label: `${t('hub.allCategories')} (${ALL_GAMES.length})`,
			},
			...activeTabs,
		];
	}, [lang, t]);

	const visibleGames = useMemo(
		() =>
			selectedCategory === 'all'
				? ALL_GAMES
				: ALL_GAMES.filter((game) => game.category.primary === selectedCategory),
		[selectedCategory],
	);

	const handleSelectCategory = (id: string) => {
		if (id === 'all' || isGameCategory(id)) {
			setSelectedCategory(id);
		}
	};

	return (
		<>
			<div className={S.FilterBarWrapper}>
				<GameSegmentedControl
					options={categoryOptions}
					selectedId={selectedCategory}
					onSelect={handleSelectCategory}
					ariaLabel={t('hub.categoryFilterAriaLabel')}
					panelId={GAMES_GRID_ID}
				/>
			</div>
			<GamesGrid id={GAMES_GRID_ID} aria-live="polite">
				{visibleGames.length === 0 ? (
					<div className={S.EmptyState}>
						<Text as="p" variant="base">
							{t('hub.emptyCategoryMessage')}
						</Text>
					</div>
				) : (
					visibleGames.map((game) => (
						<GameCard
							key={game.id}
							href={`${game.route}/${lang}/`}
							title={getGameTitle(game.id, lang)}
							description={getGameDescription(game.id, lang)}
							icon={game.assets.icon}
							badge={getCategoryLabel(game.category.primary, lang)}
						/>
					))
				)}
			</GamesGrid>
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
