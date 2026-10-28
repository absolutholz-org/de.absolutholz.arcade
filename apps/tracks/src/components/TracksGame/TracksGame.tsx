import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameHeader, GameLayout, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useState } from 'react';
import { SettingsDialog } from '../SettingsDialog/index.js';
import { TracksBoard } from '../TracksBoard/index.js';
import { TracksControls } from '../TracksControls/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useTracksGame } from './TracksGame.hooks.js';
import * as S from './TracksGame.styles.js';
import type { TracksGameProps } from './TracksGame.types.js';

export function TracksGame({ initialDifficulty = 'easy', initialPuzzleId, lang }: TracksGameProps): JSX.Element {
	const [activeLang, setActiveLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/tracks\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { changeLanguage } = useI18n();
	const { t } = useI18n('tracks');
	const { t: tCommon } = useI18n('common');
	const game = useTracksGame(initialDifficulty, initialPuzzleId);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			setActiveLang(nextLang);
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const targetPath =
					activeLang && currentPath.includes(`/${activeLang}`)
						? currentPath.replace(new RegExp(`/${activeLang}(/|$)`), `/${nextLang}$1`)
						: `/tracks/${nextLang}/game`;
				window.history.replaceState(null, '', targetPath + window.location.search);
			}
		},
		[activeLang, changeLanguage],
	);

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tracks/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
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
			<S.PlayColumn>
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
			</S.PlayColumn>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete}
				onResume={game.handleTogglePause}
				onRestart={game.handlePlayAgain}
			/>

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
				gameMode={game.settings.gameMode}
				difficulty={game.puzzle.difficulty}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
