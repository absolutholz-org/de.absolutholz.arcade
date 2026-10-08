import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import { DefeatDialog } from '../DefeatDialog';
import { MinesweeperBoard } from '../MinesweeperBoard';
import { MinesweeperGameHeader } from '../MinesweeperGameHeader';
import { PauseOverlay } from '../PauseOverlay';
import { SettingsDialog } from '../SettingsDialog';
import { VictoryDialog } from '../VictoryDialog';
import { useMinesweeperGame } from './MinesweeperGame.hooks';
import * as S from './MinesweeperGame.styles';

export interface MinesweeperGameProps {
	initialSize?: BoardSizeId;
	initialDifficulty?: DifficultyId;
	lang?: SupportedLanguageCode;
}

export function MinesweeperGame({
	initialSize = 'md',
	initialDifficulty = 'medium',
	lang,
}: MinesweeperGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/minesweeper\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const game = useMinesweeperGame(initialSize, initialDifficulty);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/minesweeper/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const content = (
		<main className={S.gameRoot} id="main-content">
			<MinesweeperGameHeader
				size={game.size}
				difficulty={game.difficulty}
				minesLeft={game.minesLeft}
				elapsedSeconds={game.elapsedSeconds}
				isPaused={game.isPaused}
				interactionMode={game.interactionMode}
				fitToScreen={game.settings.fitToScreen}
				onTogglePause={game.handleTogglePause}
				onRestart={game.handleRestart}
				onOpenSettings={game.openSettings}
				onToggleInteractionMode={game.handleToggleInteractionMode}
				onToggleFitToScreen={game.handleToggleFitToScreen}
			/>

			<div className={S.boardArea}>
				<MinesweeperBoard
					cells={game.cells}
					columns={game.columns}
					rows={game.rows}
					focusedCell={game.focusedCell}
					isGameOver={game.isGameOver}
					isWon={game.isWon}
					isFitToScreen={game.settings.fitToScreen}
					onReveal={game.handleReveal}
					onFlag={game.handleFlag}
					onChord={game.handleChord}
					onSetFocus={(col, row) => game.setFocusedCell({ col, row })}
				/>

				<PauseOverlay isOpen={game.isPaused} onResume={game.handleTogglePause} onRestart={game.handleRestart} />
			</div>

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
				size={game.size}
				difficulty={game.difficulty}
				rankPosition={game.rankPosition}
				onPlayAgain={game.handleRestart}
				onClose={game.closeVictory}
			/>

			<DefeatDialog isOpen={game.isDefeatOpen} onPlayAgain={game.handleRestart} onClose={game.closeDefeat} />
		</main>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
