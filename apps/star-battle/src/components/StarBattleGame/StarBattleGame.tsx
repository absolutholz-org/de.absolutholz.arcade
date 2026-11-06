import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, useState } from 'react';
import { STAR_BATTLE_SETTINGS_CONFIG } from '../../config/settings';
import { StarBattleBoard } from '../StarBattleBoard';
import { StarBattleControls } from '../StarBattleControls';
import { StarIcon } from '../StarBattleIcons';
import { VictoryDialog } from '../VictoryDialog';
import { useStarBattleGame } from './StarBattleGame.hooks';
import * as S from './StarBattleGame.styles';
import type { StarBattleGameProps } from './StarBattleGame.types';

export function StarBattleGame({
	initialDifficulty = 'easy',
	initialPuzzleId,
	lang,
	rulesContent,
}: StarBattleGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/star-battle\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('star-battle');
	const { t: tCommon } = useI18n('common');
	const game = useStarBattleGame(initialDifficulty, initialPuzzleId);

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/star-battle/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.puzzle.difficulty}`)}
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
						aria-label={t('status.tokensPlaced', {
							current: game.tokenCount,
							total: game.puzzle.size,
						})}
					>
						<StarIcon />
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
			<StarBattleBoard
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
				<StarBattleControls
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
			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={STAR_BATTLE_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</GameSettingsDialog>

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

export const QueensGame = StarBattleGame;
