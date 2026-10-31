import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { type JSX, type ReactNode, useCallback, useState } from 'react';
import { NET_SETTINGS_CONFIG } from '../../config/settings.ts';
import type { Cell, Difficulty } from '../../engine/types.ts';
import { NetCanvas } from '../NetCanvas/NetCanvas.tsx';
import { VictoryDialog } from '../VictoryDialog/index.ts';
import { useNetGame } from './NetGame.hooks.ts';
import * as S from './NetGame.styles.ts';

export interface NetGameProps {
	initialDifficulty?: Difficulty;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

function NetGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	initialDifficulty: Difficulty;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('net');
	const { t: tCommon } = useI18n('common');

	const formatLiveStatus = useCallback(
		(powered: number, total: number, moves: number) =>
			`${t('status.powered', { count: powered, total })}. ${t('status.moves', { moves })}`,
		[t],
	);

	const formatSolvedAnnouncement = useCallback(() => t('status.solved'), [t]);

	const game = useNetGame({
		initialDifficulty,
		formatLiveStatus,
		formatSolvedAnnouncement,
	});

	const getCellAriaLabel = useCallback(
		(cell: Cell) =>
			t('aria.cellLabel', {
				row: cell.row + 1,
				col: cell.col + 1,
				type: cell.isRoot ? 'Server' : 'Wire',
				powered: cell.isPowered
					? t('status.powered', { count: 1, total: 1 })
					: t('status.unconnected', { count: 1 }),
				locked: cell.isLocked ? t('status.locked') : t('status.unlocked'),
			}),
		[t],
	);

	const difficultyLabel = t(`difficulty.${game.difficulty}` as 'difficulty.easy');
	const totalCells = game.board.rows * game.board.cols;
	const poweredCount = game.validation.poweredCount;
	const statusText = game.isComplete
		? t('status.solved')
		: `${t('status.powered', { count: poweredCount, total: totalCells })} • ${t('status.moves', { moves: game.movesCount })}`;

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/net/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<div className={S.statusBar}>
					<span className={S.statusMetric} data-solved={game.isComplete ? 'true' : 'false'}>
						<span>{statusText}</span>
					</span>

					{!game.settings.casualMode && (
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
			<VisuallyHidden aria-live="polite" aria-atomic="true">
				{game.liveAnnouncement}
			</VisuallyHidden>

			<div className={S.boardArea}>
				<NetCanvas
					board={game.board}
					disabled={game.isPaused || game.isComplete}
					highlightPowered={game.settings.highlightPowered}
					ariaLabel={t('aria.board')}
					getCellAriaLabel={getCellAriaLabel}
					onRotateCW={game.handleRotateCW}
					onRotateCCW={game.handleRotateCCW}
					onToggleLock={game.handleToggleLock}
				/>
			</div>

			<S.ControlsWrapper>
				<Button variant="secondary" size="sm" onClick={game.handleUndo} disabled={!game.canUndo}>
					{t('controls.undo')}
				</Button>
				<Button variant="secondary" size="sm" onClick={game.handleRedo} disabled={!game.canRedo}>
					{t('controls.redo')}
				</Button>
				<Button variant="secondary" size="sm" onClick={game.handleReset} disabled={game.movesCount === 0}>
					{t('controls.reset')}
				</Button>
				<Button variant="primary" size="sm" onClick={() => game.handleNewPuzzle()}>
					{t('controls.newPuzzle')}
				</Button>
			</S.ControlsWrapper>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={() => game.handleNewPuzzle()}
			/>

			<Dialog
				isOpen={game.isRulesOpen}
				onCancel={game.closeRules}
				title={tCommon('navigation.rules')}
				showCloseButton={true}
			>
				{rulesContent ?? (
					<S.RulesContainer>
						<p>{t('description')}</p>
					</S.RulesContainer>
				)}
			</Dialog>

			<Dialog
				isOpen={game.isSettingsOpen}
				onCancel={game.closeSettings}
				title={t('settings.title')}
				showCloseButton={true}
			>
				<GameSettingsPanel
					config={NET_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				movesCount={game.movesCount}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={true}
				onNextPuzzle={() => game.handleNewPuzzle()}
				onPlayAgain={game.handleReset}
				onClose={game.closeVictory}
				gameMode={game.settings.casualMode ? 'casual' : 'standard'}
				difficulty={game.difficulty}
			/>
		</GameLayout>
	);
}

export function NetGame({ initialDifficulty = 'easy', lang, rulesContent }: NetGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/net\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<NetGameInner initialDifficulty={initialDifficulty} activeLang={activeLang} rulesContent={rulesContent} />
		</I18nProvider>
	);
}
