import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import {
	GameLandingTemplate,
	GameSelectionCard,
	Icon,
	QuickPlayCard,
	SegmentedControl,
	type SegmentedControlItem,
} from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { type JSX, useEffect, useState } from 'react';
import { getPuzzlesByDifficulty } from '../../engine/puzzles';
import { loadActiveGame, loadProgress } from '../../engine/storage';
import {
	DIFFICULTY_LEVELS,
	type Difficulty,
	GRID_SIZES,
	type GameSnapshot,
	type ProgressMap,
} from '../../engine/types';
import * as S from './QueensLobby.styles';
import type { QueensLobbyProps } from './QueensLobby.types';

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('queens');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

	useEffect(() => {
		async function init() {
			const savedGame = await loadActiveGame();
			if (savedGame && !savedGame.isComplete) {
				setActiveGame(savedGame);
			}
			const savedProgress = await loadProgress();
			setProgress(savedProgress);
		}
		init();
	}, []);

	const currentPuzzles = getPuzzlesByDifficulty(selectedDifficulty);

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${activeGame.size}×${activeGame.size} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/queens/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/queens/${language}/medals` },
		{ label: tCommon('navigation.rules'), href: `/queens/${language}/rules` },
	];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTY_LEVELS.map((diff) => {
		const size = GRID_SIZES[diff];
		return {
			id: diff,
			label: t(`difficulty.${diff}`),
			sublabel: `${size}×${size}`,
		};
	});

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="queens"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => setSelectedDifficulty(diff as Difficulty)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection>
				<h2>{t('levels.selectLevel')}</h2>
				<S.PuzzlesGrid>
					<QuickPlayCard
						key="quick-play"
						as="a"
						href={`/queens/${language}/game?difficulty=${selectedDifficulty}&random=true&new=true`}
						title={t('levels.quickPlay')}
						subtitle={t('levels.quickPlayDesc')}
						icon={<Icon emoji="🎲" size="md" />}
					/>

					{currentPuzzles.map((puzzle, index) => {
						const puzzleNum = index + 1;
						const puzzleData = progress[puzzle.id];
						const isDone = Boolean(puzzleData?.completed);
						const bestTime = puzzleData?.bestTime;

						return (
							<GameSelectionCard
								key={puzzle.id}
								as="a"
								href={`/queens/${language}/game?puzzle=${puzzle.id}&new=true`}
								title={t('levels.puzzleNum', { number: puzzleNum })}
								dimensions={`${puzzle.size}×${puzzle.size}`}
								subtitle={
									bestTime !== undefined
										? t('levels.bestTime', { time: formatTime(bestTime) })
										: undefined
								}
								badge={
									isDone
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

export function QueensLobby({ lang }: QueensLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
