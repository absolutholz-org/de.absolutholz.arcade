import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Collapsible } from '@arcade/lib-ui/components/Collapsible';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { STATIC_PUZZLES, getPuzzleById, getPuzzlesByDifficulty } from '../../engine/puzzles.js';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage.js';
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
	const [hasActivePuzzleQuery, setHasActivePuzzleQuery] = useState(false);

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadProgress(),
				loadLastConfig(),
			]);

			if (savedGame && !savedGame.isComplete) {
				setActiveGame(savedGame);
			}
			setProgress(savedProgress);

			let hasUrlDiff = false;
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				if (params.has('puzzle')) {
					setHasActivePuzzleQuery(true);
				}
				const diff = params.get('difficulty') as DifficultyLevel | null;
				if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
					setSelectedDifficulty(diff);
					hasUrlDiff = true;
				}
			}

			if (
				!hasUrlDiff &&
				lastConfig?.difficulty &&
				(DIFFICULTY_LEVELS as readonly string[]).includes(lastConfig.difficulty)
			) {
				setSelectedDifficulty(lastConfig.difficulty);
				return;
			}

			if (!hasUrlDiff && savedGame && !savedGame.isComplete && savedGame.difficulty) {
				setSelectedDifficulty(savedGame.difficulty);
				return;
			}

			if (!hasUrlDiff) {
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

				if (latestDiff) {
					setSelectedDifficulty(latestDiff);
				}
			}
		}
		void init();
	}, []);

	const handleSelectDifficulty = (diff: DifficultyLevel) => {
		setSelectedDifficulty(diff);
		void saveLastConfig({ difficulty: diff });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', diff);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const currentPuzzles = getPuzzlesByDifficulty(selectedDifficulty);
	const totalCuratedCount = Object.values(STATIC_PUZZLES).reduce((acc, list) => acc + list.length, 0);
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

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/tracks/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/tracks/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/tracks/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/tracks/${language}/medals` },
	];

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
			<S.Section aria-labelledby="tracks-quickplay-title">
				<h2 id="tracks-quickplay-title">{t('difficulty.label')}</h2>
				<S.QuickPlayGrid>
					{DIFFICULTY_LEVELS.map((diff) => {
						const size = DIFFICULTY_GRID_SIZES[diff];
						const puzzles = getPuzzlesByDifficulty(diff);
						const solvedCount = puzzles.filter((p) => progress[p.id]?.completed).length;

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/tracks/${language}/game?difficulty=${diff}&random=true&new=true`}
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
					count={totalCuratedCount}
					defaultOpen={hasActivePuzzleQuery}
				>
					<S.ArchiveContent>
						<SegmentedControl
							items={difficultyItems}
							value={selectedDifficulty}
							onChange={(diff) => handleSelectDifficulty(diff as DifficultyLevel)}
							ariaLabel={t('difficulty.label')}
						/>

						<S.PuzzlesGrid>
							{currentPuzzles.map((puzzle, index) => {
								const puzzleRecord = progress[puzzle.id];
								const isCompleted = Boolean(puzzleRecord?.completed);

								return (
									<GameSelectionCard
										key={puzzle.id}
										as="a"
										href={`/tracks/${language}/game?puzzle=${puzzle.id}&new=true`}
										onClick={() => {
											void saveLastConfig({ difficulty: selectedDifficulty });
										}}
										title={t('levels.puzzleNum', { number: String(index + 1) })}
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

export function TracksLobby({ lang }: TracksLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
