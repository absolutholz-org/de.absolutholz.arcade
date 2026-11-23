import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Badge, GameControls, VictoryDialog } from '@arcade/lib-ui';
import { Button } from '@arcade/lib-ui/components/Button';
import { Confetti } from '@arcade/lib-ui/components/Confetti';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { useGameWakeLock } from '@arcade/lib-ui/hooks/useGameWakeLock';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type ReactNode, useState } from 'react';
import { LASERS_SETTINGS_CONFIG } from '../../config/settings';
import type { CellCoord, Difficulty } from '../../engine/types';
import { LasersBoard } from '../LasersBoard/LasersBoard';
import { useLasersGame } from './LasersGame.hooks';
import * as S from './LasersGame.styles';

export interface LasersGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function LasersGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('lasers');
	const { t: tCommon } = useI18n('common');
	const game = useLasersGame(initialDifficulty);
	const wakeLock = useGameWakeLock(LASERS_SETTINGS_CONFIG, !game.isPaused && !game.isSolved, game.settings);

	const handleRotateWithAnnouncement = (coord: CellCoord) => {
		const outcome = game.handleRotateCell(coord);
		if (!outcome.rotated) return;

		if (outcome.isSolved) {
			game.setLiveAnnouncement(t('status.solved', { total: outcome.totalTargets }));
			return;
		}

		const orientationLabel =
			outcome.orientation === '/' ? t('orientations.forwardSlash') : t('orientations.backslash');
		const statusKey = outcome.kind === 'splitter' ? 'status.splitterRotated' : 'status.mirrorRotated';
		game.setLiveAnnouncement(
			t(statusKey, {
				orientation: orientationLabel,
				lit: outcome.litTargets,
				total: outcome.totalTargets,
			}),
		);
	};

	const handleHintWithAnnouncement = () => {
		const outcome = game.handleHint();
		if (!outcome.applied) {
			game.setLiveAnnouncement(t('status.noHintNeeded'));
			return;
		}
		if (outcome.isSolved) {
			game.setLiveAnnouncement(t('status.solved', { total: outcome.totalTargets }));
			return;
		}
		game.setLiveAnnouncement(
			t('status.hintApplied', {
				row: outcome.row + 1,
				col: outcome.col + 1,
			}),
		);
	};

	const handleUndoWithAnnouncement = () => {
		game.handleUndo();
		game.setLiveAnnouncement(t('status.undone'));
	};

	const handleRedoWithAnnouncement = () => {
		game.handleRedo();
		game.setLiveAnnouncement(t('status.redone'));
	};

	const handleResetWithAnnouncement = () => {
		game.handleReset();
		game.setLiveAnnouncement(t('status.boardReset'));
	};

	const achievedPar = game.isSolved && game.movesCount <= game.puzzle.parMoves && game.hintsUsed === 0;
	const statusState = game.isSolved ? 'solved' : 'default';

	const victoryStats = [
		{ label: t('victory.parMoves'), value: game.puzzle.parMoves },
		{ label: t('victory.hintsUsed'), value: game.hintsUsed },
		...(achievedPar ? [{ label: t('hud.par'), value: t('victory.parBadge') }] : []),
	];

	return (
		<GameLayout
			containerWidth="wide"
			header={
				<GameHeader
					backHref={`/lasers/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={t(`difficulty.${game.difficulty}`)}
					onOpenRules={game.openRules}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={game.openSettings}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<GameStatusStrip
					statusState={statusState}
					elapsedSeconds={game.elapsedSeconds}
					isPaused={game.isPaused}
					onTogglePause={game.handleTogglePause}
				>
					<S.HudMetrics>
						<S.MetricItem>
							<span>{t('hud.targets')}:</span>
							<S.MetricValue data-highlight={game.isSolved}>
								{game.trace.litTargetCount}/{game.trace.totalTargetCount}
							</S.MetricValue>
						</S.MetricItem>
						<S.MetricItem>
							<span>{t('hud.moves')}:</span>
							<S.MetricValue>{game.movesCount}</S.MetricValue>
						</S.MetricItem>
						{game.settings.showParCounter && (
							<Badge
								tone={game.movesCount <= game.puzzle.parMoves ? 'accent' : 'neutral'}
								size="sm"
								tabular
							>
								{t('hud.par')} {game.puzzle.parMoves}
							</Badge>
						)}
					</S.HudMetrics>
				</GameStatusStrip>
			}
			toolbar={
				<GameControls
					onUndo={handleUndoWithAnnouncement}
					canUndo={game.canUndo && !game.isPaused && !game.isSolved}
					onRedo={handleRedoWithAnnouncement}
					canRedo={game.canRedo && !game.isPaused && !game.isSolved}
					onRestart={handleResetWithAnnouncement}
					canRestart={!game.isPaused && (game.movesCount > 0 || game.isSolved)}
					onNewGame={() => {
						void game.startNewPuzzle(game.difficulty);
					}}
					canNewGame={!game.isPaused}
					hasActiveProgress={game.movesCount > 0}
					isComplete={game.isSolved}
				>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						disabled={game.isPaused || game.isSolved}
						onClick={handleHintWithAnnouncement}
					>
						{t('controls.hint')}
					</Button>
				</GameControls>
			}
		>
			<S.PlayfieldStack>
				<LasersBoard
					grid={game.grid}
					trace={game.trace}
					showColorSymbols={game.settings.showColorSymbols}
					isPaused={game.isPaused}
					isSolved={game.isSolved}
					focusedCoord={game.focusedCoord}
					hintedCoord={game.hintedCoord}
					onFocusCoord={game.setFocusedCoord}
					onRotateCell={handleRotateWithAnnouncement}
					onUndo={handleUndoWithAnnouncement}
					onRedo={handleRedoWithAnnouncement}
					onHint={handleHintWithAnnouncement}
					onTogglePause={game.handleTogglePause}
				/>
			</S.PlayfieldStack>

			{game.isSolved && game.isVictoryOpen && <Confetti particleCount={100} />}

			<S.LiveRegion aria-live="polite" aria-atomic="true">
				{game.liveAnnouncement}
			</S.LiveRegion>

			<PauseDialog
				isOpen={game.isPaused && !game.isSolved && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={handleResetWithAnnouncement}
			/>

			<GameRulesDialog isOpen={game.isRulesOpen} onClose={game.closeRules} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={LASERS_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.updateSettings}
					wakeLockActive={wakeLock.isActive}
				/>
			</GameSettingsDialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				onClose={game.closeVictory}
				title={t('victory.title')}
				message={t('victory.message')}
				elapsedSeconds={game.elapsedSeconds}
				movesCount={game.movesCount}
				movesLabel={t('victory.moves')}
				stats={victoryStats}
				hasNextPuzzle
				onNextPuzzle={() => {
					void game.startNewPuzzle(game.difficulty);
				}}
				nextPuzzleLabel={t('victory.nextPuzzle')}
				onPlayAgain={handleResetWithAnnouncement}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/lasers/${activeLang}/stats`}
				medalsHref={`/lasers/${activeLang}/medals`}
				lobbyHref={`/lasers/${activeLang}/`}
				lobbyLabel={t('controls.backToLobby')}
			/>
		</GameLayout>
	);
}

export function LasersGame({ initialDifficulty = 'easy', lang, rulesContent }: LasersGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/lasers\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<LasersGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
