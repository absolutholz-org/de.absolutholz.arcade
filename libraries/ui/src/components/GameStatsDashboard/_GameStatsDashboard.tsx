import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { JSX } from 'react';
import { Button } from '../Button';
import { SegmentedControl } from '../SegmentedControl';
import { formatDurationIso, formatTime } from '../Timer';
import { resolveSupportedLanguage, useGameStatsDashboard } from './_GameStatsDashboard.hooks';
import * as S from './_GameStatsDashboard.styles';
import type { GameStatsDashboardProps } from './_GameStatsDashboard.types';

function GameStatsDashboardContent({
	gameId,
	lang,
	stats: preloadedStats,
	bucketLabels,
	playHref,
	className,
}: GameStatsDashboardProps): JSX.Element {
	const { t } = useI18n('common');
	const { stats, isLoading, activeTab, setActiveTab, bucketKeys, activeBucketStats, winRate } = useGameStatsDashboard(
		gameId,
		preloadedStats,
	);

	const titleText = t('stats.title');
	const resolvedPlayHref = playHref ?? `/${lang}/game`;

	if (isLoading) {
		return (
			<S.Container className={className} aria-label={titleText}>
				<S.Header>
					<h2>{titleText}</h2>
				</S.Header>
			</S.Container>
		);
	}

	const hasPlayedGames = (stats?.overall.gamesPlayed ?? 0) > 0;

	if (!hasPlayedGames) {
		return (
			<S.Container className={className} aria-label={titleText}>
				<S.Header>
					<h2>{titleText}</h2>
				</S.Header>
				<S.EmptyStateCard>
					<span data-slot="icon" aria-hidden="true">
						📊
					</span>
					<h3 data-slot="title">{t('stats.emptyTitle')}</h3>
					<p data-slot="description">{t('stats.emptyDescription')}</p>
					<Button as="a" href={resolvedPlayHref} variant="primary" size="md">
						{t('stats.playNow')}
					</Button>
				</S.EmptyStateCard>
			</S.Container>
		);
	}

	const segmentedOptions = [
		{ value: 'overall', label: t('stats.overall') },
		...bucketKeys.map((key) => ({
			value: key,
			label: bucketLabels?.[key] ?? key,
		})),
	];

	const bestTimeText =
		activeBucketStats.bestTimeSeconds !== null ? formatTime(activeBucketStats.bestTimeSeconds) : '—';

	const bestTimeIso =
		activeBucketStats.bestTimeSeconds !== null ? formatDurationIso(activeBucketStats.bestTimeSeconds) : undefined;

	const hasSecondaryMetrics =
		activeBucketStats.totalPlayTimeSeconds > 0 ||
		activeBucketStats.bestMoves != null ||
		activeBucketStats.bestScore != null ||
		activeBucketStats.flawlessWins > 0;

	return (
		<S.Container className={className} aria-label={titleText}>
			<S.Header>
				<h2>{titleText}</h2>
			</S.Header>

			{bucketKeys.length > 0 && (
				<S.SwitcherContainer>
					<SegmentedControl
						value={activeTab}
						onChange={setActiveTab}
						options={segmentedOptions}
						ariaLabel={t('stats.bucketSelectorAria')}
						size="md"
					/>
				</S.SwitcherContainer>
			)}

			<S.MetricsGrid>
				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.gamesPlayed}</span>
					<span data-slot="label">{t('stats.gamesPlayed')}</span>
				</S.MetricCard>

				<S.MetricCard data-variant="highlight">
					<span data-slot="value">{winRate}%</span>
					<span data-slot="label">{t('stats.winRate')}</span>
				</S.MetricCard>

				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.currentStreak}</span>
					<span data-slot="label">{t('stats.currentStreak')}</span>
				</S.MetricCard>

				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.bestStreak}</span>
					<span data-slot="label">{t('stats.bestStreak')}</span>
				</S.MetricCard>

				<S.MetricCard>
					<span data-slot="value">
						{bestTimeIso ? <time dateTime={bestTimeIso}>{bestTimeText}</time> : bestTimeText}
					</span>
					<span data-slot="label">{t('stats.bestTime')}</span>
				</S.MetricCard>
			</S.MetricsGrid>

			{hasSecondaryMetrics && (
				<S.SecondaryMetricsGrid>
					{activeBucketStats.totalPlayTimeSeconds > 0 && (
						<S.MetricCard>
							<span data-slot="value">
								<time dateTime={formatDurationIso(activeBucketStats.totalPlayTimeSeconds)}>
									{formatTime(activeBucketStats.totalPlayTimeSeconds)}
								</time>
							</span>
							<span data-slot="label">{t('stats.totalPlayTime')}</span>
						</S.MetricCard>
					)}

					{activeBucketStats.bestMoves != null && (
						<S.MetricCard>
							<span data-slot="value">{activeBucketStats.bestMoves}</span>
							<span data-slot="label">{t('stats.bestMoves')}</span>
						</S.MetricCard>
					)}

					{activeBucketStats.bestScore != null && (
						<S.MetricCard>
							<span data-slot="value">{activeBucketStats.bestScore}</span>
							<span data-slot="label">{t('stats.bestScore')}</span>
						</S.MetricCard>
					)}

					{activeBucketStats.flawlessWins > 0 && (
						<S.MetricCard>
							<span data-slot="value">{activeBucketStats.flawlessWins}</span>
							<span data-slot="label">{t('stats.flawlessWins')}</span>
						</S.MetricCard>
					)}
				</S.SecondaryMetricsGrid>
			)}
		</S.Container>
	);
}

export function GameStatsDashboard(props: GameStatsDashboardProps): JSX.Element {
	const resolvedLang: SupportedLanguageCode = resolveSupportedLanguage(props.lang);

	return (
		<I18nProvider language={resolvedLang}>
			<GameStatsDashboardContent {...props} lang={resolvedLang} />
		</I18nProvider>
	);
}
