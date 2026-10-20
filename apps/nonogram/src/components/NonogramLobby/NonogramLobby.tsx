import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { GameLandingTemplate, GameSelectionCard, SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import type { CSSProperties, JSX } from 'react';
import { useEffect, useState } from 'react';
import { PUZZLES_BY_DIFFICULTY, getDefaultPuzzle, getPuzzleById } from '../../engine/puzzles';
import { loadActiveGame, loadLastConfig, loadSolvedPuzzles, saveLastConfig } from '../../engine/storage';
import type { DifficultyId, GameSnapshot, NonogramPuzzle, PuzzleRecord } from '../../engine/types';
import { PuzzleIcon } from '../NonogramIcons';
import * as S from './NonogramLobby.styles';

export interface NonogramLobbyProps {
	lang: SupportedLanguageCode;
}

const DIFFICULTIES: DifficultyId[] = ['easy', 'medium', 'hard'];

const DIFFICULTY_SIZES: Record<DifficultyId, string> = {
	easy: '5×5',
	medium: '10×10',
	hard: '15×15',
};

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('nonogram');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [activeGamePuzzle, setActiveGamePuzzle] = useState<NonogramPuzzle | null>(null);
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('easy');
	const [solvedRecords, setSolvedRecords] = useState<Record<string, PuzzleRecord>>({});

	useEffect(() => {
		async function init() {
			const [game, solved, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadSolvedPuzzles(),
				loadLastConfig(),
			]);

			setSolvedRecords(solved);

			if (game && game.status === 'playing') {
				setActiveGame(game);
				const puz = getPuzzleById(game.puzzleId);
				if (puz) setActiveGamePuzzle(puz);
			}

			if (lastConfig) {
				setSelectedDifficulty(lastConfig.difficulty);
			}
		}
		init();
	}, []);

	const handleDifficultyChange = (diff: DifficultyId) => {
		setSelectedDifficulty(diff);
		const defaultForDiff = getDefaultPuzzle(diff).id;
		saveLastConfig({ difficulty: diff, puzzleId: defaultForDiff });
	};

	const availablePuzzles = PUZZLES_BY_DIFFICULTY[selectedDifficulty];

	const resumeState =
		activeGame && activeGamePuzzle
			? {
					message: `${t(activeGamePuzzle.titleKey as TranslationKey)} • ${t(`difficulty.${activeGamePuzzle.difficulty}` as TranslationKey)} • ${formatTime(activeGame.elapsedSeconds)} (${activeGame.moves} ${t('status.moves')})`,
					onResume: () => {
						window.location.href = `/nonogram/${language}/game?resume=true`;
					},
					buttonLabel: t('controls.resume'),
				}
			: undefined;

	const pageFooterLinks = [
		{ label: tCommon('navigation.rules'), href: `/nonogram/${language}/rules` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/nonogram/${language}/medals` },
	];

	const difficultyItems: SegmentedControlItem[] = DIFFICULTIES.map((diff) => ({
		id: diff,
		label: t(`difficulty.${diff}` as TranslationKey),
		sublabel: DIFFICULTY_SIZES[diff],
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="nonogram"
		>
			<SegmentedControl
				items={difficultyItems}
				value={selectedDifficulty}
				onChange={(diff) => handleDifficultyChange(diff as DifficultyId)}
				ariaLabel={t('difficulty.label')}
			/>

			<S.PuzzlesSection aria-labelledby="nonogram-puzzles-section-title">
				<h2 id="nonogram-puzzles-section-title">
					{t('lobby.selectPuzzle')} ({t(`difficulty.${selectedDifficulty}` as TranslationKey)})
				</h2>

				<S.PuzzlesGrid>
					{availablePuzzles.map((puz) => {
						const record = solvedRecords[puz.id];
						const isSolved = Boolean(record?.solved);

						const thumbVars: CSSProperties = {
							'--thumb-cols': puz.width,
							'--thumb-rows': puz.height,
							'--thumb-color': puz.color,
						} as CSSProperties;

						return (
							<GameSelectionCard
								key={puz.id}
								as="a"
								href={`/nonogram/${language}/game?difficulty=${selectedDifficulty}&puzzle=${puz.id}&new=true`}
								onClick={() => {
									saveLastConfig({ difficulty: selectedDifficulty, puzzleId: puz.id });
								}}
								title={t(puz.titleKey as TranslationKey)}
								dimensions={`${puz.width}×${puz.height}`}
								subtitle={
									record?.bestTime !== undefined
										? t('lobby.bestTime', { time: formatTime(record.bestTime) })
										: undefined
								}
								badge={
									isSolved
										? {
												label: t('lobby.completed'),
												variant: 'success',
											}
										: undefined
								}
								preview={
									<S.MiniThumbnail style={thumbVars} data-unsolved={!isSolved} aria-hidden="true">
										{isSolved ? (
											puz.grid.map((val, idx) => (
												<div key={`thumb-${puz.id}-${idx}`} data-filled={val === 1} />
											))
										) : (
											<PuzzleIcon />
										)}
									</S.MiniThumbnail>
								}
							/>
						);
					})}
				</S.PuzzlesGrid>
			</S.PuzzlesSection>
		</GameLandingTemplate>
	);
}

export function NonogramLobby({ lang }: NonogramLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
