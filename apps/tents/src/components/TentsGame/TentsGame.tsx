import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameContainer } from '@arcade/lib-ui/components/GameContainer';
import { type JSX, useCallback, useState } from 'react';
import { PauseOverlay } from '../PauseOverlay/index.js';
import { SettingsDialog } from '../SettingsDialog/index.js';
import { TentsBoard } from '../TentsBoard/index.js';
import { TentsControls } from '../TentsControls/index.js';
import { TentsGameHeader } from '../TentsGameHeader/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useTentsGame } from './TentsGame.hooks.js';
import * as S from './TentsGame.styles.js';
import type { TentsGameProps } from './TentsGame.types.js';

export function TentsGame({ initialDifficulty = 'easy', initialPuzzleId, lang }: TentsGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/tents\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const { t: tCommon } = useI18n('common');
	const game = useTentsGame(initialDifficulty, initialPuzzleId);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/tents/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const content = (
		<GameContainer
			id="main-content"
			header={
				<TentsGameHeader
					difficulty={game.puzzle.difficulty}
					puzzleId={game.puzzle.id}
					placedTents={game.placedTents}
					totalTrees={game.totalTrees}
					satisfiedLines={game.evaluation.satisfiedLines}
					totalLines={game.evaluation.totalLines}
					elapsedSeconds={game.elapsedSeconds}
					mistakesCount={game.mistakesCount}
					isPaused={game.isPaused}
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
						movesCount={game.movesCount}
						isNewBestTime={game.isNewBestTime}
						hasNextPuzzle={game.hasNextPuzzle}
						onNextPuzzle={game.handleNextPuzzle}
						onPlayAgain={game.handlePlayAgain}
						onClose={game.closeVictory}
						difficulty={game.puzzle.difficulty}
					/>
				</>
			}
		>
			<S.PlayColumn>
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

				<S.GameFooter>
					<S.GameFooterLink href={`/tents/${activeLang}/medals`} aria-label={tCommon('navigation.medals')}>
						🏅 {tCommon('navigation.medals')}
					</S.GameFooterLink>
				</S.GameFooter>
			</S.PlayColumn>
		</GameContainer>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
