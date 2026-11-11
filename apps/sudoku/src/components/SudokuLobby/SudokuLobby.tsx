import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Collapsible } from '@arcade/lib-ui/components/Collapsible';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { SUDOKU_PUZZLES, getPuzzlesByDifficulty } from '../../engine/puzzles';
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
	const [hasActivePuzzleQuery, setHasActivePuzzleQuery] = useState(false);

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
				if (params.has('puzzle')) {
					setHasActivePuzzleQuery(true);
				}
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
		void init();
	}, []);

	const handleSelectDifficulty = (diff: Difficulty) => {
		setSelectedDifficulty(diff);
		void saveLastConfig({ difficulty: diff });
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
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/sudoku/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/sudoku/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/sudoku/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/sudoku/${language}/medals` },
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
			<S.Section aria-labelledby="sudoku-quickplay-title">
				<h2 id="sudoku-quickplay-title">{t('difficulty.label')}</h2>
				<S.QuickPlayGrid>
					{DIFFICULTY_LEVELS.map((diff) => {
						const puzzles = getPuzzlesByDifficulty(diff);
						const solvedCount = puzzles.filter((p) => progress[p.id]?.completed).length;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/sudoku/${language}/game?difficulty=${diff}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: diff });
								}}
								title={t(`difficulty.${diff}`)}
								subtitle={t(`difficulty.${diff}Desc` as 'difficulty.easyDesc')}
								badge={
									solvedCount > 0
										? {
												label: `${solvedCount}/${puzzles.length} ${t('levels.completed')}`,
												variant: solvedCount === puzzles.length ? 'success' : 'neutral',
											}
										: undefined
								}
							/>
						);
					})}
				</S.QuickPlayGrid>
			</S.Section>

			<S.ArchiveWrapper>
				<Collapsible
					title={tCommon('curatedPuzzles')}
					count={SUDOKU_PUZZLES.length}
					defaultOpen={hasActivePuzzleQuery}
				>
					<S.ArchiveContent>
						<SegmentedControl
							items={difficultyItems}
							value={selectedDifficulty}
							onChange={(diff) => handleSelectDifficulty(diff as Difficulty)}
							ariaLabel={t('difficulty.label')}
						/>

						<S.PuzzlesGrid>
							{currentPuzzles.map((puzzle) => {
								const puzzleRecord = progress[puzzle.id];
								const isCompleted = Boolean(puzzleRecord?.completed);

								return (
									<GameSelectionCard
										key={puzzle.id}
										as="a"
										href={`/sudoku/${language}/game?difficulty=${selectedDifficulty}&puzzle=${puzzle.id}&new=true`}
										onClick={() => {
											void saveLastConfig({ difficulty: selectedDifficulty });
										}}
										title={t('levels.puzzleNum', { number: String(puzzle.index) })}
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
					</S.ArchiveContent>
				</Collapsible>
			</S.ArchiveWrapper>
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
