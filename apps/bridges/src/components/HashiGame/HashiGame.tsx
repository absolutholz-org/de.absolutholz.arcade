import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useState } from 'react';
import { BRIDGES_SETTINGS_CONFIG } from '../../config/settings.js';
import { HashiBoard } from '../HashiBoard/index.js';
import { HashiControls } from '../HashiControls/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useHashiGame } from './HashiGame.hooks.js';
import * as S from './HashiGame.styles.js';
import type { HashiGameProps } from './HashiGame.types.js';

function BridgeStatusIcon(): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="12" r="3" />
			<line x1="9" y1="12" x2="15" y2="12" />
		</svg>
	);
}

export function HashiGame({
	initialDifficulty = 'easy',
	initialPuzzleId,
	lang,
	rulesContent,
}: HashiGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/bridges\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('bridges');
	const { t: tCommon } = useI18n('common');
	const game = useHashiGame(initialDifficulty, initialPuzzleId);

	const difficultyLabel = t(`difficulty.${game.board.difficulty}`);

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/bridges/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					onBackClick={() => game.recordSurrender()}
					difficulty={difficultyLabel}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span
						className={S.statusMetric}
						aria-label={`${t('status.satisfiedIslands')}: ${game.satisfiedCount} / ${game.board.islands.length}`}
					>
						<BridgeStatusIcon />
						<span>
							{game.satisfiedCount} / {game.board.islands.length}
						</span>
					</span>
					{game.settings.gameMode === 'standard' && (
						<Timer
							variant="inline"
							seconds={game.elapsedSeconds}
							isPaused={game.isPaused}
							onTogglePause={game.handleTogglePause}
							size="sm"
							showIcon={true}
							aria-label={t('status.timer')}
						/>
					)}
				</div>
			}
		>
			<div className={S.boardArea}>
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
			</div>

			<S.ControlsWrapper>
				<HashiControls
					canUndo={game.canUndo}
					canRedo={game.canRedo}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onReset={game.handleReset}
				/>
			</S.ControlsWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handlePlayAgain}
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
					config={BRIDGES_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={game.hasNextPuzzle}
				onNextPuzzle={game.handleNextPuzzle}
				onPlayAgain={game.handlePlayAgain}
				onClose={game.closeVictory}
				gameMode={game.settings.gameMode}
				difficulty={game.board.difficulty}
			/>
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
