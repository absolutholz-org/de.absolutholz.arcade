import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameHeader, GameLayout, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useState } from 'react';
import { SettingsDialog } from '../SettingsDialog/index.js';
import { TentsBoard } from '../TentsBoard/index.js';
import { TentsControls } from '../TentsControls/index.js';
import { TentIcon } from '../TentsIcons/index.js';
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
	const { t } = useI18n('tents');
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

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/tents/${activeLang}/`}
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
				difficulty={game.puzzle.difficulty}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
