import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { type JSX, useCallback, useState } from 'react';
import { PauseOverlay } from '../PauseOverlay/index.js';
import { QueensBoard } from '../QueensBoard/index.js';
import { QueensControls } from '../QueensControls/index.js';
import { QueensGameHeader } from '../QueensGameHeader/index.js';
import { SettingsDialog } from '../SettingsDialog/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useQueensGame } from './QueensGame.hooks.js';
import * as S from './QueensGame.styles.js';
import type { QueensGameProps } from './QueensGame.types.js';

export function QueensGame({ initialDifficulty = 'easy', initialPuzzleId, lang }: QueensGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/queens\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const game = useQueensGame(initialDifficulty, initialPuzzleId);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/queens/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const content = (
		<S.GameRoot id="main-content">
			<QueensGameHeader
				difficulty={game.puzzle.difficulty}
				puzzleId={game.puzzle.id}
				tokenCount={game.tokenCount}
				totalTokens={game.puzzle.size}
				elapsedSeconds={game.elapsedSeconds}
				isPaused={game.isPaused}
				onTogglePause={game.handleTogglePause}
				onOpenSettings={game.openSettings}
			/>

			<S.GameViewport>
				<QueensBoard
					size={game.puzzle.size}
					regions={game.puzzle.regions}
					board={game.board}
					conflicts={game.conflicts}
					focusedCell={game.focusedCell}
					inputMode={game.inputMode}
					onCellClick={game.handleCellClick}
					onCellDoubleClick={game.handleCellDoubleClick}
					onCellContextMenu={game.handleCellContextMenu}
					onDragStart={game.handleDragStart}
					onDragEnter={game.handleDragEnter}
					onDragEnd={game.handleDragEnd}
					onKeyDown={game.handleKeyDown}
				/>

				<PauseOverlay
					isOpen={game.isPaused && !game.isComplete}
					onResume={game.handleTogglePause}
					onRestart={game.handlePlayAgain}
				/>

				<QueensControls
					inputMode={game.inputMode}
					autoCross={game.settings.autoCross}
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onToggleMode={game.setInputMode}
					onToggleAutoCross={game.handleToggleAutoCross}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.GameViewport>

			<SettingsDialog
				isOpen={game.isSettingsOpen}
				onClose={game.closeSettings}
				settings={game.settings}
				onUpdateSettings={game.setSettings}
				activeLanguage={activeLang}
				onLanguageChange={handleLanguageChange}
			/>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={game.hasNextPuzzle}
				onNextPuzzle={game.handleNextPuzzle}
				onPlayAgain={game.handlePlayAgain}
				onClose={game.closeVictory}
			/>
		</S.GameRoot>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
