import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { QuickPlayCard } from '@arcade/lib-ui/components/QuickPlayCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { getPuzzlesByDifficulty } from '../../engine/puzzles';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage';
import {
	DIFFICULTY_LEVELS,
	type Difficulty,
	GRID_SIZES,
	type GameSnapshot,
	type ProgressMap,
} from '../../engine/types';
import * as S from './StarBattleLobby.styles';
import type { StarBattleLobbyProps } from './StarBattleLobby.types';

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('star-battle');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

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
				const diff = params.get('difficulty') as Difficulty | null;
				if (diff && (DIFFICULTY_LEVELS as readonly string[]).includes(diff)) {
					setSelectedDifficulty(diff);
					hasUrlDiff = true;
				}
			}

			if (!hasUrlDiff && savedGame && !savedGame.isComplete && savedGame.difficulty) {
				setSelectedDifficulty(savedGame.difficulty);
			} else if (
				!hasUrlDiff &&
				lastConfig?.difficulty &&
				(DIFFICULTY_LEVELS as readonly string[]).includes(lastConfig.difficulty)
			) {
				setSelectedDifficulty(lastConfig.difficulty);
			}
		}
		init();
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
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${activeGame.size}×${activeGame.size} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/star-battle/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/star-battle/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/star-battle/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/star-battle/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/star-battle/${language}/medals` },
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
			offlineGameId="star-battle"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleSelectDifficulty(diff as Difficulty)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection>
				<h2>{t('levels.selectLevel')}</h2>
				<S.PuzzlesGrid>
					<QuickPlayCard
						key="quick-play"
						as="a"
						href={`/star-battle/${language}/game?difficulty=${selectedDifficulty}&random=true&new=true`}
						onClick={() => {
							void saveLastConfig({ difficulty: selectedDifficulty });
						}}
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
								href={`/star-battle/${language}/game?puzzle=${puzzle.id}&new=true`}
								onClick={() => {
									void saveLastConfig({ difficulty: selectedDifficulty });
								}}
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

export function StarBattleLobby({ lang }: StarBattleLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}

export const QueensLobby = StarBattleLobby;
