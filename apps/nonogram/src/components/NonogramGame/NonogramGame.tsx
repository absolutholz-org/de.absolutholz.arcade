import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import type { DifficultyId } from '../../engine/types';
import { NonogramBoard } from '../NonogramBoard';
import { NonogramControls } from '../NonogramControls';
import { NonogramGameHeader } from '../NonogramGameHeader';
import { PauseOverlay } from '../PauseOverlay';
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

	const content = (
		<S.GameRoot id="main-content">
			<NonogramGameHeader
				puzzle={game.puzzle}
				elapsedSeconds={game.elapsedSeconds}
				moves={game.moves}
				isPaused={game.isPaused}
				onTogglePause={game.handleTogglePause}
				onOpenPuzzleSelect={game.openPuzzleSelect}
				onOpenSettings={game.openSettings}
				onReset={game.handleReset}
			/>

			<S.BoardArea>
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

				<PauseOverlay isOpen={game.isPaused} onResume={game.handleTogglePause} onRestart={game.handleReset} />
			</S.BoardArea>

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
		</S.GameRoot>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
