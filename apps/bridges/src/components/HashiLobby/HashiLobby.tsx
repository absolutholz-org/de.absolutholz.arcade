import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { GameLandingTemplate } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
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
import * as S from './HashiLobby.styles.js';
import type { HashiLobbyProps } from './HashiLobby.types.js';

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
	const { t, language } = useI18n('bridges');
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

			// 1. If URL query param specified a valid difficulty, stick with it
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const diff = params.get('difficulty') as DifficultyLevel | null;
				if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
					setSelectedDifficulty(diff);
					return;
				}
			}

			// 2. Otherwise, check most recently played/completed puzzle
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

			// 3. If there is an active uncompleted game, compare with latestPlayed
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
	const currentGrid = DIFFICULTY_GRID_SIZES[selectedDifficulty];

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${activeGame.islands.length} islands • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/bridges/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [{ label: tCommon('navigation.rules'), href: `/bridges/${language}/rules` }];

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="bridges"
		>
			{/* Difficulty Selector Tabs */}
			<S.DifficultyTabs role="tablist" aria-label={t('difficulty.label')}>
				{DIFFICULTY_LEVELS.map((diff) => {
					const size = DIFFICULTY_GRID_SIZES[diff];
					const isSelected = selectedDifficulty === diff;

					return (
						<S.TabButton
							key={diff}
							type="button"
							role="tab"
							aria-selected={isSelected}
							data-active={isSelected ? 'true' : 'false'}
							onClick={() => handleSelectDifficulty(diff)}
						>
							<span className="tab-title">{t(`difficulty.${diff}`)}</span>
							<span className="tab-size">
								{size.width}×{size.height}
							</span>
						</S.TabButton>
					);
				})}
			</S.DifficultyTabs>

			{/* Puzzles Grid */}
			<section aria-labelledby="puzzles-section-title">
				<h2 id="puzzles-section-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
					{t('levels.selectLevel')} ({t(`difficulty.${selectedDifficulty}`)})
				</h2>

				<S.PuzzlesGrid>
					{currentPuzzles.map((puzzle, index) => {
						const puzzleRecord = progress[puzzle.id];
						const isCompleted = puzzleRecord?.completed;

						return (
							<S.PuzzleCard key={puzzle.id}>
								<div className="card-header">
									<span className="puzzle-num">
										{t('levels.puzzleNum', { number: String(index + 1) })}
									</span>
									{isCompleted && (
										<span className="completed-badge">
											<Icon name="check" size="xs" />
											{t('levels.completed')}
										</span>
									)}
								</div>

								<div className="card-body">
									<span>{puzzle.islands.length} islands</span>
									<span>
										Grid: {currentGrid.width}×{currentGrid.height}
									</span>
									{puzzleRecord?.bestTime ? (
										<span>{t('levels.bestTime', { time: formatTime(puzzleRecord.bestTime) })}</span>
									) : (
										<span>{t('levels.notCompleted')}</span>
									)}
								</div>

								<Button
									as="a"
									href={`/bridges/${language}/game?difficulty=${selectedDifficulty}&puzzle=${puzzle.id}&new=true`}
									variant={isCompleted ? 'secondary' : 'primary'}
									size="sm"
								>
									{t('controls.play')}
								</Button>
							</S.PuzzleCard>
						);
					})}
				</S.PuzzlesGrid>
			</section>
		</GameLandingTemplate>
	);
}

export function HashiLobby({ lang }: HashiLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
