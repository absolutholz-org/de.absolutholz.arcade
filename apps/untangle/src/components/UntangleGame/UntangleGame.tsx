import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Button, Dialog, GameHeader, GameLayout, GameSettingsPanel, Icon, PauseDialog, Toolbar } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { type JSX, type ReactNode, useCallback, useState } from 'react';
import { UntangleCanvas } from '../UntangleCanvas/UntangleCanvas.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { type DifficultyLevel, UNTANGLE_SETTINGS_CONFIG, useUntangleGame } from './UntangleGame.hooks.js';
import * as S from './UntangleGame.styles.js';

export interface UntangleGameProps {
	initialDifficulty?: DifficultyLevel;
	initialSeed?: string | number;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

function UntangleGameInner({
	initialDifficulty = 'easy',
	initialSeed,
	activeLang,
	rulesContent,
}: {
	initialDifficulty: DifficultyLevel;
	initialSeed?: string | number;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('untangle');
	const { t: tCommon } = useI18n('common');

	const formatLiveCrossings = useCallback(
		(count: number, moves: number) => t('status.liveCrossings', { count, moves }),
		[t],
	);

	const formatSolvedAnnouncement = useCallback(() => t('status.solvedAnnouncement'), [t]);

	const game = useUntangleGame({
		initialDifficulty,
		initialSeed,
		formatLiveCrossings,
		formatSolvedAnnouncement,
	});

	const getNodeAriaLabel = useCallback(
		(index: number, connections: number, crossings: number) =>
			t('status.nodeAriaLabel', {
				index: index + 1,
				connections,
				crossings,
			}),
		[t],
	);

	const difficultyLabel = t(`difficulty.${game.board.difficulty}` as 'difficulty.easy');
	const crossingCount = game.intersectionSummary.intersectionCount;
	const crossingsLabel =
		crossingCount === 0 ? t('status.crossingsZero') : t('status.crossings', { count: crossingCount });
	const boardAriaLabel = t('aria.board');

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/untangle/${activeLang}/`}
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
					{game.settings.showCrossingCounter && (
						<span
							className={S.statusMetric}
							data-intersecting={crossingCount > 0 ? 'true' : 'false'}
							data-solved={game.isComplete ? 'true' : 'false'}
							aria-label={crossingsLabel}
						>
							<span>{crossingsLabel}</span>
						</span>
					)}

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
				<UntangleCanvas
					vertices={game.board.vertices}
					edges={game.board.edges}
					intersectingEdgeKeys={game.intersectingEdgeKeys}
					nodeCrossingCounts={game.intersectionSummary.nodeCrossingCounts}
					nodeDegreeCounts={game.intersectionSummary.nodeDegreeCounts}
					selectedVertexId={game.selectedVertexId}
					draggingVertexId={game.draggingVertexId}
					highlightCrossings={game.settings.highlightIntersectingEdges}
					disabled={game.isPaused || game.isComplete}
					ariaLabel={boardAriaLabel}
					getNodeAriaLabel={getNodeAriaLabel}
					onSelectVertex={game.handleSelectVertex}
					onDragStart={game.handleDragStart}
					onDragMove={game.handleDragMove}
					onDragEnd={game.handleDragEnd}
					onKeyNudge={game.handleKeyNudge}
				/>
			</div>

			<Toolbar fullWidth variant="ghost" size="sm" align="center" aria-label={t('aria.actionsToolbar')}>
				<Button
					variant="secondary"
					size="sm"
					leadingIcon={<Icon name="undo" size="sm" />}
					onClick={game.handleUndo}
					disabled={!game.canUndo}
				>
					{t('controls.undo')}
				</Button>
				<Button
					variant="secondary"
					size="sm"
					leadingIcon={<Icon name="redo" size="sm" />}
					onClick={game.handleRedo}
					disabled={!game.canRedo}
				>
					{t('controls.redo')}
				</Button>
				<Button
					variant="secondary"
					size="sm"
					leadingIcon={<Icon name="rotate-ccw" size="sm" />}
					onClick={game.handleReset}
					disabled={game.board.moveCount === 0}
				>
					{t('controls.reset')}
				</Button>
				<Button
					variant="secondary"
					size="sm"
					leadingIcon={<Icon name="sparkles" size="sm" />}
					onClick={() => game.handleNewPuzzle()}
				>
					{t('controls.newPuzzle')}
				</Button>
			</Toolbar>

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
					config={UNTANGLE_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.handleUpdateSettings}
				/>
			</Dialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				elapsedSeconds={game.elapsedSeconds}
				movesCount={game.board.moveCount}
				isNewBestTime={game.isNewBestTime}
				hasNextPuzzle={true}
				onNextPuzzle={() => game.handleNewPuzzle()}
				onPlayAgain={game.handleReset}
				onClose={game.closeVictory}
				gameMode={game.settings.gameMode}
				difficulty={game.board.difficulty}
			/>
		</GameLayout>
	);
}

export function UntangleGame({
	initialDifficulty = 'easy',
	initialSeed,
	lang,
	rulesContent,
}: UntangleGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/untangle\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<UntangleGameInner
				initialDifficulty={initialDifficulty}
				initialSeed={initialSeed}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
