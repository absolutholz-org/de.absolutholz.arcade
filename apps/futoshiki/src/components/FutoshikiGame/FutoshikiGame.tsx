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
import { FUTOSHIKI_SETTINGS_CONFIG } from '../../config/settings';
import type { Difficulty } from '../../engine/types';
import { FutoshikiBoard } from '../FutoshikiBoard/FutoshikiBoard';
import { FutoshikiKeypad } from '../FutoshikiKeypad/FutoshikiKeypad';
import { useFutoshikiGame } from './FutoshikiGame.hooks';
import * as S from './FutoshikiGame.styles';

export interface FutoshikiGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function FutoshikiGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('futoshiki');
	const { t: tCommon } = useI18n('common');
	const game = useFutoshikiGame(initialDifficulty);
	const wakeLock = useGameWakeLock(FUTOSHIKI_SETTINGS_CONFIG, !game.isPaused && !game.isComplete, game.settings);

	const handleHintWithAnnouncement = () => {
		const hint = game.handleHint();
		if (hint) {
			game.setLiveAnnouncement(
				t('status.hintApplied', {
					value: hint.value,
					row: hint.row + 1,
					col: hint.col + 1,
				}),
			);
		} else {
			game.setLiveAnnouncement(t('status.noHintAvailable'));
		}
	};

	const statusText = game.isComplete
		? t('status.solved')
		: game.settings.highlightErrors && game.totalConflicts > 0
			? t('status.conflictsCount', { count: game.totalConflicts })
			: t('status.cellsRemaining', { count: game.emptyCellsCount });

	const statusState = game.isComplete
		? 'solved'
		: game.settings.highlightErrors && game.totalConflicts > 0
			? 'danger'
			: 'default';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/futoshiki/${activeLang}/`}
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
				<FutoshikiBoard
					board={game.board}
					activeCell={game.activeCell}
					conflicts={game.conflicts}
					settings={game.settings}
					isPaused={game.isPaused}
					hintedCell={game.hintedCell}
					onSelectCell={game.handleSelectCell}
					onDigitInput={game.handleDigitPress}
					onErase={game.handleErase}
					onToggleNotes={game.handleToggleNotes}
					onHint={handleHintWithAnnouncement}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onTogglePause={game.handleTogglePause}
				/>

				<S.KeypadWrapper>
					<FutoshikiKeypad
						size={game.board.size}
						digitCounts={game.digitCounts}
						isNotesMode={game.isNotesMode}
						disabled={game.isPaused || game.isComplete}
						onDigitPress={game.handleDigitPress}
						onToggleNotes={game.handleToggleNotes}
						onErase={game.handleErase}
						onHint={handleHintWithAnnouncement}
					/>
				</S.KeypadWrapper>
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
					config={FUTOSHIKI_SETTINGS_CONFIG}
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
				stats={[{ label: t('victory.hintsUsed'), value: game.hintsUsed }]}
				hasNextPuzzle={true}
				onNextPuzzle={() => game.handleStartNewGame(game.difficulty)}
				nextPuzzleLabel={t('victory.nextPuzzle')}
				onPlayAgain={game.handleRestart}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/futoshiki/${activeLang}/stats`}
				medalsHref={`/futoshiki/${activeLang}/medals`}
				lobbyHref={`/futoshiki/${activeLang}/`}
				lobbyLabel={t('controls.backToLobby')}
			/>
		</GameLayout>
	);
}

export function FutoshikiGame({ initialDifficulty = 'easy', lang, rulesContent }: FutoshikiGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/futoshiki\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<FutoshikiGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
