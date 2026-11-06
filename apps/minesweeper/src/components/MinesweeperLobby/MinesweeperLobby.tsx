import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import {
	BOARD_SIZES,
	BOARD_SIZE_LIST,
	type BoardSizeId,
	DIFFICULTIES,
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

			if (loadedScores) {
				setHighScores(loadedScores);
			}

			let resolvedSize: BoardSizeId = 'md';
			let resolvedDiff: DifficultyId = 'medium';
			let hasUrlSize = false;
			let hasUrlDiff = false;

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const querySize = params.get('size') as BoardSizeId | null;
				const queryDiff = params.get('difficulty') as DifficultyId | null;
				if (querySize && BOARD_SIZES[querySize]) {
					resolvedSize = querySize;
					hasUrlSize = true;
				}
				if (queryDiff && DIFFICULTIES[queryDiff]) {
					resolvedDiff = queryDiff;
					hasUrlDiff = true;
				}
			}

			if (!hasUrlSize && game && game.status === 'playing' && game.size && BOARD_SIZES[game.size]) {
				resolvedSize = game.size;
			} else if (!hasUrlSize && lastConfig?.size && BOARD_SIZES[lastConfig.size]) {
				resolvedSize = lastConfig.size;
			}

			if (!hasUrlDiff && game && game.status === 'playing' && game.difficulty && DIFFICULTIES[game.difficulty]) {
				resolvedDiff = game.difficulty;
			} else if (!hasUrlDiff && lastConfig?.difficulty && DIFFICULTIES[lastConfig.difficulty]) {
				resolvedDiff = lastConfig.difficulty;
			}

			setSelectedSize(resolvedSize);
			setSelectedDifficulty(resolvedDiff);
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
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/minesweeper/${language}/rules` },
		{ label: `⚙️ ${tCommon('navigation.settings')}`, href: `/minesweeper/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/minesweeper/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/minesweeper/${language}/medals` },
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
