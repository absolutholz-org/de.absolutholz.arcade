import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { styled } from '@linaria/react';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadProgress } from '../../engine/storage.ts';
import type { DiceBingoSnapshot, DifficultyLevel } from '../../engine/types.ts';

const DIFFICULTIES: readonly DifficultyLevel[] = ['easy', 'medium', 'hard'];

const SectionDiv = styled.section`
	display: block;
	margin-top: 2rem;

	& > h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		text-align: left;
	}
`;

const PuzzlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	gap: 1rem;
`;

export interface DiceBingoLobbyProps {
	readonly lang?: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('dice-bingo');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<DiceBingoSnapshot | null>(null);
	const [completedCountByDiff, setCompletedCountByDiff] = useState<Record<DifficultyLevel, number>>({
		easy: 0,
		medium: 0,
		hard: 0,
	});

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress] = await Promise.all([loadActiveGame(), loadProgress()]);

			if (savedGame && !savedGame.isComplete) {
				setActiveGame(savedGame);
			}

			if (savedProgress && typeof savedProgress === 'object') {
				setCompletedCountByDiff({
					easy: savedProgress.easy?.completedCount ?? 0,
					medium: savedProgress.medium?.completedCount ?? 0,
					hard: savedProgress.hard?.completedCount ?? 0,
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

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}` as 'difficulty.easy')} • ${activeGame.currentTurn} / ${activeGame.maxTurns} ${t('game.turnsRemaining')}`,
				onResume: () => {
					window.location.href = `/dice-bingo/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.restart'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/dice-bingo/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/dice-bingo/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/dice-bingo/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/dice-bingo/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="dice-bingo"
		>
			<SectionDiv aria-labelledby="dice-bingo-difficulty-title">
				<h2 id="dice-bingo-difficulty-title">{t('difficulty.label')}</h2>

				<PuzzlesGrid>
					{DIFFICULTIES.map((diff) => {
						const count = completedCountByDiff[diff] ?? 0;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/dice-bingo/${language}/game?difficulty=${diff}&new=true`}
								title={t(`difficulty.${diff}` as 'difficulty.easy')}
								subtitle={getDifficultyDescription(diff)}
								badge={count > 0 ? { label: `${count} ${t('lobby.completed')}` } : undefined}
							/>
						);
					})}
				</PuzzlesGrid>
			</SectionDiv>
		</GameLandingTemplate>
	);
}

export function DiceBingoLobby({ lang }: DiceBingoLobbyProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<LobbyContent />
		</I18nProvider>
	);
}
