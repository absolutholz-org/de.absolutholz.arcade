import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameStats, getGameStats } from '@arcade/lib-storage';
import { Collapsible } from '@arcade/lib-ui';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, type ReactNode, useEffect, useState } from 'react';
import { loadActiveGame, saveLastConfig } from '../../engine/storage';
import { DIFFICULTIES, type Difficulty, type GameSnapshot } from '../../engine/types';
import * as S from './ColorMapLobby.styles';

export interface ColorMapLobbyProps {
	readonly lang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function LobbyContent({ rulesContent }: { readonly rulesContent?: ReactNode }): JSX.Element {
	const { t, language } = useI18n('color-map');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<GameStats | null>(null);

	useEffect(() => {
		async function init() {
			const [savedGame, gameStats] = await Promise.all([loadActiveGame(), getGameStats('color-map')]);
			if (savedGame) {
				setActiveGame(savedGame);
			}
			setStats(gameStats);
		}
		void init();
	}, []);

	const resumeState = activeGame
		? {
				message: t('lobby.resumeSubtitle', {
					difficulty: t(`difficulty.${activeGame.puzzle.difficulty}`),
					time: formatTime(activeGame.elapsedSeconds),
				}),
				onResume: () => {
					window.location.href = `/color-map/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/color-map/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/color-map/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/color-map/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/color-map/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="color-map"
		>
			<S.Section aria-labelledby="color-map-difficulty-title">
				<h2 id="color-map-difficulty-title">{t('lobby.chooseDifficulty')}</h2>
				<S.DifficultyGrid>
					{DIFFICULTIES.map((diff: Difficulty) => {
						const bucketStats = stats?.byBucket[diff];
						const gamesWon = bucketStats?.gamesWon ?? 0;
						const bestTime = bucketStats?.bestTimeSeconds;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/color-map/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: diff });
								}}
								title={t(`difficulty.${diff}`)}
								metadata={[
									gamesWon > 0 && `${gamesWon} ${tCommon('stats.gamesWon')}`,
									bestTime !== null &&
										bestTime !== undefined &&
										`${tCommon('stats.bestTime')}: ${formatTime(bestTime)}`,
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

export function ColorMapLobby({ lang, rulesContent }: ColorMapLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent rulesContent={rulesContent} />
		</I18nProvider>
	);
}
