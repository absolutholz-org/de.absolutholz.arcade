import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { useCallback, useState } from 'react';
import { PauseOverlay } from '../PauseOverlay/PauseOverlay';
import { SettingsDialog } from '../SettingsDialog/SettingsDialog';
import { SudokuBoard } from '../SudokuBoard/SudokuBoard';
import { SudokuGameHeader } from '../SudokuGameHeader/SudokuGameHeader';
import { SudokuKeypad } from '../SudokuKeypad/SudokuKeypad';
import { VictoryDialog } from '../VictoryDialog/VictoryDialog';
import { useSudokuGame } from './SudokuGame.hooks';
import * as S from './SudokuGame.styles';
import type { SudokuGameProps } from './SudokuGame.types';

export function SudokuGame({ initialDifficulty = 'easy', lang }: SudokuGameProps) {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/sudoku\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const game = useSudokuGame(initialDifficulty);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/sudoku/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const content = (
		<S.GameRoot id="main-content">
			<SudokuGameHeader
				difficulty={game.difficulty}
				elapsedSeconds={game.elapsedSeconds}
				isPaused={game.isPaused}
				onTogglePause={game.handleTogglePause}
				onOpenSettings={game.openSettings}
			/>

			<S.BoardWrapper>
				<SudokuBoard
					grid={game.grid}
					activeCell={game.activeCell}
					conflicts={game.conflicts}
					settings={game.settings}
					onSelectCell={game.selectCell}
				/>

				<PauseOverlay
					isOpen={game.isPaused && !game.isComplete}
					onResume={game.handleTogglePause}
					onRestart={game.handleRestart}
				/>
			</S.BoardWrapper>

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
			/>

			<SettingsDialog
				isOpen={game.isSettingsOpen}
				onClose={game.closeSettings}
				settings={game.settings}
				onUpdateSettings={game.updateSettings}
				activeLanguage={activeLang}
				onLanguageChange={handleLanguageChange}
			/>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				difficulty={game.difficulty}
				isNewBestTime={game.isNewBestTime}
				onPlayAgain={() => game.handleStartNewGame(game.difficulty)}
				onClose={game.closeVictory}
			/>
		</S.GameRoot>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
