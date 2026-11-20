import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameStats, getGameStats } from '@arcade/lib-storage';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, saveLastConfig } from '../../engine/storage';
import { DIFFICULTIES, type Difficulty, type GameSnapshot } from '../../engine/types';
import * as S from './FutoshikiLobby.styles';

export interface FutoshikiLobbyProps {
	readonly lang: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('futoshiki');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<GameStats | null>(null);

	useEffect(() => {
		async function init() {
			const [savedGame, gameStats] = await Promise.all([loadActiveGame(), getGameStats('futoshiki')]);
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
					window.location.href = `/futoshiki/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/futoshiki/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/futoshiki/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/futoshiki/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/futoshiki/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="futoshiki"
		>
			<S.Section aria-labelledby="futoshiki-difficulty-title">
				<h2 id="futoshiki-difficulty-title">{t('lobby.chooseDifficulty')}</h2>
				<S.DifficultyGrid>
					{DIFFICULTIES.map((diff: Difficulty) => {
						const bucketStats = stats?.byBucket[diff];
						const gamesWon = bucketStats?.gamesWon ?? 0;
						const bestTime = bucketStats?.bestTimeSeconds;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/futoshiki/${language}/game?difficulty=${diff}&new=true`}
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
		</GameLandingTemplate>
	);
}

export function FutoshikiLobby({ lang }: FutoshikiLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
