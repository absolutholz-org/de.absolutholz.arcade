import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import {
	type AchievementType,
	type GameId,
	type MedalProgress,
	type MedalTier,
	getGameMedalState,
	subscribeToMedalUnlocked,
} from '@arcade/lib-medals';
import { MedalCard, SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui';
import { useCallback, useEffect, useState } from 'react';
import { getHubMedalDefinitionsForGame } from '../../config/medals';
import * as S from './MedalsShowcase.styles';

const REGISTERED_GAMES: readonly GameId[] = [
	'sudoku',
	'nonogram',
	'minesweeper',
	'queens',
	'tracks',
	'bridges',
	'tents',
	'anagram',
	'watersort',
];

interface MedalShowcaseItem {
	readonly id: string;
	readonly gameId: GameId;
	readonly type: AchievementType;
	readonly tier: MedalTier;
	readonly title: string;
	readonly description: string;
	readonly icon: string;
	readonly thresholds?: {
		readonly bronze: number;
		readonly silver: number;
		readonly gold: number;
	};
	readonly isUnlocked: boolean;
	readonly unlockedAt?: number;
	readonly progress?: MedalProgress;
	readonly bronzeUnlocked?: boolean;
	readonly silverUnlocked?: boolean;
	readonly goldUnlocked?: boolean;
}

const normalizeGameParam = (param: string | null): string => {
	if (!param) return 'all';
	const lower = param.toLowerCase().trim();
	if (lower === 'all' || REGISTERED_GAMES.includes(lower as GameId)) {
		return lower;
	}
	return 'all';
};

function MedalsShowcaseContent({ lang }: { lang: SupportedLanguageCode }) {
	const { t } = useI18n('medals');
	const [activeGameFilter, setActiveGameFilter] = useState<string>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			return normalizeGameParam(params.get('game'));
		}
		return 'all';
	});
	const [items, setItems] = useState<MedalShowcaseItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Synchronize filter when navigating or on popstate
	useEffect(() => {
		const updateFromUrl = () => {
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				setActiveGameFilter(normalizeGameParam(params.get('game')));
			}
		};

		updateFromUrl();
		window.addEventListener('popstate', updateFromUrl);
		return () => window.removeEventListener('popstate', updateFromUrl);
	}, []);

	// Handle filter change and update URL
	const handleFilterChange = (filter: string) => {
		const normalized = normalizeGameParam(filter);
		setActiveGameFilter(normalized);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			if (normalized === 'all') {
				url.searchParams.delete('game');
			} else {
				url.searchParams.set('game', normalized);
			}
			window.history.replaceState({}, '', url.toString());
		}
	};

	// Hydrate medals state from all registered games
	const hydrateAllMedals = useCallback(async () => {
		const allItems: MedalShowcaseItem[] = [];

		for (const gameId of REGISTERED_GAMES) {
			try {
				const state = await getGameMedalState(gameId);
				const definitions = getHubMedalDefinitionsForGame(gameId);

				for (const def of definitions) {
					const unlock = state.unlockedMedals[def.id];
					const isUnlocked = Boolean(unlock);
					const progress = state.medalProgress[def.id];
					const isLadder = def.type === 'ladder';

					let bronzeUnlocked = false;
					let silverUnlocked = false;
					let goldUnlocked = false;

					if (isLadder) {
						bronzeUnlocked = Boolean(
							progress?.bronzeUnlocked ||
								unlock?.tier === 'bronze' ||
								unlock?.tier === 'silver' ||
								unlock?.tier === 'gold',
						);
						silverUnlocked = Boolean(
							progress?.silverUnlocked || unlock?.tier === 'silver' || unlock?.tier === 'gold',
						);
						goldUnlocked = Boolean(progress?.goldUnlocked || unlock?.tier === 'gold');
					}

					allItems.push({
						id: def.id,
						gameId,
						type: def.type ?? 'standalone',
						tier: def.tier,
						title: t(def.titleKey as TranslationKey),
						description: t(def.descriptionKey as TranslationKey),
						icon: def.icon,
						thresholds: def.thresholds,
						isUnlocked,
						unlockedAt: unlock?.unlockedAt,
						progress,
						bronzeUnlocked,
						silverUnlocked,
						goldUnlocked,
					});
				}
			} catch (error) {
				console.error(`Failed to hydrate ${gameId} medals:`, error);
			}
		}

		setItems(allItems);
		setIsLoading(false);
	}, [t]);

	useEffect(() => {
		let isMounted = true;
		hydrateAllMedals();

		const unsubscribe = subscribeToMedalUnlocked(() => {
			if (isMounted) {
				hydrateAllMedals();
			}
		});

		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, [hydrateAllMedals]);

	// Filter items by selected game
	const visibleItems = items.filter((item) => activeGameFilter === 'all' || item.gameId === activeGameFilter);

	// Calculate trophy totals for active scope (filtered game or all games)
	const summaryItems = activeGameFilter === 'all' ? items : visibleItems;
	const goldCount = summaryItems.filter(
		(i) => i.goldUnlocked || (i.type === 'standalone' && i.isUnlocked && i.tier === 'gold'),
	).length;
	const silverCount = summaryItems.filter(
		(i) => i.silverUnlocked || (i.type === 'standalone' && i.isUnlocked && i.tier === 'silver'),
	).length;
	const bronzeCount = summaryItems.filter(
		(i) => i.bronzeUnlocked || (i.type === 'standalone' && i.isUnlocked && i.tier === 'bronze'),
	).length;
	const unlockedCount = summaryItems.filter(
		(i) => i.isUnlocked || i.bronzeUnlocked || i.silverUnlocked || i.goldUnlocked,
	).length;
	const totalTrophies = summaryItems.length;

	return (
		<div className={S.ShowcaseContainer}>
			{/* Trophy Summary Header */}
			<section className={S.TrophyBar} aria-label={t('medals.showcase.trophiesSummary')}>
				<div className={S.TrophyCard}>
					<span className={S.TrophyCount}>
						{unlockedCount} / {totalTrophies}
					</span>
					<span className={S.TrophyLabel}>{t('medals.showcase.trophiesSummary')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="gold">
					<span className={S.TrophyCount}>{goldCount}</span>
					<span className={S.TrophyLabel}>{t('medals.showcase.tiers.gold')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="silver">
					<span className={S.TrophyCount}>{silverCount}</span>
					<span className={S.TrophyLabel}>{t('medals.showcase.tiers.silver')}</span>
				</div>
				<div className={S.TrophyCard} data-tier="bronze">
					<span className={S.TrophyCount}>{bronzeCount}</span>
					<span className={S.TrophyLabel}>{t('medals.showcase.tiers.bronze')}</span>
				</div>
			</section>

			{/* Game Filter Navigation */}
			<SegmentedControl
				items={[
					{ id: 'all', label: t('medals.showcase.allGames') },
					...REGISTERED_GAMES.map((gameId) => ({
						id: gameId,
						label: t(`medals.showcase.games.${gameId}` as TranslationKey),
					})),
				]}
				value={activeGameFilter}
				onChange={handleFilterChange}
				ariaLabel={t('medals.showcase.allGames')}
			/>

			{/* Medals Grid consuming design system MedalCard */}
			<div className={S.MedalsGrid}>
				{visibleItems.length === 0 && !isLoading && (
					<div className={S.EmptyState}>{t('medals.showcase.empty')}</div>
				)}

				{visibleItems.map((item) => {
					const isProgressive = item.type === 'ladder';
					const progress = item.progress;
					const gameBadge = t(`medals.showcase.games.${item.gameId}` as TranslationKey);

					if (isProgressive) {
						const bronzeUnlocked = Boolean(item.bronzeUnlocked);
						const silverUnlocked = Boolean(item.silverUnlocked);
						const goldUnlocked = Boolean(item.goldUnlocked);
						const nextTier: MedalTier | undefined = !bronzeUnlocked
							? 'bronze'
							: !silverUnlocked
								? 'silver'
								: !goldUnlocked
									? 'gold'
									: undefined;

						const current = progress?.currentProgress ?? progress?.current ?? 0;
						const target =
							progress?.nextThreshold ??
							(nextTier === 'bronze'
								? (item.thresholds?.bronze ?? 3)
								: nextTier === 'silver'
									? (item.thresholds?.silver ?? 5)
									: (item.thresholds?.gold ?? 10));

						return (
							<MedalCard
								key={item.id}
								mode="progressive"
								gameBadge={gameBadge}
								title={item.title}
								description={item.description}
								bronzeUnlocked={bronzeUnlocked}
								silverUnlocked={silverUnlocked}
								goldUnlocked={goldUnlocked}
								unlockedAt={item.unlockedAt}
								unlockedDateText={
									item.unlockedAt
										? t('medals.showcase.status.unlockedOn', {
												date: new Date(item.unlockedAt).toLocaleDateString(lang),
											})
										: undefined
								}
								progressiveProgress={{
									current,
									target,
									nextTier,
								}}
								lockedText={t('medals.showcase.status.locked')}
							/>
						);
					}

					return (
						<MedalCard
							key={item.id}
							mode="standalone"
							tier={item.tier}
							gameBadge={gameBadge}
							title={item.title}
							description={item.description}
							unlocked={item.isUnlocked}
							unlockedAt={item.unlockedAt}
							unlockedDateText={
								item.unlockedAt
									? t('medals.showcase.status.unlockedOn', {
											date: new Date(item.unlockedAt).toLocaleDateString(lang),
										})
									: undefined
							}
							progress={
								progress && progress.target > 0
									? { current: progress.current, target: progress.target }
									: undefined
							}
							tierLabel={t(`medals.showcase.tiers.${item.tier}` as TranslationKey)}
							lockedText={t('medals.showcase.status.locked')}
						/>
					);
				})}
			</div>
		</div>
	);
}

export function MedalsShowcase({ lang }: { lang: SupportedLanguageCode }) {
	return (
		<I18nProvider language={lang}>
			<MedalsShowcaseContent lang={lang} />
		</I18nProvider>
	);
}
