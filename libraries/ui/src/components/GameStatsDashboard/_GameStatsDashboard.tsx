import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import type { JSX } from 'react';
import { Button } from '../Button';
import { SegmentedControl } from '../SegmentedControl';
import { formatDurationIso, formatTime } from '../Timer';
import { resolveSupportedLanguage, useGameStatsDashboard } from './_GameStatsDashboard.hooks';
import * as S from './_GameStatsDashboard.styles';
import type { GameStatsDashboardProps } from './_GameStatsDashboard.types';

function capitalizeWord(word: string): string {
	if (!word) return '';
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function resolveBucketLabel(
	key: string,
	bucketLabels: Record<string, string> | undefined,
	tGame: (k: TranslationKey) => string,
): string {
	if (bucketLabels?.[key]) {
		return bucketLabels[key];
	}

	// Try compound keys like "easy:zen"
	if (key.includes(':')) {
		const parts = key.split(':');
		const resolvedParts = parts.map((part) => {
			if (bucketLabels?.[part]) return bucketLabels[part];
			const directDiff = tGame(`difficulty.${part}` as TranslationKey);
			if (directDiff && directDiff !== `difficulty.${part}`) return directDiff;
			const directMode = tGame(`mode.${part}` as TranslationKey);
			if (directMode && directMode !== `mode.${part}`) return directMode;
			return capitalizeWord(part);
		});
		if (resolvedParts.length === 2) {
			return `${resolvedParts[0]} (${resolvedParts[1]})`;
		}
		return resolvedParts.join(' • ');
	}

	const directDiff = tGame(`difficulty.${key}` as TranslationKey);
	if (directDiff && directDiff !== `difficulty.${key}`) return directDiff;

	return capitalizeWord(key);
}

function GameStatsDashboardContent({
	gameId,
	lang,
	stats: preloadedStats,
	bucketLabels,
	playHref,
	hideTitle = false,
	showFastestRuns = false,
	showTopScores = false,
	showFewestMoves = false,
	fewestMovesVariant = 'moves',
	hideWinLossMetrics = false,
	displayMode = 'standard',
	className,
}: GameStatsDashboardProps): JSX.Element {
	const { t } = useI18n('common');
	const { t: tGame } = useI18n(gameId);
	const { stats, isLoading, activeTab, setActiveTab, bucketKeys, activeBucketStats, winRate } = useGameStatsDashboard(
		gameId,
		preloadedStats,
	);

	const titleText = t('stats.title');
	const resolvedPlayHref = playHref ?? `/${lang}/game`;

	if (isLoading) {
		return (
			<S.Container className={className} aria-label={titleText}>
				{!hideTitle && (
					<S.Header>
						<h2>{titleText}</h2>
					</S.Header>
				)}
			</S.Container>
		);
	}

	const hasPlayedGames = (stats?.overall.gamesPlayed ?? 0) > 0;

	if (!hasPlayedGames) {
		return (
			<S.Container className={className} aria-label={titleText}>
				{!hideTitle && (
					<S.Header>
						<h2>{titleText}</h2>
					</S.Header>
				)}
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
			label: resolveBucketLabel(key, bucketLabels, tGame),
		})),
	];

	const bestTimeText =
		activeBucketStats.bestTimeSeconds !== null ? formatTime(activeBucketStats.bestTimeSeconds) : '—';

	const bestTimeIso =
		activeBucketStats.bestTimeSeconds !== null ? formatDurationIso(activeBucketStats.bestTimeSeconds) : undefined;

	const isMatchDrawMode = displayMode === 'match-draw';
	const bestMovesLabel = fewestMovesVariant === 'guesses' ? t('stats.bestGuesses') : t('stats.bestMoves');
	const fewestMovesTitle = fewestMovesVariant === 'guesses' ? t('stats.fewestGuesses') : t('stats.fewestMoves');

	const hasSecondaryMetrics =
		activeBucketStats.totalPlayTimeSeconds > 0 ||
		activeBucketStats.bestMoves != null ||
		activeBucketStats.bestScore != null ||
		activeBucketStats.bestCluster != null ||
		activeBucketStats.flawlessWins > 0;

	const secondaryMetricCards = (
		<>
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
					<span data-slot="label">{bestMovesLabel}</span>
				</S.MetricCard>
			)}

			{activeBucketStats.bestScore != null && (
				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.bestScore.toLocaleString()}</span>
					<span data-slot="label">{t('stats.bestScore')}</span>
				</S.MetricCard>
			)}

			{activeBucketStats.bestCluster != null && (
				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.bestCluster}</span>
					<span data-slot="label">{t('stats.largestCluster')}</span>
				</S.MetricCard>
			)}

			{activeBucketStats.flawlessWins > 0 && (
				<S.MetricCard>
					<span data-slot="value">{activeBucketStats.flawlessWins}</span>
					<span data-slot="label">{t('stats.flawlessWins')}</span>
				</S.MetricCard>
			)}
		</>
	);

	const leaderboards: JSX.Element[] = [];

	if (showTopScores && activeBucketStats.topScores && activeBucketStats.topScores.length > 0) {
		leaderboards.push(
			<S.FastestRunsSection key="top-scores" aria-label={t('stats.topScores')}>
				<h3>{t('stats.topScores')}</h3>
				<S.FastestRunsList>
					{activeBucketStats.topScores.slice(0, 10).map((entry, index) => {
						const rank = index + 1;
						const dateText = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(
							new Date(entry.timestamp),
						);
						const bucketLabel =
							activeTab === 'overall' && entry.bucketKey
								? resolveBucketLabel(entry.bucketKey, bucketLabels, tGame)
								: null;

						return (
							<S.FastestRunRow key={`${entry.timestamp}-${entry.score}-${rank}`} data-rank={rank}>
								<span data-slot="meta">
									<span data-slot="rank">#{rank}</span>
									{bucketLabel && <span data-slot="bucket">{bucketLabel}</span>}
									<span data-slot="date">{dateText}</span>
								</span>
								<span data-slot="time">{entry.score.toLocaleString()}</span>
							</S.FastestRunRow>
						);
					})}
				</S.FastestRunsList>
			</S.FastestRunsSection>,
		);
	}

	if (showFewestMoves && activeBucketStats.fewestMoves && activeBucketStats.fewestMoves.length > 0) {
		leaderboards.push(
			<S.FastestRunsSection key="fewest-moves" aria-label={fewestMovesTitle}>
				<h3>{fewestMovesTitle}</h3>
				<S.FastestRunsList>
					{activeBucketStats.fewestMoves.slice(0, 10).map((entry, index) => {
						const rank = index + 1;
						const dateText = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(
							new Date(entry.timestamp),
						);
						const bucketLabel =
							activeTab === 'overall' && entry.bucketKey
								? resolveBucketLabel(entry.bucketKey, bucketLabels, tGame)
								: null;

						return (
							<S.FastestRunRow key={`${entry.timestamp}-${entry.moves}-${rank}`} data-rank={rank}>
								<span data-slot="meta">
									<span data-slot="rank">#{rank}</span>
									{bucketLabel && <span data-slot="bucket">{bucketLabel}</span>}
									<span data-slot="date">{dateText}</span>
								</span>
								<span data-slot="time">
									<span>{entry.moves.toLocaleString()}</span>
									{entry.playTimeSeconds != null && (
										<span data-slot="subvalue">
											<time dateTime={formatDurationIso(entry.playTimeSeconds)}>
												{formatTime(entry.playTimeSeconds)}
											</time>
										</span>
									)}
								</span>
							</S.FastestRunRow>
						);
					})}
				</S.FastestRunsList>
			</S.FastestRunsSection>,
		);
	}

	if (showFastestRuns && activeBucketStats.fastestRuns && activeBucketStats.fastestRuns.length > 0) {
		leaderboards.push(
			<S.FastestRunsSection key="fastest-runs" aria-label={t('stats.fastestGames')}>
				<h3>{t('stats.fastestGames')}</h3>
				<S.FastestRunsList>
					{activeBucketStats.fastestRuns.slice(0, 10).map((entry, index) => {
						const rank = index + 1;
						const dateText = new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(
							new Date(entry.timestamp),
						);
						const bucketLabel =
							activeTab === 'overall' && entry.bucketKey
								? resolveBucketLabel(entry.bucketKey, bucketLabels, tGame)
								: null;

						return (
							<S.FastestRunRow
								key={`${entry.timestamp}-${entry.playTimeSeconds}-${rank}`}
								data-rank={rank}
							>
								<span data-slot="meta">
									<span data-slot="rank">#{rank}</span>
									{bucketLabel && <span data-slot="bucket">{bucketLabel}</span>}
									<span data-slot="date">{dateText}</span>
								</span>
								<span data-slot="time">
									<time dateTime={formatDurationIso(entry.playTimeSeconds)}>
										{formatTime(entry.playTimeSeconds)}
									</time>
								</span>
							</S.FastestRunRow>
						);
					})}
				</S.FastestRunsList>
			</S.FastestRunsSection>,
		);
	}

	return (
		<S.Container className={className} aria-label={titleText}>
			{!hideTitle && (
				<S.Header>
					<h2>{titleText}</h2>
				</S.Header>
			)}

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

			{isMatchDrawMode ? (
				<S.MetricsGrid data-auto-fit="true">
					<S.MetricCard>
						<span data-slot="value">{activeBucketStats.gamesPlayed}</span>
						<span data-slot="label">{t('stats.matchesPlayed')}</span>
					</S.MetricCard>

					<S.MetricCard data-variant="highlight">
						<span data-slot="value">{activeBucketStats.gamesWon}</span>
						<span data-slot="label">{t('stats.decisiveWins')}</span>
					</S.MetricCard>

					<S.MetricCard>
						<span data-slot="value">{activeBucketStats.gamesLost}</span>
						<span data-slot="label">{t('stats.draws')}</span>
					</S.MetricCard>

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
				</S.MetricsGrid>
			) : (
				<>
					<S.MetricsGrid data-auto-fit={hideWinLossMetrics ? 'true' : undefined}>
						<S.MetricCard>
							<span data-slot="value">{activeBucketStats.gamesPlayed}</span>
							<span data-slot="label">{t('stats.gamesPlayed')}</span>
						</S.MetricCard>

						{!hideWinLossMetrics && (
							<>
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
							</>
						)}

						<S.MetricCard data-variant={hideWinLossMetrics ? 'highlight' : undefined}>
							<span data-slot="value">
								{bestTimeIso ? <time dateTime={bestTimeIso}>{bestTimeText}</time> : bestTimeText}
							</span>
							<span data-slot="label">{t('stats.bestTime')}</span>
						</S.MetricCard>

						{hideWinLossMetrics && secondaryMetricCards}
					</S.MetricsGrid>

					{!hideWinLossMetrics && hasSecondaryMetrics && (
						<S.SecondaryMetricsGrid>{secondaryMetricCards}</S.SecondaryMetricsGrid>
					)}
				</>
			)}

			{leaderboards.length > 0 && (
				<S.LeaderboardsGrid data-multiple={leaderboards.length > 1 ? 'true' : undefined}>
					{leaderboards}
				</S.LeaderboardsGrid>
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
