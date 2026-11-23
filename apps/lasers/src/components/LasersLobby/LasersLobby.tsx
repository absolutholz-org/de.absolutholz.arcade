import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameStats, getGameStats } from '@arcade/lib-storage';
import { Collapsible } from '@arcade/lib-ui';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, type ReactNode, useEffect, useState } from 'react';
import { traceBeams } from '../../engine/raytrace';
import { loadActiveGame, saveLastConfig } from '../../engine/storage';
import { DIFFICULTIES, type Difficulty, type GameSnapshot } from '../../engine/types';
import * as S from './LasersLobby.styles';

export interface LasersLobbyProps {
	readonly lang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function formatSeconds(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function LobbyContent({ rulesContent }: { readonly rulesContent?: ReactNode }): JSX.Element {
	const { t, language } = useI18n('lasers');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<GameStats | null>(null);

	useEffect(() => {
		async function init() {
			const [savedGame, gameStats] = await Promise.all([loadActiveGame(), getGameStats('lasers')]);
			if (savedGame && savedGame.status === 'playing') {
				setActiveGame(savedGame);
			}
			setStats(gameStats);
		}
		void init();
	}, []);

	const resumeTrace = activeGame ? traceBeams(activeGame.grid) : null;
	const resumeState =
		activeGame && resumeTrace
			? {
					message: t('lobby.resumeSubtitle', {
						difficulty: t(`difficulty.${activeGame.difficulty}`),
						lit: resumeTrace.litTargetCount,
						total: resumeTrace.totalTargetCount,
						moves: activeGame.movesCount,
					}),
					onResume: () => {
						window.location.href = `/lasers/${language}/game?resume=true`;
					},
					buttonLabel: t('controls.resume'),
				}
			: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/lasers/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/lasers/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/lasers/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/lasers/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="lasers"
		>
			<S.Section aria-labelledby="lasers-difficulty-title">
				<h2 id="lasers-difficulty-title">{t('lobby.chooseDifficulty')}</h2>
				<S.DifficultyGrid>
					{DIFFICULTIES.map((diff: Difficulty) => {
						const bucketStats = stats?.byBucket[diff];
						const gamesWon = bucketStats?.gamesWon ?? 0;
						const bestTime = bucketStats?.bestTimeSeconds;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/lasers/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: diff });
								}}
								title={t(`difficulty.${diff}`)}
								metadata={[
									gamesWon > 0 && `${gamesWon} ${t('stats.solvedCount')}`,
									bestTime !== null &&
										bestTime !== undefined &&
										bestTime > 0 &&
										`${t('stats.bestTime')}: ${formatSeconds(bestTime)}`,
								]}
							>
								{t(`difficulty.${diff}Desc` as 'difficulty.easyDesc')}
							</GameSelectionCard>
						);
					})}
				</S.DifficultyGrid>
			</S.Section>

			{rulesContent && (
				<S.RulesSection>
					<Collapsible title={t('lobby.howToPlayTitle')} variant="card">
						{rulesContent}
					</Collapsible>
				</S.RulesSection>
			)}
		</GameLandingTemplate>
	);
}

export function LasersLobby({ lang, rulesContent }: LasersLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent rulesContent={rulesContent} />
		</I18nProvider>
	);
}
