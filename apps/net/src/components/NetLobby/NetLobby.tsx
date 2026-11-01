import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadProgress } from '../../engine/storage.ts';
import type { Difficulty, GameSnapshot } from '../../engine/types.ts';
import * as S from './NetLobby.styles.ts';

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export interface NetLobbyProps {
	lang?: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('net');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [solvedByDifficulty, setSolvedByDifficulty] = useState<Record<Difficulty, number>>({
		easy: 0,
		medium: 0,
		hard: 0,
		expert: 0,
	});

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress] = await Promise.all([loadActiveGame(), loadProgress()]);

			if (savedGame && !savedGame.isSolved) {
				setActiveGame(savedGame);
			}

			if (savedProgress && typeof savedProgress === 'object') {
				setSolvedByDifficulty({
					easy: savedProgress.easy?.completedCount ?? 0,
					medium: savedProgress.medium?.completedCount ?? 0,
					hard: savedProgress.hard?.completedCount ?? 0,
					expert: savedProgress.expert?.completedCount ?? 0,
				});
			}
		}
		void init();
	}, []);

	const getDifficultyDescription = (diff: Difficulty): string => {
		switch (diff) {
			case 'easy':
				return t('difficulty.easyDesc');
			case 'medium':
				return t('difficulty.mediumDesc');
			case 'hard':
				return t('difficulty.hardDesc');
			case 'expert':
				return t('difficulty.expertDesc');
		}
	};

	const resumeState =
		activeGame && !activeGame.isSolved
			? {
					message: `${t(`difficulty.${activeGame.difficulty}`)} • ${formatTime(activeGame.elapsedTimeSeconds)} • ${t(
						'status.moves',
						{
							moves: activeGame.movesCount,
						},
					)}`,
					onResume: () => {
						window.location.href = `/net/${language}/game?resume=true`;
					},
					buttonLabel: t('controls.resume'),
				}
			: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/net/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/net/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/net/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/net/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="net"
		>
			<S.PuzzlesSection aria-labelledby="net-difficulty-section-title">
				<h2 id="net-difficulty-section-title">{t('difficulty.label')}</h2>

				<S.PuzzlesGrid>
					{DIFFICULTIES.map((diff) => {
						const solvedCount = solvedByDifficulty[diff] ?? 0;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/net/${language}/game?difficulty=${diff}&new=true`}
								title={t(`difficulty.${diff}`)}
								dimensions={getDifficultyDescription(diff)}
								subtitle={solvedCount > 0 ? `${t('lobby.completed')}: ${solvedCount}` : undefined}
								badge={
									solvedCount > 0
										? {
												label: t('lobby.completed'),
												variant: 'success',
											}
										: undefined
								}
							/>
						);
					})}
				</S.PuzzlesGrid>
			</S.PuzzlesSection>
		</GameLandingTemplate>
	);
}

export function NetLobby({ lang }: NetLobbyProps = {}): JSX.Element {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<LobbyContent />
			</I18nProvider>
		);
	}
	return <LobbyContent />;
}
