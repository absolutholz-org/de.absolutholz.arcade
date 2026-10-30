import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useState } from 'react';
import { TRACKS_SETTINGS_CONFIG } from '../../config/settings.js';
import { TracksBoard } from '../TracksBoard/index.js';
import { TracksControls } from '../TracksControls/index.js';
import { TrackStraightHorizontal } from '../TracksSvg/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useTracksGame } from './TracksGame.hooks.js';
import * as S from './TracksGame.styles.js';
import type { TracksGameProps } from './TracksGame.types.js';

export function TracksGame({
	initialDifficulty = 'easy',
	initialPuzzleId,
	lang,
	rulesContent,
}: TracksGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/tracks\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('tracks');
	const { t: tCommon } = useI18n('common');
	const game = useTracksGame(initialDifficulty, initialPuzzleId);

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tracks/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span
						className={S.statusMetric}
						aria-label={t('status.linesSatisfied', {
							current: game.evaluation.satisfiedLines,
							total: game.evaluation.totalLines,
						})}
					>
						<TrackStraightHorizontal />
						<span>
							{t('status.linesSatisfied', {
								current: game.evaluation.satisfiedLines,
								total: game.evaluation.totalLines,
							})}
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
			<div className={S.boardArea}>
				<TracksBoard
					board={game.board}
					evaluation={game.evaluation}
					focusedCell={game.focusedCell}
					highlightClues={game.settings.highlightClues}
					isComplete={game.isComplete}
					onCellClick={game.handleCellClick}
					onCellContextMenu={game.handleCellContextMenu}
					onCellFocus={game.handleCellFocus}
					onDragStart={game.handleDragStart}
					onDragEnter={game.handleDragEnter}
					onDragEnd={game.handleDragEnd}
					onClueClick={game.handleClueClick}
					onKeyDown={game.handleKeyDown}
				/>
			</div>

			<S.ControlsWrapper>
				<TracksControls
					inputMode={game.inputMode}
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onToggleMode={game.setInputMode}
					onHint={game.handleHint}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.ControlsWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handlePlayAgain}
			/>

			{/* In-game Rules Modal */}
			<Dialog
				isOpen={game.isRulesOpen}
				onCancel={game.closeRules}
				title={tCommon('navigation.rules')}
				showCloseButton={true}
			>
				{rulesContent}
			</Dialog>

			{/* In-game Settings Modal (compact mode) */}
			<Dialog
				isOpen={game.isSettingsOpen}
				onCancel={game.closeSettings}
				title={t('settings.title')}
				showCloseButton={true}
			>
				<GameSettingsPanel
					config={TRACKS_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				movesCount={game.movesCount}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={game.hasNextPuzzle}
				onNextPuzzle={game.handleNextPuzzle}
				onPlayAgain={game.handlePlayAgain}
				onClose={game.closeVictory}
				gameMode={game.settings.gameMode}
				difficulty={game.puzzle.difficulty}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
