import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useState } from 'react';
import { TENTS_SETTINGS_CONFIG } from '../../config/settings.js';
import { TentsBoard } from '../TentsBoard/index.js';
import { TentsControls } from '../TentsControls/index.js';
import { TentIcon } from '../TentsIcons/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useTentsGame } from './TentsGame.hooks.js';
import * as S from './TentsGame.styles.js';
import type { TentsGameProps } from './TentsGame.types.js';

export function TentsGame({
	initialDifficulty = 'easy',
	initialPuzzleId,
	lang,
	rulesContent,
}: TentsGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/tents\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('tents');
	const { t: tCommon } = useI18n('common');
	const game = useTentsGame(initialDifficulty, initialPuzzleId);

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tents/${activeLang}/`}
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
						aria-label={t('status.tentsRemaining', {
							current: game.placedTents,
							total: game.totalTrees,
						})}
					>
						<TentIcon />
						<span>
							{t('status.tentsRemaining', {
								current: game.placedTents,
								total: game.totalTrees,
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
				<TentsBoard
					board={game.board}
					evaluation={game.evaluation}
					focusedCell={game.focusedCell}
					highlightViolations={game.settings.highlightViolations}
					highlightClues={game.settings.highlightClues}
					isComplete={game.isComplete}
					onCellClick={game.handleCellClick}
					onCellContextMenu={game.handleCellContextMenu}
					onCellFocus={game.handleCellFocus}
					onClueClick={game.handleClueClick}
					onKeyDown={game.handleKeyDown}
				/>
			</div>

			<S.ControlsWrapper>
				<TentsControls
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
					config={TENTS_SETTINGS_CONFIG}
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
				difficulty={game.puzzle.difficulty}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
