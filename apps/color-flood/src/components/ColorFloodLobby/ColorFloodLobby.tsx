import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { styled } from '@linaria/react';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage.ts';
import { DIFFICULTY_CONFIGS, type Difficulty, type GameSnapshot } from '../../engine/types.ts';

const DIFFICULTIES: readonly Difficulty[] = ['beginner', 'easy', 'medium', 'hard'];

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

export interface ColorFloodLobbyProps {
	readonly lang?: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('color-flood');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [solvedByDifficulty, setSolvedByDifficulty] = useState<Record<Difficulty, number>>({
		beginner: 0,
		easy: 0,
		medium: 0,
		hard: 0,
	});

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadProgress(),
				loadLastConfig(),
			]);

			if (savedGame) {
				setActiveGame(savedGame);
			}

			if (savedProgress && typeof savedProgress === 'object') {
				setSolvedByDifficulty({
					beginner: savedProgress.beginner?.completedCount ?? 0,
					easy: savedProgress.easy?.completedCount ?? 0,
					medium: savedProgress.medium?.completedCount ?? 0,
					hard: savedProgress.hard?.completedCount ?? 0,
				});
			}
		}
		void init();
	}, []);

	const getDifficultyDescription = (diff: Difficulty): string => {
		switch (diff) {
			case 'beginner':
				return t('difficulty.beginnerDesc');
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
				message: `${t(`difficulty.${activeGame.difficulty}` as 'difficulty.easy')} • ${activeGame.moves} / ${activeGame.maxMoves} ${t('game.moves')}`,
				onResume: () => {
					window.location.href = `/color-flood/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.restart'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/color-flood/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/color-flood/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/color-flood/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/color-flood/${language}/medals` },
	];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="color-flood"
		>
			<SectionDiv aria-labelledby="color-flood-difficulty-title">
				<h2 id="color-flood-difficulty-title">{t('difficulty.label')}</h2>

				<PuzzlesGrid>
					{DIFFICULTIES.map((diff) => {
						const solvedCount = solvedByDifficulty[diff] ?? 0;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/color-flood/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({
										difficulty: diff,
										size: DIFFICULTY_CONFIGS[diff].size,
										colorCount: DIFFICULTY_CONFIGS[diff].colorCount,
									});
								}}
								title={t(`difficulty.${diff}` as 'difficulty.easy')}
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
				</PuzzlesGrid>
			</SectionDiv>
		</GameLandingTemplate>
	);
}

export function ColorFloodLobby({ lang }: ColorFloodLobbyProps = {}): JSX.Element {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<LobbyContent />
			</I18nProvider>
		);
	}
	return <LobbyContent />;
}
