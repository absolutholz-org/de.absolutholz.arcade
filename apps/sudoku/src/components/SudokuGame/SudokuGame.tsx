import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameControls } from '@arcade/lib-ui';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, useState } from 'react';
import { SUDOKU_SETTINGS_CONFIG } from '../../config/settings';
import { SudokuBoard } from '../SudokuBoard/SudokuBoard';
import { SudokuKeypad } from '../SudokuKeypad/SudokuKeypad';
import { VictoryDialog } from '../VictoryDialog/VictoryDialog';
import { useSudokuGame } from './SudokuGame.hooks';
import * as S from './SudokuGame.styles';
import type { SudokuGameProps } from './SudokuGame.types';

export function SudokuGame({ initialDifficulty = 'easy', lang, rulesContent }: SudokuGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/sudoku\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('sudoku');
	const { t: tCommon } = useI18n('common');
	const game = useSudokuGame(initialDifficulty);

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/sudoku/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.difficulty}`)}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<S.StatusBar>
					<Timer
						variant="inline"
						seconds={game.elapsedSeconds}
						isPaused={game.isPaused}
						onTogglePause={game.handleTogglePause}
						size="sm"
						showIcon={true}
						aria-label={t('status.timer')}
					/>
				</S.StatusBar>
			}
			toolbar={
				<GameControls
					onUndo={game.handleUndo}
					canUndo={game.canUndo && !game.isPaused && !game.isComplete}
					onRedo={game.handleRedo}
					canRedo={game.canRedo && !game.isPaused && !game.isComplete}
					onRestart={game.handleRestart}
					canRestart={!game.isPaused && !game.isComplete}
					onNewGame={() => game.handleStartNewGame(game.difficulty)}
					canNewGame={!game.isPaused}
					hasActiveProgress={game.elapsedSeconds > 0 || game.canUndo}
					isComplete={game.isComplete}
				/>
			}
		>
			<SudokuBoard
				grid={game.grid}
				activeCell={game.activeCell}
				conflicts={game.conflicts}
				settings={game.settings}
				onSelectCell={game.selectCell}
			/>

			<S.KeypadWrapper>
				<SudokuKeypad
					digitCounts={game.digitCounts}
					isNotesMode={game.isNotesMode}
					layout="auto"
					onDigitPress={game.handleDigitPress}
					onToggleNotes={game.handleToggleNotes}
					onErase={game.handleErase}
				/>
			</S.KeypadWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleRestart}
			/>

			{/* In-game Rules Modal */}
			<GameRulesDialog isOpen={game.isRulesOpen} onClose={game.closeRules} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			{/* In-game Settings Modal (compact mode) */}
			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={SUDOKU_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.updateSettings}
				/>
			</GameSettingsDialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				difficulty={game.difficulty}
				isNewBestTime={game.isNewBestTime}
				onPlayAgain={() => game.handleStartNewGame(game.difficulty)}
				onClose={game.closeVictory}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
