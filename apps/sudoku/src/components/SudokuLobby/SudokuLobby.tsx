import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import {
	GameLandingTemplate,
	GameSelectionCard,
	QuickPlayCard,
	SegmentedControl,
	type SegmentedControlItem,
} from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { type JSX, useEffect, useState } from 'react';
import { getPuzzlesByDifficulty } from '../../engine/puzzles';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage';
import { DIFFICULTY_LEVELS, type Difficulty, type GameSnapshot, type ProgressMap } from '../../engine/types';
import * as S from './SudokuLobby.styles';
import type { SudokuLobbyProps } from './SudokuLobby.types';

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('sudoku');
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

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const diff = params.get('difficulty') as Difficulty | null;
				if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
					setSelectedDifficulty(diff);
					return;
				}
			}

			if (savedGame && !savedGame.isComplete && savedGame.difficulty) {
				setSelectedDifficulty(savedGame.difficulty);
				return;
			}

			const lastConfig = await loadLastConfig();
			if (lastConfig?.difficulty) {
				setSelectedDifficulty(lastConfig.difficulty);
			}
		}
		init();
	}, []);

	const handleSelectDifficulty = (diff: Difficulty) => {
		setSelectedDifficulty(diff);
		saveLastConfig({ difficulty: diff });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const currentPuzzles = getPuzzlesByDifficulty(selectedDifficulty);

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • 9×9 • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/sudoku/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: tCommon('navigation.rules'), href: `/sudoku/${language}/rules` },
		{ label: t('stats.title'), href: `/sudoku/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/${language}/medals?game=sudoku` },
	];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTY_LEVELS.map((diff) => ({
		id: diff,
		label: t(`difficulty.${diff}`),
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="sudoku"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleSelectDifficulty(diff as Difficulty)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection aria-labelledby="sudoku-puzzles-section-title">
				<h2 id="sudoku-puzzles-section-title">
					{t('levels.selectLevel')} ({t(`difficulty.${selectedDifficulty}`)})
				</h2>

				<S.PuzzlesGrid>
					<QuickPlayCard
						as="a"
						href={`/sudoku/${language}/game?difficulty=${selectedDifficulty}&new=true`}
						title={t('levels.quickPlay')}
						subtitle={t('levels.quickPlayDesc')}
					/>

					{currentPuzzles.map((puzzle) => {
						const puzzleRecord = progress[puzzle.id];
						const isCompleted = Boolean(puzzleRecord?.completed);

						return (
							<GameSelectionCard
								key={puzzle.id}
								as="a"
								href={`/sudoku/${language}/game?difficulty=${selectedDifficulty}&puzzle=${puzzle.id}&new=true`}
								title={t('levels.puzzleNum', { number: String(puzzle.index) })}
								dimensions="9×9"
								subtitle={
									puzzleRecord?.bestTime !== undefined
										? t('levels.bestTime', { time: formatTime(puzzleRecord.bestTime) })
										: undefined
								}
								badge={
									isCompleted
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

export function SudokuLobby({ lang }: SudokuLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
