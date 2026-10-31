import { ALL_GAMES, type GameDefinition } from '@arcade/lib-games';
import { resources } from '@arcade/lib-i18n/config/i18n';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { getGameMedalState, subscribeToMedalUnlocked } from '@arcade/lib-medals';
import {
	type AggregatedGameStats,
	type HubGlobalStats,
	getGlobalStats,
	subscribeToStatsUpdated,
} from '@arcade/lib-storage';
import { ClickableCard, GameSegmentedControl, type GameSegmentedOption } from '@arcade/lib-ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as S from './HubStatsDashboard.styles';
import type { HubStatsDashboardProps } from './HubStatsDashboard.types';

function formatDuration(ms: number): string {
	if (!ms || ms <= 0) return '< 1m';
	const totalMinutes = Math.floor(ms / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	if (minutes > 0) {
		return `${minutes}m`;
	}
	return '< 1m';
}

function formatBestTime(ms?: number): string {
	if (ms === undefined || ms === null || ms <= 0) {
		return '—';
	}
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	}
	return `${seconds}s`;
}

function normalizeGameParam(param: string | null): string {
	if (!param) return 'all';
	const lower = param.toLowerCase().trim();
	if (lower === 'all' || ALL_GAMES.some((g) => g.id === lower)) {
		return lower;
	}
	return 'all';
}

function getLocalizedGameTitle(
	game: GameDefinition,
	lang: SupportedLanguageCode,
	tMedals: (key: TranslationKey) => string,
): string {
	const langRes = resources[lang] ?? resources.en;
	const gameNs = game.i18nNamespace as keyof typeof langRes;
	const gameEntry = langRes?.[gameNs] as { title?: string } | undefined;
	if (gameEntry?.title) {
		return gameEntry.title;
	}

	const showcaseTitle = tMedals(`showcase.games.${game.id}` as TranslationKey);
	if (showcaseTitle && !showcaseTitle.startsWith('showcase.games.')) {
		return showcaseTitle;
	}

	return game.name || game.id.charAt(0).toUpperCase() + game.id.slice(1);
}

function HubStatsDashboardContent({ lang }: HubStatsDashboardProps) {
	const { t } = useI18n('common');
	const { t: tMedals } = useI18n('medals');

	const [activeGameFilter, setActiveGameFilter] = useState<string>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			return normalizeGameParam(params.get('game'));
		}
		return 'all';
	});

	const [globalStats, setGlobalStats] = useState<HubGlobalStats>({
		totalGamesPlayed: 0,
		totalGamesWon: 0,
		totalPlayTimeMs: 0,
		games: {},
	});
	const [totalMedalsUnlocked, setTotalMedalsUnlocked] = useState<number>(0);

	const hydrateData = useCallback(async () => {
		try {
			const gameIds = ALL_GAMES.map((g) => g.id);
			const stats = await getGlobalStats(gameIds);
			setGlobalStats(stats);

			let unlockedCount = 0;
			for (const game of ALL_GAMES) {
				try {
					const medalState = await getGameMedalState(game.id);
					for (const unlock of Object.values(medalState.unlockedMedals)) {
						if (unlock) {
							unlockedCount++;
						}
					}
				} catch {
					// Ignore individual game hydration failure
				}
			}
			setTotalMedalsUnlocked(unlockedCount);
		} catch (error) {
			console.error('Failed to load hub statistics:', error);
		}
	}, []);

	useEffect(() => {
		let isMounted = true;
		hydrateData();

		const unsubscribeStats = subscribeToStatsUpdated(() => {
			if (isMounted) hydrateData();
		});

		const unsubscribeMedals = subscribeToMedalUnlocked(() => {
			if (isMounted) hydrateData();
		});

		return () => {
			isMounted = false;
			unsubscribeStats();
			unsubscribeMedals();
		};
	}, [hydrateData]);

	// Synchronize URL popstate
	useEffect(() => {
		const updateFromUrl = () => {
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				setActiveGameFilter(normalizeGameParam(params.get('game')));
			}
		};

		window.addEventListener('popstate', updateFromUrl);
		return () => window.removeEventListener('popstate', updateFromUrl);
	}, []);

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

	const globalWinRate = useMemo(() => {
		if (globalStats.totalGamesPlayed <= 0) return 0;
		return Math.round((globalStats.totalGamesWon / globalStats.totalGamesPlayed) * 100);
	}, [globalStats.totalGamesPlayed, globalStats.totalGamesWon]);

	const formattedTotalTime = useMemo(() => {
		return formatDuration(globalStats.totalPlayTimeMs);
	}, [globalStats.totalPlayTimeMs]);

	const selectedGame = useMemo(() => {
		if (activeGameFilter === 'all') return null;
		return ALL_GAMES.find((g) => g.id === activeGameFilter) ?? null;
	}, [activeGameFilter]);

	const selectedGameStats: AggregatedGameStats | undefined = selectedGame
		? globalStats.games[selectedGame.id]
		: undefined;

	const filterOptions: GameSegmentedOption[] = useMemo(() => {
		return [
			{
				id: 'all',
				label: tMedals('showcase.allGames'),
			},
			...ALL_GAMES.map((game) => ({
				id: game.id,
				label: getLocalizedGameTitle(game, lang, tMedals),
				icon: game.assets.icon,
			})),
		];
	}, [lang, tMedals]);

	return (
		<div className={S.Container}>
			{/* Overview / Global KPI Summary Deck */}
			<section className={S.KpiGrid} aria-label={t('stats.title')}>
				<div className={S.KpiCard} aria-label={`${t('stats.gamesWon')}: ${globalStats.totalGamesWon}`}>
					<span className={S.KpiValue}>{globalStats.totalGamesWon}</span>
					<span className={S.KpiLabel}>{t('stats.gamesWon')}</span>
				</div>

				<div className={S.KpiCard} aria-label={`${t('stats.totalPlayTime')}: ${formattedTotalTime}`}>
					<span className={S.KpiValue}>{formattedTotalTime}</span>
					<span className={S.KpiLabel}>{t('stats.totalPlayTime')}</span>
				</div>

				<div className={S.KpiCard} aria-label={`${t('stats.winRate')}: ${globalWinRate}%`}>
					<span className={S.KpiValue}>{globalWinRate}%</span>
					<span className={S.KpiLabel}>{t('stats.winRate')}</span>
				</div>

				<div
					className={S.KpiCard}
					aria-label={`${tMedals('showcase.trophiesSummary')}: ${totalMedalsUnlocked}`}
				>
					<span className={S.KpiValue}>{totalMedalsUnlocked}</span>
					<span className={S.KpiLabel}>{tMedals('showcase.trophiesSummary')}</span>
				</div>
			</section>

			{/* Game Filter Navigation */}
			<GameSegmentedControl
				options={filterOptions}
				selectedId={activeGameFilter}
				onSelect={handleFilterChange}
				ariaLabel={tMedals('showcase.allGames')}
			/>

			{/* Tab Panel */}
			<div
				className={S.TabPanel}
				id="panel-stats"
				role="tabpanel"
				aria-label={
					selectedGame ? getLocalizedGameTitle(selectedGame, lang, tMedals) : tMedals('showcase.allGames')
				}
			>
				{activeGameFilter === 'all' || !selectedGame ? (
					/* All-Games compact card grid */
					<section className={S.Section} aria-label={t('hub.gamesTitle')}>
						<div className={S.SectionHeader}>
							<h2>{t('hub.gamesTitle')}</h2>
						</div>

						<div className={S.CompactGrid}>
							{ALL_GAMES.map((game) => {
								const gameStats = globalStats.games[game.id];
								const played = gameStats?.totalPlayed ?? 0;
								const won = gameStats?.totalWon ?? 0;
								const winRate = gameStats?.winRate ?? 0;
								const streak = gameStats?.currentStreak ?? 0;
								const title = getLocalizedGameTitle(game, lang, tMedals);

								return (
									<ClickableCard
										key={game.id}
										as="button"
										type="button"
										className={S.CompactCard}
										onClick={() => handleFilterChange(game.id)}
										aria-label={`${title}: ${played} ${t('stats.gamesPlayed')}, ${won} ${t('stats.gamesWon')}, ${played > 0 ? winRate : 0}% ${t('stats.winRate')}`}
									>
										<div className={S.CompactCardHeader}>
											<span className={S.CompactGameIcon} aria-hidden="true">
												{game.assets.icon}
											</span>
											<span className={S.CompactGameTitle}>{title}</span>
										</div>

										<div className={S.CompactMetricsGrid}>
											<div className={S.MetricItem}>
												<span className={S.MetricLabel}>{t('stats.gamesPlayed')}</span>
												<span className={S.MetricValue}>{played}</span>
											</div>
											<div className={S.MetricItem}>
												<span className={S.MetricLabel}>{t('stats.gamesWon')}</span>
												<span className={S.MetricValue}>{won}</span>
											</div>
											<div className={S.MetricItem}>
												<span className={S.MetricLabel}>{t('stats.winRate')}</span>
												<span className={S.MetricValue}>
													{played > 0 ? `${winRate}%` : '—'}
												</span>
											</div>
											<div className={S.MetricItem}>
												<span className={S.MetricLabel}>{t('stats.currentStreak')}</span>
												<span className={S.MetricValue}>{streak}</span>
											</div>
										</div>
									</ClickableCard>
								);
							})}
						</div>
					</section>
				) : (
					/* Focused Selected Game Metrics View */
					<section className={S.Section} aria-label={getLocalizedGameTitle(selectedGame, lang, tMedals)}>
						<div className={S.GameHeaderBanner}>
							<span className={S.GameHeaderIcon} aria-hidden="true">
								{selectedGame.assets.icon}
							</span>
							<div className={S.GameHeaderContent}>
								<h2 className={S.GameHeaderTitle}>
									{getLocalizedGameTitle(selectedGame, lang, tMedals)}
								</h2>
								<span className={S.GameHeaderSubtitle}>{t('stats.title')}</span>
							</div>
						</div>

						<div className={S.KpiGrid}>
							{/* Played & Won (with Win Rate %) */}
							<div
								className={S.KpiCard}
								aria-label={`${t('stats.gamesWon')}: ${selectedGameStats?.totalWon ?? 0} of ${selectedGameStats?.totalPlayed ?? 0}`}
							>
								<span className={S.KpiValue}>
									{selectedGameStats?.totalWon ?? 0} / {selectedGameStats?.totalPlayed ?? 0}
								</span>
								<span className={S.KpiLabel}>
									{t('stats.gamesWon')} / {t('stats.gamesPlayed')}
								</span>
								<span className={S.KpiSubline}>
									{(selectedGameStats?.totalPlayed ?? 0) > 0
										? `${selectedGameStats?.winRate ?? 0}% ${t('stats.winRate')}`
										: `0% ${t('stats.winRate')}`}
								</span>
							</div>

							{/* Current Streak & Max Streak */}
							<div
								className={S.KpiCard}
								aria-label={`${t('stats.currentStreak')}: ${selectedGameStats?.currentStreak ?? 0}`}
							>
								<span className={S.KpiValue}>{selectedGameStats?.currentStreak ?? 0}</span>
								<span className={S.KpiLabel}>{t('stats.currentStreak')}</span>
								<span className={S.KpiSubline}>
									{t('stats.bestStreak')}: {selectedGameStats?.maxStreak ?? 0}
								</span>
							</div>

							{/* Best Time */}
							<div
								className={S.KpiCard}
								aria-label={`${t('stats.bestTime')}: ${formatBestTime(selectedGameStats?.bestTimeMs)}`}
							>
								<span className={S.KpiValue}>{formatBestTime(selectedGameStats?.bestTimeMs)}</span>
								<span className={S.KpiLabel}>{t('stats.bestTime')}</span>
								<span className={S.KpiSubline}>
									{(selectedGameStats?.totalPlayed ?? 0) > 0 ? t('stats.overall') : '—'}
								</span>
							</div>

							{/* Total Time Played */}
							<div
								className={S.KpiCard}
								aria-label={`${t('stats.totalPlayTime')}: ${formatDuration(selectedGameStats?.totalTimeMs ?? 0)}`}
							>
								<span className={S.KpiValue}>
									{formatDuration(selectedGameStats?.totalTimeMs ?? 0)}
								</span>
								<span className={S.KpiLabel}>{t('stats.totalPlayTime')}</span>
								<span className={S.KpiSubline}>
									{selectedGameStats?.totalPlayed ?? 0} {t('stats.gamesPlayed').toLowerCase()}
								</span>
							</div>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}

export function HubStatsDashboard({ lang }: HubStatsDashboardProps) {
	return (
		<I18nProvider language={lang}>
			<HubStatsDashboardContent lang={lang} />
		</I18nProvider>
	);
}
