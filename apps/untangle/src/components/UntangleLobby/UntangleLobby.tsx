import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadProgress } from '../../engine/storage.ts';
import { type ActiveGameSnapshot, DIFFICULTY_LEVELS, type DifficultyLevel } from '../../engine/types.ts';
import * as S from './UntangleLobby.styles.ts';

export type UntangleDifficulty = DifficultyLevel;

export interface UntangleLobbyProps {
	lang?: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('untangle');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<ActiveGameSnapshot | null>(null);
	const [solvedByDifficulty, setSolvedByDifficulty] = useState<Record<DifficultyLevel, number>>({
		easy: 0,
		medium: 0,
		hard: 0,
	});

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress] = await Promise.all([loadActiveGame(), loadProgress()]);

			if (savedGame) {
				setActiveGame(savedGame);
			}

			if (savedProgress && typeof savedProgress === 'object') {
				const byDiff =
					'solvedByDifficulty' in savedProgress &&
					savedProgress.solvedByDifficulty &&
					typeof savedProgress.solvedByDifficulty === 'object'
						? (savedProgress.solvedByDifficulty as Partial<Record<DifficultyLevel, number>>)
						: null;
				const mapProgress = savedProgress as Partial<Record<DifficultyLevel, { completedCount?: number }>>;

				setSolvedByDifficulty({
					easy: byDiff?.easy ?? mapProgress.easy?.completedCount ?? 0,
					medium: byDiff?.medium ?? mapProgress.medium?.completedCount ?? 0,
					hard: byDiff?.hard ?? mapProgress.hard?.completedCount ?? 0,
				});
			}
		}
		void init();
	}, []);

	const getDifficultyDescription = (diff: DifficultyLevel): string => {
		switch (diff) {
			case 'easy':
				return t('difficulty.easyDesc');
			case 'medium':
				return t('difficulty.mediumDesc');
			case 'hard':
				return t('difficulty.hardDesc');
		}
	};

	const activeDifficulty: DifficultyLevel | null = activeGame
		? 'difficulty' in activeGame && typeof activeGame.difficulty === 'string'
			? (activeGame.difficulty as DifficultyLevel)
			: activeGame.board.difficulty
		: null;

	const activeMoves: number = activeGame
		? 'moves' in activeGame && typeof activeGame.moves === 'number'
			? activeGame.moves
			: activeGame.board.moveCount
		: 0;

	const resumeState =
		activeGame && activeDifficulty
			? {
					message: `${t(`difficulty.${activeDifficulty}`)} • ${formatTime(activeGame.elapsedSeconds)} • ${activeMoves} ${t('status.moves')}`,
					onResume: () => {
						window.location.href = `/untangle/${language}/game?resume=true`;
					},
					buttonLabel: t('controls.resume'),
				}
			: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/untangle/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/untangle/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/untangle/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/untangle/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="untangle"
		>
			<S.PuzzlesSection aria-labelledby="untangle-difficulty-section-title">
				<h2 id="untangle-difficulty-section-title">{t('difficulty.label')}</h2>

				<S.PuzzlesGrid>
					{DIFFICULTY_LEVELS.map((diff) => {
						const solvedCount = solvedByDifficulty[diff] ?? 0;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/untangle/${language}/game?difficulty=${diff}&new=true`}
								title={t(`difficulty.${diff}`)}
								dimensions={getDifficultyDescription(diff)}
								subtitle={solvedCount > 0 ? `${t('levels.completed')}: ${solvedCount}` : undefined}
								badge={
									solvedCount > 0
										? {
												label: t('levels.completed'),
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

export function UntangleLobby({ lang }: UntangleLobbyProps = {}): JSX.Element {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<LobbyContent />
			</I18nProvider>
		);
	}
	return <LobbyContent />;
}
