import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameHeader, GameLayout, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useState } from 'react';
import { QueensBoard } from '../QueensBoard';
import { QueensControls } from '../QueensControls';
import { CrownIcon } from '../QueensIcons';
import { SettingsDialog } from '../SettingsDialog';
import { VictoryDialog } from '../VictoryDialog';
import { useQueensGame } from './QueensGame.hooks';
import * as S from './QueensGame.styles';
import type { QueensGameProps } from './QueensGame.types';

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
	const { t } = useI18n('queens');
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
		<GameLayout
			header={
				<GameHeader
					backHref={`/queens/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.puzzle.difficulty}`)}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span
						className={S.statusMetric}
						aria-label={t('status.tokensPlaced', {
							current: game.tokenCount,
							total: game.puzzle.size,
						})}
					>
						<CrownIcon />
						<span>
							{game.tokenCount} / {game.puzzle.size}
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
				onCellFocus={game.handleCellFocus}
				onDragStart={game.handleDragStart}
				onDragEnter={game.handleDragEnter}
				onDragEnd={game.handleDragEnd}
				onKeyDown={game.handleKeyDown}
			/>

			<S.ControlsWrapper>
				<QueensControls
					inputMode={game.inputMode}
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onToggleMode={game.setInputMode}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.ControlsWrapper>

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
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={game.hasNextPuzzle}
				onNextPuzzle={game.handleNextPuzzle}
				onPlayAgain={game.handlePlayAgain}
				onClose={game.closeVictory}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
