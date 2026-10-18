import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import {
	type AchievementDefinition,
	type GameId,
	type GameMedalState,
	type MedalTier,
	getGameMedalState,
	getMedalDefinitionsForGame,
} from '@arcade/lib-medals';
import { Icon } from '@arcade/lib-ui';
import { useEffect, useState } from 'react';
import * as S from './MedalsShowcase.styles';

const REGISTERED_GAMES: readonly GameId[] = ['sudoku', 'nonogram', 'minesweeper', 'queens', 'tracks'];

interface MedalShowcaseItem {
	readonly id: string;
	readonly gameId: GameId;
	readonly tier: MedalTier;
	readonly title: string;
	readonly description: string;
	readonly icon: string;
	readonly isUnlocked: boolean;
	readonly unlockedAt?: number;
	readonly progress?: { current: number; target: number };
}

function MedalsShowcaseContent({ lang }: { lang: SupportedLanguageCode }) {
	const { t } = useI18n('medals');
	const [activeGameFilter, setActiveGameFilter] = useState<string>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const gameParam = params.get('game');
			if (gameParam && (gameParam === 'all' || REGISTERED_GAMES.includes(gameParam as GameId))) {
				return gameParam;
			}
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
				const gameParam = params.get('game');
				if (gameParam && (gameParam === 'all' || REGISTERED_GAMES.includes(gameParam as GameId))) {
					setActiveGameFilter(gameParam);
				} else if (!gameParam) {
					setActiveGameFilter('all');
				}
			}
		};

		updateFromUrl();
		window.addEventListener('popstate', updateFromUrl);
		return () => window.removeEventListener('popstate', updateFromUrl);
	}, []);

	// Handle filter change and update URL
	const handleFilterChange = (filter: string) => {
		setActiveGameFilter(filter);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			if (filter === 'all') {
				url.searchParams.delete('game');
			} else {
				url.searchParams.set('game', filter);
			}
			window.history.replaceState({}, '', url.toString());
		}
	};

	// Hydrate medals state from all registered games
	useEffect(() => {
		let isMounted = true;

		async function loadAllMedals() {
			setIsLoading(true);
			const allItems: MedalShowcaseItem[] = [];

			for (const gameId of REGISTERED_GAMES) {
				const state = await getGameMedalState(gameId);
				const definitions = getMedalDefinitionsForGame(gameId);

				for (const def of definitions) {
					const unlock = state.unlockedMedals[def.id];
					const isUnlocked = Boolean(unlock);
					const progress = state.medalProgress[def.id];

					allItems.push({
						id: def.id,
						gameId,
						tier: def.tier,
						title: t(def.titleKey as TranslationKey),
						description: t(def.descriptionKey as TranslationKey),
						icon: def.icon,
						isUnlocked,
						unlockedAt: unlock?.unlockedAt,
						progress: progress ? { current: progress.current, target: progress.target } : undefined,
					});
				}
			}

			if (isMounted) {
				setItems(allItems);
				setIsLoading(false);
			}
		}

		loadAllMedals();
		return () => {
			isMounted = false;
		};
	}, [t]);

	// Calculate trophy totals
	const unlockedCount = items.filter((i) => i.isUnlocked).length;
	const goldCount = items.filter((i) => i.isUnlocked && i.tier === 'gold').length;
	const silverCount = items.filter((i) => i.isUnlocked && i.tier === 'silver').length;
	const bronzeCount = items.filter((i) => i.isUnlocked && i.tier === 'bronze').length;

	// Filter items by selected game
	const visibleItems = items.filter((item) => activeGameFilter === 'all' || item.gameId === activeGameFilter);

	return (
		<div className={S.ShowcaseContainer}>
			{/* Trophy Summary Header */}
			<section className={S.TrophyBar} aria-label={t('medals.showcase.trophiesSummary')}>
				<div className={S.TrophyCard}>
					<span className={S.TrophyCount}>
						{unlockedCount} / {items.length}
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
			<div className={S.FilterBar} role="tablist" aria-label="Game Filter">
				<button
					type="button"
					role="tab"
					aria-selected={activeGameFilter === 'all'}
					data-active={activeGameFilter === 'all'}
					className={S.FilterTab}
					onClick={() => handleFilterChange('all')}
				>
					{t('medals.showcase.allGames')}
				</button>
				{REGISTERED_GAMES.map((gameId) => (
					<button
						key={gameId}
						type="button"
						role="tab"
						aria-selected={activeGameFilter === gameId}
						data-active={activeGameFilter === gameId}
						className={S.FilterTab}
						onClick={() => handleFilterChange(gameId)}
					>
						{t(`medals.showcase.games.${gameId}` as TranslationKey)}
					</button>
				))}
			</div>

			{/* Medals Grid */}
			<div className={S.MedalsGrid}>
				{visibleItems.length === 0 && !isLoading && (
					<div className={S.EmptyState}>{t('medals.showcase.empty')}</div>
				)}

				{visibleItems.map((item) => {
					const progress = item.progress;
					const hasProgress = Boolean(progress && progress.target > 0);
					const currentProgress = progress?.current ?? 0;
					const targetProgress = progress?.target ?? 0;
					const percent =
						hasProgress && targetProgress > 0
							? Math.min(100, Math.round((currentProgress / targetProgress) * 100))
							: 0;

					return (
						<article
							key={item.id}
							className={S.MedalCard}
							data-status={item.isUnlocked ? 'unlocked' : 'locked'}
							data-tier={item.tier}
						>
							<div className={S.MedalHeader}>
								<div className={S.MedalBadge} data-tier={item.tier} aria-hidden="true">
									{item.isUnlocked ? (
										<Icon name="trophy" size="md" />
									) : (
										<Icon name="lock" size="md" />
									)}
								</div>
								<div className={S.MedalMeta}>
									<span className={S.MedalGameBadge}>{item.gameId}</span>
									<h3 className={S.MedalTitle}>{item.title}</h3>
								</div>
							</div>

							<p className={S.MedalDescription}>{item.description}</p>

							<div className={S.MedalFooter}>
								{item.isUnlocked && item.unlockedAt ? (
									<span className={S.UnlockedDate}>
										{t('medals.showcase.status.unlockedOn', {
											date: new Date(item.unlockedAt).toLocaleDateString(lang),
										})}
									</span>
								) : hasProgress ? (
									<div className={S.ProgressContainer}>
										<div className={S.ProgressBarTrack}>
											<div className={S.ProgressBarFill} style={{ width: `${percent}%` }} />
										</div>
										<span className={S.ProgressLabel}>
											{currentProgress} / {targetProgress} ({percent}%)
										</span>
									</div>
								) : (
									<span className={S.ProgressLabel}>{t('medals.showcase.status.locked')}</span>
								)}
							</div>
						</article>
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
