import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { SegmentedControl, type SegmentedControlOption } from '@arcade/lib-ui/components/SegmentedControl';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, type ReactNode, useState } from 'react';
import { MINESWEEPER_SETTINGS_CONFIG } from '../../config/settings';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import { DefeatDialog } from '../DefeatDialog/DefeatDialog';
import { MinesweeperBoard } from '../MinesweeperBoard/MinesweeperBoard';
import { MineIcon } from '../MinesweeperIcons';
import { VictoryDialog } from '../VictoryDialog/VictoryDialog';
import { useMinesweeperGame } from './MinesweeperGame.hooks';
import * as S from './MinesweeperGame.styles';

export interface MinesweeperGameProps {
	initialSize?: BoardSizeId;
	initialDifficulty?: DifficultyId;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

export function MinesweeperGame({
	initialSize = 'md',
	initialDifficulty = 'medium',
	lang,
	rulesContent,
}: MinesweeperGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/minesweeper\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const { t } = useI18n('minesweeper');
	const { t: tCommon } = useI18n('common');
	const game = useMinesweeperGame(initialSize, initialDifficulty);

	const modeOptions: SegmentedControlOption[] = [
		{ value: 'reveal', label: t('controls.reveal') },
		{ value: 'flag', label: t('controls.flag') },
	];

	const content = (
		<GameLayout
			header={
				<GameHeader
					backHref={`/minesweeper/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.difficulty}`)}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} aria-label={`${game.minesLeft} ${t('status.minesLeft')}`}>
						<span aria-hidden="true">
							<MineIcon />
						</span>
						<span>{game.minesLeft}</span>
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

					<Button
						variant="ghost"
						size="sm"
						onClick={game.handleToggleFitToScreen}
						aria-label={game.settings.fitToScreen ? t('controls.zoomBoard') : t('controls.fitBoard')}
						title={game.settings.fitToScreen ? t('controls.zoomBoard') : t('controls.fitBoard')}
					>
						<Icon name={game.settings.fitToScreen ? 'search' : 'expand'} size="sm" />
					</Button>
				</div>
			}
		>
			<div className={S.boardArea}>
				<MinesweeperBoard
					columns={game.columns}
					rows={game.rows}
					cells={game.cells}
					isFitToScreen={game.settings.fitToScreen}
					focusedCell={game.focusedCell}
					isGameOver={game.isGameOver}
					isWon={game.isWon}
					onSetFocus={(col, row) => game.setFocusedCell({ col, row })}
					onReveal={game.handleReveal}
					onFlag={game.handleFlag}
					onChord={game.handleChord}
				/>
			</div>

			<S.ControlsContainer>
				<S.ModeRow>
					<SegmentedControl
						options={modeOptions}
						value={game.interactionMode}
						onChange={game.handleToggleInteractionMode}
						size="sm"
					/>
				</S.ModeRow>

				<S.ActionsRow>
					<S.ActionButton
						type="button"
						onClick={game.handleUndo}
						disabled={!game.canUndo}
						aria-label={tCommon('actions.undo')}
					>
						<Icon name="undo" size="sm" />
						<span>{tCommon('actions.undo')}</span>
					</S.ActionButton>

					<S.ActionButton
						type="button"
						onClick={game.handleRedo}
						disabled={!game.canRedo}
						aria-label={tCommon('actions.redo')}
					>
						<Icon name="redo" size="sm" />
						<span>{tCommon('actions.redo')}</span>
					</S.ActionButton>
				</S.ActionsRow>
			</S.ControlsContainer>

			<PauseDialog
				isOpen={game.isPaused && !game.isGameOver && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleRestart}
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
					config={MINESWEEPER_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

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
		</GameLayout>
	);

	return <I18nProvider language={activeLang}>{content}</I18nProvider>;
}
