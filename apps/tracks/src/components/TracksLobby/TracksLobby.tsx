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
import { getPuzzleById, getPuzzlesByDifficulty } from '../../engine/puzzles.js';
import { loadActiveGame, loadProgress } from '../../engine/storage.js';
import {
	DIFFICULTY_GRID_SIZES,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type GameSnapshot,
	type ProgressMap,
} from '../../engine/types.js';
import * as S from './TracksLobby.styles.js';
import type { TracksLobbyProps } from './TracksLobby.types.js';

function getInitialLobbyDifficulty(): DifficultyLevel {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const diff = params.get('difficulty') as DifficultyLevel | null;
		if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
			return diff;
		}
	}
	return 'easy';
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('tracks');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(getInitialLobbyDifficulty);

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
				const diff = params.get('difficulty') as DifficultyLevel | null;
				if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
					setSelectedDifficulty(diff);
					return;
				}
			}

			let latestTime = 0;
			let latestDiff: DifficultyLevel | null = null;
			for (const [pId, record] of Object.entries(savedProgress)) {
				if (record.lastPlayed && record.lastPlayed > latestTime) {
					latestTime = record.lastPlayed;
					const found = getPuzzleById(pId);
					if (found) {
						latestDiff = found.difficulty;
					}
				}
			}

			if (savedGame && !savedGame.isComplete && savedGame.difficulty) {
				if (!latestTime || (savedGame.lastPlayed && savedGame.lastPlayed >= latestTime)) {
					setSelectedDifficulty(savedGame.difficulty);
					return;
				}
			}

			if (latestDiff) {
				setSelectedDifficulty(latestDiff);
			}
		}
		init();
	}, []);

	const handleSelectDifficulty = (diff: DifficultyLevel) => {
		setSelectedDifficulty(diff);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const currentPuzzles = getPuzzlesByDifficulty(selectedDifficulty);
	const activeGridSize = activeGame
		? (DIFFICULTY_GRID_SIZES[activeGame.difficulty]?.width ?? activeGame.grid.length)
		: 0;

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${t('levels.gridSize', { size: String(activeGridSize) })} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/tracks/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [{ label: tCommon('navigation.rules'), href: `/tracks/${language}/rules` }];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTY_LEVELS.map((diff) => {
		const size = DIFFICULTY_GRID_SIZES[diff];
		return {
			id: diff,
			label: t(`difficulty.${diff}`),
			sublabel: `${size.width}×${size.height}`,
		};
	});

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="tracks"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleSelectDifficulty(diff as DifficultyLevel)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection aria-labelledby="tracks-puzzles-section-title">
				<h2 id="tracks-puzzles-section-title">
					{t('levels.selectLevel')} ({t(`difficulty.${selectedDifficulty}`)})
				</h2>

				<S.PuzzlesGrid>
					<QuickPlayCard
						key="quick-play"
						as="a"
						href={`/tracks/${language}/game?difficulty=${selectedDifficulty}&random=true&new=true`}
						title={t('levels.quickPlay')}
						subtitle={t('levels.quickPlayDesc')}
						icon={<Icon emoji="🎲" size="md" />}
					/>

					{currentPuzzles.map((puzzle, index) => {
						const puzzleRecord = progress[puzzle.id];
						const isCompleted = Boolean(puzzleRecord?.completed);

						return (
							<GameSelectionCard
								key={puzzle.id}
								as="a"
								href={`/tracks/${language}/game?difficulty=${selectedDifficulty}&puzzle=${puzzle.id}&new=true`}
								title={t('levels.puzzleNum', { number: String(index + 1) })}
								dimensions={t('levels.gridSize', { size: String(puzzle.size) })}
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

export function TracksLobby({ lang }: TracksLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
