import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameControls, VictoryDialog } from '@arcade/lib-ui';
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
import { CASCADE_SETTINGS_CONFIG } from '../../config/settings';
import { type CellCoord, type Difficulty, MEGA_CLUSTER_THRESHOLD, PERFECT_CLEAR_BONUS } from '../../engine/types';
import { CascadeBoard } from '../CascadeBoard/CascadeBoard';
import { useCascadeGame } from './CascadeGame.hooks';
import * as S from './CascadeGame.styles';

export interface CascadeGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function CascadeGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('cascade');
	const { t: tCommon } = useI18n('common');
	const game = useCascadeGame(initialDifficulty);
	const wakeLock = useGameWakeLock(CASCADE_SETTINGS_CONFIG, !game.isPaused && !game.isGameOver, game.settings);

	const handleActivateCellWithAnnouncement = (coord: CellCoord) => {
		const outcome = game.handleActivateCell(coord);
		if (outcome.action === 'selected') {
			game.setLiveAnnouncement(
				t('status.clusterSelected', {
					count: outcome.clusterSize,
					points: outcome.points.toLocaleString(),
				}),
			);
		} else if (outcome.action === 'isolated') {
			game.setLiveAnnouncement(t('status.isolatedTile'));
		} else if (outcome.action === 'cleared') {
			if (outcome.isPerfectClear) {
				game.setLiveAnnouncement(t('status.perfectClear'));
			} else if (outcome.isGameOver) {
				game.setLiveAnnouncement(t('status.noMovesLeft', { score: outcome.finalScore.toLocaleString() }));
			} else if (outcome.clusterSize >= MEGA_CLUSTER_THRESHOLD) {
				game.setLiveAnnouncement(
					t('status.megaClusterCleared', {
						count: outcome.clusterSize,
						points: outcome.points.toLocaleString(),
					}),
				);
			} else {
				game.setLiveAnnouncement(
					t('status.clusterCleared', {
						count: outcome.clusterSize,
						points: outcome.points.toLocaleString(),
						remaining: outcome.remaining,
					}),
				);
			}
		}
	};

	const handleUndoWithAnnouncement = () => {
		game.handleUndo();
		game.setLiveAnnouncement(t('status.undone'));
	};

	const handleRedoWithAnnouncement = () => {
		game.handleRedo();
		game.setLiveAnnouncement(t('status.redone'));
	};

	const statusState = game.isPerfectClear ? 'solved' : game.isGameOver ? 'warning' : 'default';

	const victoryStats = [
		{ label: t('victory.finalScore'), value: game.score.toLocaleString() },
		{
			label: game.isNewHighScore ? t('victory.newHighScore') : t('victory.highScore'),
			value: game.highScore.toLocaleString(),
		},
		...(game.isPerfectClear
			? [{ label: t('victory.perfectBonus'), value: `+${PERFECT_CLEAR_BONUS.toLocaleString()}` }]
			: [{ label: t('victory.tilesRemaining'), value: game.remainingTiles }]),
		{ label: t('victory.largestCluster'), value: game.maxClusterCleared },
	];

	return (
		<GameLayout
			containerWidth="wide"
			header={
				<GameHeader
					backHref={`/cascade/${activeLang}/`}
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
							<span>{t('hud.score')}:</span>
							<S.MetricValue>{game.score.toLocaleString()}</S.MetricValue>
						</S.MetricItem>
						<S.MetricItem>
							<span>{t('hud.tilesLeft')}:</span>
							<S.MetricValue>{game.remainingTiles}</S.MetricValue>
						</S.MetricItem>
					</S.HudMetrics>
				</GameStatusStrip>
			}
			toolbar={
				<GameControls
					onUndo={handleUndoWithAnnouncement}
					canUndo={game.canUndo && !game.isPaused && !game.isGameOver}
					onRedo={handleRedoWithAnnouncement}
					canRedo={game.canRedo && !game.isPaused && !game.isGameOver}
					onRestart={game.handleRestart}
					canRestart={!game.isPaused && !game.isGameOver}
					onNewGame={() => {
						void game.handleStartNewGame(game.difficulty);
					}}
					canNewGame={!game.isPaused}
					hasActiveProgress={game.movesCount > 0}
					isComplete={game.isGameOver}
				/>
			}
		>
			<S.PlayfieldStack>
				<CascadeBoard
					board={game.board}
					selectedCluster={game.selectedCluster}
					hoveredCluster={game.hoveredCluster}
					orphanTiles={game.orphanTiles}
					previewPoints={game.previewPoints}
					showTileSymbols={game.settings.showTileSymbols}
					showHoverPreview={game.settings.showHoverPreview}
					isPaused={game.isPaused}
					isGameOver={game.isGameOver}
					focusedCoord={game.focusedCoord}
					lastBurst={game.lastBurst}
					onFocusCoord={game.setFocusedCoord}
					onHoverCell={game.handleHoverCell}
					onActivateCell={handleActivateCellWithAnnouncement}
					onClearSelection={game.handleClearSelection}
					onUndo={handleUndoWithAnnouncement}
					onRedo={handleRedoWithAnnouncement}
					onTogglePause={game.handleTogglePause}
				/>
			</S.PlayfieldStack>

			{game.isPerfectClear && game.isVictoryOpen && <Confetti particleCount={120} />}

			<S.LiveRegion aria-live="polite" aria-atomic="true">
				{game.liveAnnouncement}
			</S.LiveRegion>

			<PauseDialog
				isOpen={game.isPaused && !game.isGameOver && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleRestart}
			/>

			<GameRulesDialog isOpen={game.isRulesOpen} onClose={game.closeRules} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={CASCADE_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.updateSettings}
					wakeLockActive={wakeLock.isActive}
				/>
			</GameSettingsDialog>

			<VictoryDialog
				isOpen={game.isVictoryOpen}
				onClose={game.closeVictory}
				title={game.isPerfectClear ? t('victory.perfectTitle') : t('victory.gameOverTitle')}
				message={game.isPerfectClear ? t('victory.perfectMessage') : t('victory.gameOverMessage')}
				elapsedSeconds={game.elapsedSeconds}
				movesCount={game.movesCount}
				movesLabel={t('victory.moves')}
				stats={victoryStats}
				onPlayAgain={() => {
					void game.handleStartNewGame(game.difficulty);
				}}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/cascade/${activeLang}/stats`}
				medalsHref={`/cascade/${activeLang}/medals`}
				lobbyHref={`/cascade/${activeLang}/`}
				lobbyLabel={t('controls.backToLobby')}
			/>
		</GameLayout>
	);
}

export function CascadeGame({ initialDifficulty = 'easy', lang, rulesContent }: CascadeGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/cascade\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<CascadeGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
