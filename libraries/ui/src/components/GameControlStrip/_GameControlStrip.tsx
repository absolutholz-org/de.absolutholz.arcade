import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '../Dialog';
import { Icon } from '../Icon';
import * as S from './_GameControlStrip.styles';
import type { GameControlStripProps } from './_GameControlStrip.types';

export const GameControlButton = S.ActionButton;

/**
 * Standardized reusable game controls / action toolbar component rendered below the game board.
 * Wraps common history controls (Undo, Redo) and session lifecycle controls (Restart, New Game)
 * inside a single WAI-ARIA `role="toolbar"` with roving tabindex and arrow key navigation.
 * Uses the shared accessible `Dialog` component to confirm destructive actions when progress is active.
 */
export function GameControlStrip({
	onUndo,
	canUndo = false,
	undoLabel,
	onRedo,
	canRedo = false,
	redoLabel,
	onReset,
	onRestart,
	canReset,
	canRestart,
	resetLabel,
	restartLabel,
	onNewPuzzle,
	onNewGame,
	canNewPuzzle,
	canNewGame,
	newPuzzleLabel,
	newGameLabel,
	hasActiveProgress,
	hasProgress,
	isComplete = false,
	requireConfirmation = false,
	cancelLabel,
	align = 'center',
	'aria-label': ariaLabel,
	children,
	className,
}: GameControlStripProps) {
	const { t } = useI18n('common');

	// Resolve unified action handlers and canonical localized labels
	const resolvedUndoLabel = undoLabel ?? t('actions.undo');
	const resolvedRedoLabel = redoLabel ?? t('actions.redo');

	const handleRestartAction = onRestart ?? onReset;
	const isRestartAvailable = canRestart ?? canReset ?? true;
	const resolvedRestartLabel = restartLabel ?? resetLabel ?? t('actions.restart');

	const handleNewGameAction = onNewGame ?? onNewPuzzle;
	const isNewGameAvailable = canNewGame ?? canNewPuzzle ?? true;
	const resolvedNewGameLabel = newGameLabel ?? newPuzzleLabel ?? t('actions.newGame');

	const resolvedCancelLabel = cancelLabel ?? t('actions.cancel');
	const resolvedAriaLabel = ariaLabel ?? t('actions.gameControls');

	const resolvedHasProgress = Boolean(hasActiveProgress ?? hasProgress) && !isComplete;

	// Modal confirmation state: null | 'restart' | 'newGame'
	const [confirmingAction, setConfirmingAction] = useState<'restart' | 'newGame' | null>(null);
	const restartButtonRef = useRef<HTMLButtonElement | null>(null);
	const newGameButtonRef = useRef<HTMLButtonElement | null>(null);
	const prevConfirmingRef = useRef<'restart' | 'newGame' | null>(null);
	const shouldRestoreFocusRef = useRef(false);

	const closeConfirmation = useCallback((restoreFocus = true) => {
		shouldRestoreFocusRef.current = restoreFocus;
		setConfirmingAction(null);
	}, []);

	// Restore focus back to the triggering toolbar button when the confirmation dialog is dismissed
	useEffect(() => {
		const prev = prevConfirmingRef.current;
		prevConfirmingRef.current = confirmingAction;

		if (!confirmingAction && prev && shouldRestoreFocusRef.current) {
			shouldRestoreFocusRef.current = false;
			if (prev === 'restart') {
				restartButtonRef.current?.focus();
			} else if (prev === 'newGame') {
				newGameButtonRef.current?.focus();
			}
		}
	}, [confirmingAction]);

	// Capture-phase Escape listener while dialog is open so game-level Esc pause handlers do not fire
	useEffect(() => {
		if (!confirmingAction) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				closeConfirmation(true);
			}
		};

		window.addEventListener('keydown', handleKeyDown, { capture: true });
		return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
	}, [confirmingAction, closeConfirmation]);

	const onRestartClick = useCallback(() => {
		if (!handleRestartAction) return;
		const needsConfirm = requireConfirmation || resolvedHasProgress;
		if (needsConfirm) {
			setConfirmingAction('restart');
		} else {
			handleRestartAction();
		}
	}, [handleRestartAction, requireConfirmation, resolvedHasProgress]);

	const onNewGameClick = useCallback(() => {
		if (!handleNewGameAction) return;
		const needsConfirm = requireConfirmation || resolvedHasProgress;
		if (needsConfirm) {
			setConfirmingAction('newGame');
		} else {
			handleNewGameAction();
		}
	}, [handleNewGameAction, requireConfirmation, resolvedHasProgress]);

	const handleConfirmDialog = useCallback(() => {
		const action = confirmingAction;
		closeConfirmation(false);
		if (action === 'restart') {
			handleRestartAction?.();
		} else if (action === 'newGame') {
			handleNewGameAction?.();
		}
	}, [confirmingAction, closeConfirmation, handleRestartAction, handleNewGameAction]);

	const hasConstructive = Boolean(onUndo || onRedo);
	const hasDestructive = Boolean(handleRestartAction || handleNewGameAction);

	const dialogTitle =
		confirmingAction === 'restart' ? t('game.confirmRestart.title') : t('game.confirmNewGame.title');
	const dialogMessage =
		confirmingAction === 'restart' ? t('game.confirmRestart.message') : t('game.confirmNewGame.message');
	const dialogConfirmText = confirmingAction === 'restart' ? resolvedRestartLabel : resolvedNewGameLabel;

	return (
		<>
			<S.ControlBar className={className} align={align} variant="ghost" size="md" aria-label={resolvedAriaLabel}>
				{/* Constructive / State Stepping Group: Undo, Redo */}
				{hasConstructive && (
					/* biome-ignore lint/a11y/useSemanticElements: W3C APG Toolbar pattern groups controls inside toolbars using role="group" */
					<S.ControlGroup data-group="constructive" role="group" aria-label="History controls">
						{onUndo && (
							<S.ActionButton
								type="button"
								onClick={onUndo}
								disabled={!canUndo}
								aria-label={resolvedUndoLabel}
								title={resolvedUndoLabel}
								data-action-style="constructive"
								data-collapse-mobile="true"
							>
								<Icon name="undo" size="sm" />
								<span>{resolvedUndoLabel}</span>
							</S.ActionButton>
						)}

						{onRedo && (
							<S.ActionButton
								type="button"
								onClick={onRedo}
								disabled={!canRedo}
								aria-label={resolvedRedoLabel}
								title={resolvedRedoLabel}
								data-action-style="constructive"
								data-collapse-mobile="true"
							>
								<Icon name="redo" size="sm" />
								<span>{resolvedRedoLabel}</span>
							</S.ActionButton>
						)}
					</S.ControlGroup>
				)}

				{hasConstructive && hasDestructive && <S.Divider aria-hidden="true" />}

				{/* Destructive / Session Lifecycle Group: Restart, New Game */}
				{hasDestructive && (
					/* biome-ignore lint/a11y/useSemanticElements: W3C APG Toolbar pattern groups controls inside toolbars using role="group" */
					<S.ControlGroup data-group="destructive" role="group" aria-label="Session controls">
						{handleRestartAction && (
							<S.ActionButton
								ref={restartButtonRef}
								type="button"
								onClick={onRestartClick}
								disabled={!isRestartAvailable}
								aria-label={resolvedRestartLabel}
								title={resolvedRestartLabel}
								data-action-style="destructive"
								data-collapse-mobile="true"
							>
								<Icon name="rotate-ccw" size="sm" />
								<span>{resolvedRestartLabel}</span>
							</S.ActionButton>
						)}

						{handleNewGameAction && (
							<S.ActionButton
								ref={newGameButtonRef}
								type="button"
								onClick={onNewGameClick}
								disabled={!isNewGameAvailable}
								aria-label={resolvedNewGameLabel}
								title={resolvedNewGameLabel}
								data-action-style="destructive"
								data-collapse-mobile="true"
							>
								<Icon name="sparkles" size="sm" />
								<span>{resolvedNewGameLabel}</span>
							</S.ActionButton>
						)}
					</S.ControlGroup>
				)}

				{/* Optional children/custom actions */}
				{children && (
					<>
						{(hasConstructive || hasDestructive) && <S.Divider aria-hidden="true" />}
						{/* biome-ignore lint/a11y/useSemanticElements: W3C APG Toolbar pattern groups controls inside toolbars using role="group" */}
						<S.ControlGroup data-group="extra" role="group">
							{children}
						</S.ControlGroup>
					</>
				)}
			</S.ControlBar>

			<Dialog
				isOpen={confirmingAction !== null}
				title={dialogTitle}
				message={dialogMessage}
				cancelText={resolvedCancelLabel}
				confirmText={dialogConfirmText}
				onCancel={() => closeConfirmation(true)}
				onConfirm={handleConfirmDialog}
			/>
		</>
	);
}

// Export aliases
export const GameControls = GameControlStrip;
