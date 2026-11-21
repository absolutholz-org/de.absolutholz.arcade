import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameControls, VictoryDialog } from '@arcade/lib-ui';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { useGameWakeLock } from '@arcade/lib-ui/hooks/useGameWakeLock';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type ReactNode, useState } from 'react';
import { COLOR_MAP_SETTINGS_CONFIG } from '../../config/settings';
import type { ColorIndex, Difficulty } from '../../engine/types';
import { ColorMapBoard } from '../ColorMapBoard/ColorMapBoard';
import { ColorMapPalette } from '../ColorMapPalette/ColorMapPalette';
import { useColorMapGame } from './ColorMapGame.hooks';
import * as S from './ColorMapGame.styles';

export interface ColorMapGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function ColorMapGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('color-map');
	const { t: tCommon } = useI18n('common');
	const game = useColorMapGame(initialDifficulty);
	const wakeLock = useGameWakeLock(COLOR_MAP_SETTINGS_CONFIG, !game.isPaused && !game.isComplete, game.settings);

	const announceApplyColor = (regionId: number, color: ColorIndex) => {
		const outcome = game.applyColor(regionId, color);
		if (outcome === 'applied') {
			game.setLiveAnnouncement(
				t('status.colorApplied', {
					region: regionId + 1,
					color: t(`colors.c${color}` as 'colors.c0'),
					shape: t(`shapes.s${color}` as 'shapes.s0'),
				}),
			);
		} else if (outcome === 'locked') {
			game.setLiveAnnouncement(t('status.regionLocked', { region: regionId + 1 }));
		}
	};

	const announceErase = (regionId: number) => {
		const outcome = game.eraseRegion(regionId);
		if (outcome === 'erased') {
			game.setLiveAnnouncement(t('status.colorErased', { region: regionId + 1 }));
		} else if (outcome === 'locked') {
			game.setLiveAnnouncement(t('status.regionLocked', { region: regionId + 1 }));
		}
	};

	const announceToggleCandidate = (regionId: number, color: ColorIndex) => {
		const outcome = game.toggleCandidate(regionId, color);
		if (outcome === 'added') {
			game.setLiveAnnouncement(
				t('status.candidateAdded', {
					region: regionId + 1,
					color: t(`colors.c${color}` as 'colors.c0'),
				}),
			);
		} else if (outcome === 'removed') {
			game.setLiveAnnouncement(
				t('status.candidateRemoved', {
					region: regionId + 1,
					color: t(`colors.c${color}` as 'colors.c0'),
				}),
			);
		} else if (outcome === 'locked') {
			game.setLiveAnnouncement(t('status.regionLocked', { region: regionId + 1 }));
		}
	};

	const handleTapRegion = (regionId: number) => {
		if (game.activeTool === 'eraser') {
			announceErase(regionId);
			return;
		}
		if (game.isPencilMode) {
			announceToggleCandidate(regionId, game.activeTool);
		} else {
			announceApplyColor(regionId, game.activeTool);
		}
	};

	const conflictCount = game.conflicts.conflictingPairs.size;
	const statusText = game.isComplete
		? t('status.solved')
		: game.settings.highlightConflicts && conflictCount > 0
			? t('status.conflictsCount', { count: conflictCount })
			: t('status.regionsRemaining', { count: game.uncoloredCount });

	const statusState = game.isComplete
		? 'solved'
		: game.settings.highlightConflicts && conflictCount > 0
			? 'danger'
			: 'default';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/color-map/${activeLang}/`}
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
					statusText={statusText}
					statusState={statusState}
					elapsedSeconds={game.elapsedSeconds}
					isPaused={game.isPaused}
					onTogglePause={game.handleTogglePause}
				/>
			}
			toolbar={
				<GameControls
					onUndo={game.handleUndo}
					canUndo={game.canUndo && !game.isPaused && !game.isComplete}
					onRedo={game.handleRedo}
					canRedo={game.canRedo && !game.isPaused && !game.isComplete}
					onRestart={game.handleRestart}
					canRestart={!game.isPaused && !game.isComplete}
					onNewGame={() => game.handleStartNewGame(game.difficulty)}
					canNewGame={!game.isPaused}
					hasActiveProgress={game.elapsedSeconds > 0 || game.movesCount > 0}
					isComplete={game.isComplete}
				/>
			}
		>
			<S.PlayfieldStack>
				<ColorMapBoard
					puzzle={game.puzzle}
					colors={game.colors}
					candidates={game.candidates}
					conflicts={game.conflicts}
					settings={game.settings}
					focusedRegionId={game.focusedRegionId}
					isPencilMode={game.isPencilMode}
					isPaused={game.isPaused}
					isComplete={game.isComplete}
					onFocusRegion={game.setFocusedRegionId}
					onTapRegion={handleTapRegion}
					onApplyColor={announceApplyColor}
					onToggleCandidate={announceToggleCandidate}
					onEraseRegion={announceErase}
					onTogglePencilMode={game.handleTogglePencilMode}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onTogglePause={game.handleTogglePause}
				/>

				<S.PaletteWrapper>
					<ColorMapPalette
						activeTool={game.activeTool}
						isPencilMode={game.isPencilMode}
						highlightConflicts={game.settings.highlightConflicts}
						showColorblindShapes={game.settings.showColorblindShapes}
						disabled={game.isPaused || game.isComplete}
						onSelectTool={game.setActiveTool}
						onTogglePencilMode={game.handleTogglePencilMode}
						onToggleHighlightConflicts={game.handleToggleHighlightConflicts}
					/>
				</S.PaletteWrapper>
			</S.PlayfieldStack>

			<S.LiveRegion aria-live="polite" aria-atomic="true">
				{game.liveAnnouncement}
			</S.LiveRegion>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={game.handleRestart}
			/>

			<GameRulesDialog isOpen={game.isRulesOpen} onClose={game.closeRules} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={COLOR_MAP_SETTINGS_CONFIG}
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
				message={t('victory.congratulations')}
				elapsedSeconds={game.elapsedSeconds}
				timeLabel={t('victory.timeElapsed')}
				movesCount={game.movesCount}
				movesLabel={t('victory.moves')}
				stats={[{ label: t('victory.mistakes'), value: game.mistakesCount }]}
				hasNextPuzzle={true}
				onNextPuzzle={() => game.handleStartNewGame(game.nextDifficulty ?? game.difficulty)}
				nextPuzzleLabel={game.nextDifficulty ? t('victory.nextDifficulty') : t('victory.nextPuzzle')}
				onPlayAgain={() => game.handleStartNewGame(game.difficulty)}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/color-map/${activeLang}/stats`}
				medalsHref={`/color-map/${activeLang}/medals`}
				lobbyHref={`/color-map/${activeLang}/`}
				lobbyLabel={t('controls.backToLobby')}
			/>
		</GameLayout>
	);
}

export function ColorMapGame({ initialDifficulty = 'easy', lang, rulesContent }: ColorMapGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/color-map\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<ColorMapGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
