import { ALL_GAMES, type GameId } from '@arcade/lib-games';
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

function HubStatsDashboardContent({ lang }: HubStatsDashboardProps) {
	const { t } = useI18n('common');
	const { t: tMedals } = useI18n('medals');

	const [globalStats, setGlobalStats] = useState<HubGlobalStats>({
		totalGamesPlayed: 0,
		totalGamesWon: 0,
		totalPlayTimeMs: 0,
		games: {},
	});
	const [totalMedalsUnlocked, setTotalMedalsUnlocked] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

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
					// Also count ladder achievements if completed but not recorded in unlockedMedals map
					for (const prog of Object.values(medalState.medalProgress)) {
						if (prog?.goldUnlocked) {
							// Already accounted or ladder gold
						}
					}
				} catch {
					// Ignore individual game hydration error
				}
			}
			setTotalMedalsUnlocked(unlockedCount);
		} catch (error) {
			console.error('Failed to load hub statistics:', error);
		} finally {
			setIsLoading(false);
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

	const globalWinRate = useMemo(() => {
		if (globalStats.totalGamesPlayed <= 0) return 0;
		return Math.round((globalStats.totalGamesWon / globalStats.totalGamesPlayed) * 100);
	}, [globalStats.totalGamesPlayed, globalStats.totalGamesWon]);

	const formattedTotalTime = useMemo(() => {
		return formatDuration(globalStats.totalPlayTimeMs);
	}, [globalStats.totalPlayTimeMs]);

	return (
		<div className={S.Container}>
			{/* Global KPI Summary Deck */}
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

			{/* Per-Game Metric Breakdown */}
			<section className={S.Section} aria-label={t('hub.gamesTitle')}>
				<div className={S.SectionHeader}>
					<h2>{t('hub.gamesTitle')}</h2>
				</div>

				<div className={S.TableWrapper}>
					<table className={S.Table} aria-label={t('hub.gamesTitle')}>
						<thead>
							<tr>
								<th className={S.Th} scope="col">
									{t('hub.gamesTitle')}
								</th>
								<th className={S.Th} scope="col" data-align="right">
									{t('stats.gamesPlayed')}
								</th>
								<th className={S.Th} scope="col" data-align="right">
									{t('stats.gamesWon')}
								</th>
								<th className={S.Th} scope="col" data-align="right">
									{t('stats.winRate')}
								</th>
								<th className={S.Th} scope="col" data-align="right">
									{t('stats.bestTime')}
								</th>
								<th className={S.Th} scope="col" data-align="right">
									{t('stats.currentStreak')}
								</th>
								<th className={S.Th} scope="col" data-align="center">
									{t('navigation.rules')} & {t('navigation.medals')}
								</th>
							</tr>
						</thead>
						<tbody>
							{ALL_GAMES.map((game) => {
								const gameStats: AggregatedGameStats | undefined = globalStats.games[game.id];
								const played = gameStats?.totalPlayed ?? 0;
								const won = gameStats?.totalWon ?? 0;
								const winRate = gameStats?.winRate ?? 0;
								const bestTime = formatBestTime(gameStats?.bestTimeMs);
								const currentStreak = gameStats?.currentStreak ?? 0;
								const gameTitle = t(`${game.i18nNamespace}.title` as TranslationKey) || game.name;

								const lobbyHref = `${game.route}/${lang}/`;
								const playHref = `${game.route}/${lang}/game`;
								const medalsHref = `${game.route}/${lang}/medals`;
								const statsHref = `${game.route}/${lang}/stats`;

								return (
									<tr key={game.id} className={S.Tr}>
										<td className={S.Td}>
											<a href={lobbyHref} className={S.GameCell}>
												<span className={S.GameIcon} aria-hidden="true">
													{game.assets.icon}
												</span>
												<span>{gameTitle}</span>
											</a>
										</td>
										<td className={S.Td} data-align="right">
											{played}
										</td>
										<td className={S.Td} data-align="right">
											{won}
										</td>
										<td className={S.Td} data-align="right">
											{played > 0 ? `${winRate}%` : '—'}
										</td>
										<td className={S.Td} data-align="right">
											{bestTime}
										</td>
										<td className={S.Td} data-align="right">
											{currentStreak}
										</td>
										<td className={S.Td} data-align="center">
											<div className={S.ActionsCell}>
												<a
													href={playHref}
													className={S.ActionLink}
													data-primary="true"
													title={`Play ${gameTitle}`}
													aria-label={`Play ${gameTitle}`}
												>
													▶ {t('stats.playNow')}
												</a>
												<a
													href={medalsHref}
													className={S.ActionLink}
													title={`${gameTitle} Medals`}
													aria-label={`${gameTitle} Medals`}
												>
													🏅 {t('navigation.medals')}
												</a>
												<a
													href={statsHref}
													className={S.ActionLink}
													title={`${gameTitle} Statistics`}
													aria-label={`${gameTitle} Statistics`}
												>
													📊 {t('navigation.stats')}
												</a>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
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
