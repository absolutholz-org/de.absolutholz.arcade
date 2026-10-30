import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
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
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					layout="auto"
					onDigitPress={game.handleDigitPress}
					onToggleNotes={game.handleToggleNotes}
					onErase={game.handleErase}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onRestart={game.handleRestart}
				/>
			</S.KeypadWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleRestart}
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
					config={SUDOKU_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.updateSettings}
				/>
			</Dialog>

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
