import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameContainer } from '@arcade/lib-ui/components/GameContainer';
import { type JSX, useCallback, useState } from 'react';
import { HashiBoard } from '../HashiBoard/index.js';
import { HashiControls } from '../HashiControls/index.js';
import { HashiGameHeader } from '../HashiGameHeader/index.js';
import { PauseOverlay } from '../PauseOverlay/index.js';
import { SettingsDialog } from '../SettingsDialog/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useHashiGame } from './HashiGame.hooks.js';
import * as S from './HashiGame.styles.js';
import type { HashiGameProps } from './HashiGame.types.js';

export function HashiGame({ initialDifficulty = 'easy', initialPuzzleId, lang }: HashiGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/hashiwokakero\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const game = useHashiGame(initialDifficulty, initialPuzzleId);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/hashiwokakero/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const content = (
		<GameContainer
			id="main-content"
			header={
				<HashiGameHeader
					difficulty={game.board.difficulty}
					puzzleId={game.puzzleId}
					satisfiedCount={game.satisfiedCount}
					totalIslands={game.board.islands.length}
					elapsedSeconds={game.elapsedSeconds}
					isPaused={game.isPaused}
					gameMode={game.settings.gameMode}
					onTogglePause={game.handleTogglePause}
					onOpenSettings={game.openSettings}
				/>
			}
			overlay={
				<PauseOverlay
					isOpen={game.isPaused && !game.isComplete}
					onResume={game.handleTogglePause}
					onRestart={game.handlePlayAgain}
				/>
			}
			dialogs={
				<>
					<SettingsDialog
						isOpen={game.isSettingsOpen}
						onClose={game.closeSettings}
						settings={game.settings}
						onUpdateSettings={game.handleUpdateSettings}
						activeLanguage={activeLang}
						onLanguageChange={handleLanguageChange}
					/>

					<VictoryDialog
						isOpen={game.isVictoryOpen}
						elapsedSeconds={game.elapsedSeconds}
						isNewBestTime={game.isNewBestTime}
						hasNextPuzzle={true}
						onNextPuzzle={game.handleNextPuzzle}
						onPlayAgain={game.handlePlayAgain}
						onClose={game.closeVictory}
						gameMode={game.settings.gameMode}
					/>
				</>
			}
		>
			<S.PlayColumn>
				<HashiBoard
					board={game.board}
					selectedIslandId={game.selectedIslandId}
					focusedIslandId={game.focusedIslandId}
					highlightSatisfied={game.settings.highlightSatisfied}
					highlightOverflow={game.settings.highlightOverflow}
					getIslandEvaluation={game.getIslandEvaluation}
					onIslandClick={game.handleIslandClick}
					onIslandFocus={game.handleIslandFocus}
					onIslandKeyDown={game.handleIslandKeyDown}
					onBridgeClick={game.handleBridgeClick}
				/>

				<HashiControls
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.PlayColumn>
		</GameContainer>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
