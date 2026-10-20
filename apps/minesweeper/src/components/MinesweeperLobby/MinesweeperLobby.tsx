import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameLandingTemplate, GameSelectionCard, SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import {
	BOARD_SIZES,
	BOARD_SIZE_LIST,
	type BoardSizeId,
	DIFFICULTY_LIST,
	type DifficultyId,
	type GameSnapshot,
	type HighScoreEntry,
	getMineCount,
	loadActiveGame,
	loadHighScores,
	loadLastConfig,
	saveLastConfig,
} from '../../engine';
import { DifficultyGraphic } from '../Graphics';
import * as S from './MinesweeperLobby.styles';

export interface MinesweeperLobbyProps {
	lang: SupportedLanguageCode;
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('minesweeper');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [selectedSize, setSelectedSize] = useState<BoardSizeId>('md');
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('medium');
	const [highScores, setHighScores] = useState<HighScoreEntry[]>([]);

	useEffect(() => {
		async function init() {
			const game = await loadActiveGame();
			if (game && game.status === 'playing') {
				setActiveGame(game);
			}

			const [lastConfig, loadedScores] = await Promise.all([loadLastConfig(), loadHighScores()]);

			if (lastConfig) {
				if (BOARD_SIZES[lastConfig.size]) {
					setSelectedSize(lastConfig.size);
				}
				if (lastConfig.difficulty) {
					setSelectedDifficulty(lastConfig.difficulty);
				}
			}

			if (loadedScores) {
				setHighScores(loadedScores);
			}
		}
		init();
	}, []);

	const handleSizeChange = (sizeId: string) => {
		const size = sizeId as BoardSizeId;
		setSelectedSize(size);
		saveLastConfig({ size, difficulty: selectedDifficulty });
	};

	const handleStartGame = (difficulty: DifficultyId) => {
		setSelectedDifficulty(difficulty);
		saveLastConfig({ size: selectedSize, difficulty });
		if (typeof window !== 'undefined') {
			window.location.href = `/minesweeper/${language}/game?size=${selectedSize}&difficulty=${difficulty}&new=true`;
		}
	};

	const resumeState = activeGame
		? {
				message: `${t(`size.${activeGame.size}`)} • ${t(`difficulty.${activeGame.difficulty}`)} • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/minesweeper/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	const pageFooterLinks = [
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/minesweeper/${language}/medals` },
		{ label: t('highScores.title'), href: `/minesweeper/${language}/high-scores` },
		{ label: tCommon('navigation.rules'), href: `/minesweeper/${language}/rules` },
	];

	const sizeItems: SegmentedControlItem[] = BOARD_SIZE_LIST.map((sizeConfig) => ({
		id: sizeConfig.id,
		label: t(`size.${sizeConfig.id}`),
		sublabel: `${sizeConfig.columns}×${sizeConfig.rows}`,
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="minesweeper"
		>
			<S.LaunchSection>
				<S.SizeSelectorWrapper>
					<SegmentedControl
						items={sizeItems}
						value={selectedSize}
						onChange={handleSizeChange}
						ariaLabel={t('size.label')}
					/>
				</S.SizeSelectorWrapper>

				<S.DifficultyGrid aria-label={t('difficulty.label')}>
					{DIFFICULTY_LIST.map((diffConfig) => {
						const fieldCount = BOARD_SIZES[selectedSize].fieldCount;
						const mineCount = getMineCount(fieldCount, diffConfig.id);
						const bestScore = highScores
							.filter((s) => s.size === selectedSize && s.difficulty === diffConfig.id)
							.sort((a, b) => a.seconds - b.seconds)[0];

						return (
							<GameSelectionCard
								key={diffConfig.id}
								title={t(`difficulty.${diffConfig.id}`)}
								subtitle={t(`difficulty.${diffConfig.id}Desc`)}
								dimensions={`${mineCount} ${t('status.minesLeft')}`}
								badge={
									bestScore
										? {
												label: `${t('status.bestTime')}: ${formatTime(bestScore.seconds)}`,
												variant: 'accent',
											}
										: undefined
								}
								preview={<DifficultyGraphic difficulty={diffConfig.id} />}
								onClick={() => handleStartGame(diffConfig.id)}
							/>
						);
					})}
				</S.DifficultyGrid>
			</S.LaunchSection>
		</GameLandingTemplate>
	);
}

export function MinesweeperLobby({ lang }: MinesweeperLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
