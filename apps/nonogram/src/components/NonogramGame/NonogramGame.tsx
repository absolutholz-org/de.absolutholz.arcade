import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameHeader, GameLayout, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useState } from 'react';
import type { DifficultyId } from '../../engine/types';
import { NonogramBoard } from '../NonogramBoard';
import { NonogramControls } from '../NonogramControls';
import { PuzzleSelectDialog } from '../PuzzleSelectDialog';
import { SettingsDialog } from '../SettingsDialog';
import { VictoryDialog } from '../VictoryDialog';
import { useNonogramEngine } from './NonogramGame.hooks';
import * as S from './NonogramGame.styles';

export interface NonogramGameProps {
	initialDifficulty?: DifficultyId;
	initialPuzzleId?: string;
	lang?: SupportedLanguageCode;
}

export function NonogramGame({ initialDifficulty = 'easy', initialPuzzleId, lang }: NonogramGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/nonogram\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const { t } = useI18n('nonogram');
	const game = useNonogramEngine(initialDifficulty, initialPuzzleId);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/nonogram/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/nonogram/${activeLang}/`}
					backLabel={t('victory.viewLobby')}
					difficulty={difficultyLabel}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} aria-label={`${t('status.moves')}: ${game.moves}`}>
						<span>
							{t('status.moves')}: {game.moves}
						</span>
					</span>
					<Timer
						variant="inline"
						seconds={game.elapsedSeconds}
						isPaused={game.isPaused}
						onTogglePause={game.handleTogglePause}
						size="sm"
						showIcon={true}
						aria-label={t('status.timer')}
					/>
				</div>
			}
		>
			<NonogramBoard
				puzzle={game.puzzle}
				cells={game.cells}
				focusedCell={game.focusedCell}
				isGameOver={game.isGameOver}
				isWon={game.isWon}
				interactionMode={game.interactionMode}
				onApplyStroke={game.handleApplyStroke}
				onSetFocus={(col, row) => game.setFocusedCell({ col, row })}
				onToggleCell={game.handleToggleCell}
				onUndo={game.handleUndo}
				onRedo={game.handleRedo}
			/>

			<S.ControlsWrapper>
				<NonogramControls
					interactionMode={game.interactionMode}
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onToggleMode={game.handleToggleMode}
					onSetMode={game.setInteractionMode}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.ControlsWrapper>

			<PauseDialog isOpen={game.isPaused} onResume={game.handleTogglePause} onRestart={game.handleReset} />

			<SettingsDialog
				isOpen={game.isSettingsOpen}
				onClose={game.closeSettings}
				settings={game.settings}
				onUpdateSettings={game.handleUpdateSettings}
				activeLanguage={activeLang}
				onLanguageChange={handleLanguageChange}
			/>

			<PuzzleSelectDialog
				isOpen={game.isPuzzleSelectOpen}
				activePuzzleId={game.puzzle.id}
				solvedRecords={game.solvedRecords}
				onSelectPuzzle={game.handleSelectPuzzle}
				onClose={game.closePuzzleSelect}
			/>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				puzzle={game.puzzle}
				elapsedSeconds={game.elapsedSeconds}
				moves={game.moves}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={game.hasNextPuzzle}
				onPlayAgain={game.handleReset}
				onNextPuzzle={game.handleNextPuzzle}
				onOpenPuzzleSelect={game.openPuzzleSelect}
				onClose={game.closeVictory}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
