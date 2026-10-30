import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, type ReactNode, useState } from 'react';
import { NONOGRAM_SETTINGS_CONFIG } from '../../config/settings';
import type { DifficultyId } from '../../engine/types';
import { NonogramBoard } from '../NonogramBoard';
import { NonogramControls } from '../NonogramControls';
import { PuzzleSelectDialog } from '../PuzzleSelectDialog';
import { VictoryDialog } from '../VictoryDialog';
import { useNonogramEngine } from './NonogramGame.hooks';
import * as S from './NonogramGame.styles';

export interface NonogramGameProps {
	initialDifficulty?: DifficultyId;
	initialPuzzleId?: string;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

export function NonogramGame({
	initialDifficulty = 'easy',
	initialPuzzleId,
	lang,
	rulesContent,
}: NonogramGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/nonogram\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('nonogram');
	const { t: tCommon } = useI18n('common');
	const game = useNonogramEngine(initialDifficulty, initialPuzzleId);

	const difficultyLabel = t(`difficulty.${game.puzzle.difficulty}` as 'difficulty.easy');

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/nonogram/${activeLang}/`}
					backLabel={t('victory.viewLobby')}
					difficulty={difficultyLabel}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} aria-label={`${t('status.moves')}: ${game.moves}`}>
						<span>
							{t('status.moves')}: {game.moves}
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

			<S.ControlsWrapper>
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
			</S.ControlsWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isGameOver && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleReset}
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
					config={NONOGRAM_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

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
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
