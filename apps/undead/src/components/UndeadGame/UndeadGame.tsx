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
import { UNDEAD_SETTINGS_CONFIG } from '../../config/settings';
import { type Difficulty, MONSTER_TYPES } from '../../engine/types';
import { MonsterPalette } from '../MonsterPalette/MonsterPalette';
import { UndeadBoard } from '../UndeadBoard/UndeadBoard';
import { useUndeadGame } from './UndeadGame.hooks';
import * as S from './UndeadGame.styles';

export interface UndeadGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function UndeadGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('undead');
	const { t: tCommon } = useI18n('common');
	const game = useUndeadGame(initialDifficulty);
	const wakeLock = useGameWakeLock(UNDEAD_SETTINGS_CONFIG, !game.isPaused && !game.isComplete, game.settings);

	const overLimitMonster = MONSTER_TYPES.find((m) => game.validation.overLimit[m]);
	const errorClueCount = game.validation.errorClueIds.size;

	const statusText = game.isComplete
		? t('status.solved')
		: game.settings.highlightErrors && overLimitMonster
			? t('status.overLimitWarning', {
					monster: t(`monsters.${overLimitMonster}Plural` as 'monsters.ghostPlural'),
				})
			: game.settings.highlightErrors && errorClueCount > 0
				? t('status.conflictsCount', { count: errorClueCount })
				: t('status.cellsRemaining', { count: game.validation.emptySlotCount });

	const statusState = game.isComplete
		? 'solved'
		: game.settings.highlightErrors && (overLimitMonster || errorClueCount > 0)
			? 'danger'
			: 'default';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/undead/${activeLang}/`}
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
				<UndeadBoard
					board={game.board}
					rays={game.rays}
					validation={game.validation}
					activeCell={game.activeCell}
					completedClues={game.completedClues}
					settings={game.settings}
					isPaused={game.isPaused}
					onSelectCell={game.handleSelectCell}
					onMonsterInput={game.handleMonsterInput}
					onRightClickCell={game.handleRightClickCell}
					onErase={game.handleErase}
					onToggleNotes={game.handleToggleNotes}
					onToggleClueDone={game.handleToggleClueDone}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onTogglePause={game.handleTogglePause}
				/>

				<MonsterPalette
					inventory={game.board.inventory}
					placedCounts={game.validation.placedCounts}
					overLimit={game.validation.overLimit}
					selectedMonster={game.selectedMonster}
					isNotesMode={game.isNotesMode}
					disabled={game.isPaused || game.isComplete}
					onMonsterPress={(m) => game.handleMonsterInput(m)}
					onToggleNotes={game.handleToggleNotes}
					onErase={game.handleErase}
				/>
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
					config={UNDEAD_SETTINGS_CONFIG}
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
				hasNextPuzzle={true}
				onNextPuzzle={() => game.handleStartNewGame(game.difficulty)}
				nextPuzzleLabel={t('victory.nextPuzzle')}
				onPlayAgain={game.handleRestart}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/undead/${activeLang}/stats`}
				medalsHref={`/undead/${activeLang}/medals`}
				lobbyHref={`/undead/${activeLang}/`}
				lobbyLabel={t('controls.backToLobby')}
			/>
		</GameLayout>
	);
}

export function UndeadGame({ initialDifficulty = 'easy', lang, rulesContent }: UndeadGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/undead\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<UndeadGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
