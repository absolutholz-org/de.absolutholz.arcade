import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { type GameStats, getGameStats } from '@arcade/lib-storage';
import { Collapsible } from '@arcade/lib-ui';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, type ReactNode, useEffect, useState } from 'react';
import { countRemainingTiles } from '../../engine/board';
import { loadActiveGame, saveLastConfig } from '../../engine/storage';
import { DIFFICULTIES, type Difficulty, type GameSnapshot } from '../../engine/types';
import * as S from './CascadeLobby.styles';

export interface CascadeLobbyProps {
	readonly lang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function LobbyContent({ rulesContent }: { readonly rulesContent?: ReactNode }): JSX.Element {
	const { t, language } = useI18n('cascade');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [stats, setStats] = useState<GameStats | null>(null);

	useEffect(() => {
		async function init() {
			const [savedGame, gameStats] = await Promise.all([loadActiveGame(), getGameStats('cascade')]);
			if (savedGame && savedGame.status !== 'completed') {
				setActiveGame(savedGame);
			}
			setStats(gameStats);
		}
		void init();
	}, []);

	const resumeState = activeGame
		? {
				message: t('lobby.resumeSubtitle', {
					difficulty: t(`difficulty.${activeGame.difficulty}`),
					score: activeGame.score.toLocaleString(),
					tiles: countRemainingTiles(activeGame.board),
				}),
				onResume: () => {
					window.location.href = `/cascade/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/cascade/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/cascade/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/cascade/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/cascade/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="cascade"
		>
			<S.Section aria-labelledby="cascade-difficulty-title">
				<h2 id="cascade-difficulty-title">{t('lobby.chooseDifficulty')}</h2>
				<S.DifficultyGrid>
					{DIFFICULTIES.map((diff: Difficulty) => {
						const bucketStats = stats?.byBucket[diff];
						const gamesPlayed = bucketStats?.gamesPlayed ?? 0;
						const bestScore = bucketStats?.bestScore;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/cascade/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: diff });
								}}
								title={t(`difficulty.${diff}`)}
								metadata={[
									gamesPlayed > 0 && `${gamesPlayed} ${t('stats.gamesPlayed')}`,
									bestScore !== null &&
										bestScore !== undefined &&
										bestScore > 0 &&
										`${t('stats.bestScore')}: ${bestScore.toLocaleString()}`,
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

export function CascadeLobby({ lang, rulesContent }: CascadeLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent rulesContent={rulesContent} />
		</I18nProvider>
	);
}
