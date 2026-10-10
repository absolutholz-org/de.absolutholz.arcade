import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
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

	return (
		<S.LobbyContainer>
			<S.HeroSection>
				<h1>{t('title')}</h1>
				<p>{t('description')}</p>
			</S.HeroSection>

			{activeGame ? (
				<S.ResumeCard>
					<div className="resume-info">
						<span className="resume-title">{t('controls.resume')}</span>
						<span className="resume-meta">
							{t(`difficulty.${activeGame.difficulty}`)} • {activeGame.size}×{activeGame.size} •{' '}
							{formatTime(activeGame.elapsedSeconds)}
						</span>
					</div>
					<Button as="a" href={`/queens/${language}/game?resume=true`} variant="primary" size="md">
						{t('controls.resume')}
					</Button>
				</S.ResumeCard>
			) : null}

			<S.DifficultyTabs role="tablist" aria-label={t('difficulty.label')}>
				{DIFFICULTY_LEVELS.map((diff) => {
					const size = GRID_SIZES[diff];
					const isActive = selectedDifficulty === diff;
					return (
						<S.TabButton
							key={diff}
							type="button"
							role="tab"
							aria-selected={isActive}
							data-active={isActive ? 'true' : 'false'}
							onClick={() => setSelectedDifficulty(diff)}
						>
							<span className="tab-title">{t(`difficulty.${diff}`)}</span>
							<span className="tab-size">
								{size}×{size}
							</span>
						</S.TabButton>
					);
				})}
			</S.DifficultyTabs>

			<S.PuzzlesSection>
				<h2>{t('levels.selectLevel')}</h2>
				<S.PuzzlesGrid>
					{currentPuzzles.map((puzzle, index) => {
						const puzzleNum = index + 1;
						const puzzleData = progress[puzzle.id];
						const isDone = !!puzzleData?.completed;
						const bestTime = puzzleData?.bestTime;

						return (
							<S.PuzzleCard key={puzzle.id}>
								<div className="card-header">
									<span className="puzzle-num">{t('levels.puzzleNum', { number: puzzleNum })}</span>
									{isDone && (
										<span className="completed-badge">
											<Icon name="check" size="xs" />
											{t('levels.completed')}
										</span>
									)}
								</div>

								<div className="card-body">
									<span>
										{puzzle.size}×{puzzle.size} Grid
									</span>
									{bestTime ? (
										<span>{t('levels.bestTime', { time: formatTime(bestTime) })}</span>
									) : (
										<span>{t('levels.notCompleted')}</span>
									)}
								</div>

								<Button
									as="a"
									href={`/queens/${language}/game?puzzle=${puzzle.id}&new=true`}
									variant={isDone ? 'secondary' : 'primary'}
									size="sm"
								>
									{t('controls.play')}
								</Button>
							</S.PuzzleCard>
						);
					})}
				</S.PuzzlesGrid>
			</S.PuzzlesSection>

			<S.QuickLinks>
				<a href={`/queens/${language}/rules`}>{t('navigation.rules')}</a>
			</S.QuickLinks>
		</S.LobbyContainer>
	);
}

export function QueensLobby({ lang }: QueensLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
