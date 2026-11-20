import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { DefeatDialog, GameControls, VictoryDialog } from '@arcade/lib-ui';
import { Banner } from '@arcade/lib-ui/components/Banner';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { useGameWakeLock } from '@arcade/lib-ui/hooks/useGameWakeLock';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type ReactNode, useCallback, useEffect, useState } from 'react';
import { CODEBREAKER_SETTINGS_CONFIG } from '../../config/settings';
import { type Difficulty, PEG_COLORS, type PegColorId } from '../../engine/types';
import { CodebreakerBoard } from '../CodebreakerBoard/CodebreakerBoard';
import { ColorPalette } from '../ColorPalette/ColorPalette';
import { useCodebreakerGame } from './CodebreakerGame.hooks';
import * as S from './CodebreakerGame.styles';

export interface CodebreakerGameProps {
	readonly initialDifficulty?: Difficulty;
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function CodebreakerGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	readonly initialDifficulty?: Difficulty;
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('codebreaker');
	const { t: tCommon } = useI18n('common');
	const game = useCodebreakerGame(initialDifficulty);
	const wakeLock = useGameWakeLock(CODEBREAKER_SETTINGS_CONFIG, !game.isPaused && !game.isComplete, game.settings);

	const handleSubmitWithAnnouncement = useCallback(() => {
		const submitted = game.handleSubmitGuess();
		if (!submitted) return;

		const rowNum = game.history.length + 1;
		if (submitted.feedback.exact === game.config.codeLength) {
			game.setLiveAnnouncement(t('status.solved'));
		} else if (rowNum >= game.config.maxAttempts) {
			game.setLiveAnnouncement(t('status.outOfAttempts'));
		} else {
			game.setLiveAnnouncement(
				t('status.guessScored', {
					row: rowNum,
					exact: submitted.feedback.exact,
					partial: submitted.feedback.partial,
				}),
			);
		}
	}, [game, t]);

	const handleHintWithAnnouncement = useCallback(() => {
		const hint = game.handleHint();
		if (!hint) return;

		if (hint.kind === 'contradiction') {
			game.setLiveAnnouncement(t('status.hintContradiction', { row: hint.conflictingRowIndex + 1 }));
		} else if (hint.kind === 'duplicate-disallowed') {
			game.setLiveAnnouncement(t('status.hintDuplicateDisallowed'));
		} else if (hint.kind === 'consistent-complete') {
			game.setLiveAnnouncement(t('status.hintConsistentComplete'));
		} else {
			const spec = PEG_COLORS[hint.colorId];
			game.setLiveAnnouncement(
				t('status.hintSuggestion', {
					slot: hint.slotIndex + 1,
					color: t(`colors.${spec.key}` as 'colors.red'),
					symbol: t(`symbols.${spec.symbol}` as 'symbols.circle'),
				}),
			);
		}
	}, [game, t]);

	// Window-level keyboard shortcuts so typing 1-C, Backspace, Enter, H, etc. works seamlessly
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
				return;
			}
			if (game.isRulesOpen || game.isSettingsOpen || game.isEndDialogOpen) {
				return;
			}
			const target = event.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
			) {
				return;
			}

			const key = event.key;
			const lower = key.toLowerCase();

			if (key === 'Escape' || lower === 'p') {
				if (!game.isComplete) {
					event.preventDefault();
					game.handleTogglePause();
				}
				return;
			}

			if (game.isPaused || game.isComplete) {
				return;
			}

			if (key === 'ArrowLeft') {
				event.preventDefault();
				const prev = (game.selectedSlot - 1 + game.config.codeLength) % game.config.codeLength;
				game.handleSelectSlot(prev);
			} else if (key === 'ArrowRight') {
				event.preventDefault();
				const next = (game.selectedSlot + 1) % game.config.codeLength;
				game.handleSelectSlot(next);
			} else if (/^[1-8]$/.test(key)) {
				const idx = Number(key) - 1;
				if (idx >= 0 && idx < game.config.colorCount) {
					event.preventDefault();
					game.handlePlaceColor(idx as PegColorId);
				}
			} else if (key === 'Backspace' || key === 'Delete') {
				event.preventDefault();
				game.handleClearSlot();
			} else if (key === 'Enter') {
				if (game.canSubmit) {
					event.preventDefault();
					handleSubmitWithAnnouncement();
				}
			} else if (lower === 'h') {
				event.preventDefault();
				handleHintWithAnnouncement();
			} else if (lower === 'u' || lower === 'z') {
				event.preventDefault();
				game.handleUndo();
			} else if (lower === 'r' || lower === 'y') {
				event.preventDefault();
				game.handleRedo();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [game, handleSubmitWithAnnouncement, handleHintWithAnnouncement]);

	const attemptNumber = Math.min(game.history.length + 1, game.config.maxAttempts);
	const statusText =
		game.status === 'won'
			? t('status.solved')
			: game.status === 'lost'
				? t('status.outOfAttempts')
				: t('status.attemptProgress', {
						current: attemptNumber,
						max: game.config.maxAttempts,
					});

	const statusState =
		game.status === 'won'
			? 'solved'
			: game.status === 'lost' || game.conflictingRowIndex !== null
				? 'danger'
				: 'default';

	const hintBannerInfo = (() => {
		const hint = game.activeHint;
		if (!hint) return null;
		if (hint.kind === 'contradiction') {
			return {
				variant: 'danger' as const,
				text: t('status.hintContradiction', { row: hint.conflictingRowIndex + 1 }),
			};
		}
		if (hint.kind === 'duplicate-disallowed') {
			return {
				variant: 'warning' as const,
				text: t('status.hintDuplicateDisallowed'),
			};
		}
		if (hint.kind === 'consistent-complete') {
			return {
				variant: 'success' as const,
				text: t('status.hintConsistentComplete'),
			};
		}
		const spec = PEG_COLORS[hint.colorId];
		return {
			variant: 'info' as const,
			text: t('status.hintSuggestion', {
				slot: hint.slotIndex + 1,
				color: t(`colors.${spec.key}` as 'colors.red'),
				symbol: t(`symbols.${spec.symbol}` as 'symbols.circle'),
			}),
		};
	})();

	const EndDialog = game.status === 'won' ? VictoryDialog : DefeatDialog;

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/codebreaker/${activeLang}/`}
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
					onRestart={() => game.handleStartNewGame(game.difficulty)}
					canRestart={!game.isPaused && !game.isComplete}
					onNewGame={() => game.handleStartNewGame(game.difficulty)}
					canNewGame={!game.isPaused}
					hasActiveProgress={game.history.length > 0 || game.elapsedSeconds > 0}
					isComplete={game.isComplete}
				/>
			}
		>
			<S.PlayfieldStack>
				{hintBannerInfo && (
					<S.HintBannerWrapper>
						<Banner
							variant={hintBannerInfo.variant}
							statusLabel={t('controls.hint')}
							message={hintBannerInfo.text}
						/>
					</S.HintBannerWrapper>
				)}

				<CodebreakerBoard
					codeLength={game.config.codeLength}
					colorCount={game.config.colorCount}
					maxAttempts={game.config.maxAttempts}
					secret={game.secret}
					history={game.history}
					draft={game.draft}
					selectedSlot={game.selectedSlot}
					status={game.status}
					isPaused={game.isPaused}
					showColorShapes={game.settings.showColorShapes}
					showColorNumbers={game.settings.showColorNumbers}
					conflictingRowIndex={game.conflictingRowIndex}
					hintedSlotIndex={game.hintedSlotIndex}
					onSelectSlot={game.handleSelectSlot}
					onPlaceColor={game.handlePlaceColor}
					onClearSlot={game.handleClearSlot}
					onSubmitGuess={handleSubmitWithAnnouncement}
					onHint={handleHintWithAnnouncement}
					onUndo={game.handleUndo}
					onRedo={game.handleRedo}
					onTogglePause={game.handleTogglePause}
				/>

				<ColorPalette
					colorCount={game.config.colorCount}
					draft={game.draft}
					selectedSlot={game.selectedSlot}
					allowDuplicates={game.allowDuplicates}
					showColorShapes={game.settings.showColorShapes}
					showColorNumbers={game.settings.showColorNumbers}
					canSubmit={game.canSubmit}
					canClear={game.canClear}
					disabled={game.isPaused || game.isComplete}
					onPlaceColor={game.handlePlaceColor}
					onClearSlot={game.handleClearSlot}
					onHint={handleHintWithAnnouncement}
					onSubmitGuess={handleSubmitWithAnnouncement}
				/>
			</S.PlayfieldStack>

			<S.LiveRegion aria-live="polite" aria-atomic="true">
				{game.liveAnnouncement}
			</S.LiveRegion>

			<PauseDialog
				isOpen={game.isPaused && !game.isComplete && !game.isSettingsOpen && !game.isRulesOpen}
				onResume={game.handleTogglePause}
				onRestart={() => game.handleStartNewGame(game.difficulty)}
			/>

			<GameRulesDialog isOpen={game.isRulesOpen} onClose={game.closeRules} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={game.isSettingsOpen} onClose={game.closeSettings} gameTitle={t('title')}>
				<GameSettingsPanel
					config={CODEBREAKER_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={game.updateSettings}
					wakeLockActive={wakeLock.isActive}
				/>
			</GameSettingsDialog>

			<EndDialog
				isOpen={game.isEndDialogOpen}
				onClose={game.closeEndDialog}
				title={game.status === 'won' ? t('victory.title') : t('victory.defeatTitle')}
				message={game.status === 'won' ? t('victory.congratulations') : t('victory.defeatMessage')}
				elapsedSeconds={game.elapsedSeconds}
				timeLabel={t('victory.timeElapsed')}
				movesCount={game.history.length}
				movesLabel={t('victory.guessesUsed')}
				stats={[{ label: t('victory.hintsUsed'), value: game.hintsUsed }]}
				onPlayAgain={() => game.handleStartNewGame(game.difficulty)}
				playAgainLabel={t('victory.playAgain')}
				statsHref={`/codebreaker/${activeLang}/stats`}
				medalsHref={`/codebreaker/${activeLang}/medals`}
				lobbyHref={`/codebreaker/${activeLang}/`}
			/>
		</GameLayout>
	);
}

export function CodebreakerGame({ initialDifficulty = 'easy', lang, rulesContent }: CodebreakerGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const segments = window.location.pathname.split('/').filter(Boolean);
			const candidate = segments[1] ?? segments[0];
			if (candidate && isSupportedLanguage(candidate)) {
				return candidate;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	return (
		<I18nProvider language={activeLang}>
			<CodebreakerGameInner
				initialDifficulty={initialDifficulty}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
