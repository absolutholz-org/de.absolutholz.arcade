import { Icon } from '../Icon';
import * as S from './_GameControlStrip.styles';
import type { GameControlStripProps } from './_GameControlStrip.types';

export const GameControlButton = S.ActionButton;

/**
 * Standardized bottom control bar organism rendered below the gameboard inside `GameLayout`'s `toolbar` slot.
 * Provides consistent secondary action buttons for Undo, Redo, Reset/Restart, and New Puzzle.
 */
export function GameControlStrip({
	onUndo,
	canUndo = false,
	undoLabel,
	onRedo,
	canRedo = false,
	redoLabel,
	onReset,
	canReset = true,
	resetLabel,
	onNewPuzzle,
	canNewPuzzle = true,
	newPuzzleLabel,
	'aria-label': ariaLabel,
	children,
	className,
}: GameControlStripProps) {
	return (
		<S.ControlBar className={className} role="toolbar" aria-label={ariaLabel}>
			{onUndo && undoLabel && (
				<S.ActionButton type="button" onClick={onUndo} disabled={!canUndo} aria-label={undoLabel}>
					<Icon name="undo" size="sm" />
					<span>{undoLabel}</span>
				</S.ActionButton>
			)}

			{onRedo && redoLabel && (
				<S.ActionButton type="button" onClick={onRedo} disabled={!canRedo} aria-label={redoLabel}>
					<Icon name="redo" size="sm" />
					<span>{redoLabel}</span>
				</S.ActionButton>
			)}

			{onReset && resetLabel && (
				<S.ActionButton type="button" onClick={onReset} disabled={!canReset} aria-label={resetLabel}>
					<Icon name="rotate-ccw" size="sm" />
					<span>{resetLabel}</span>
				</S.ActionButton>
			)}

			{onNewPuzzle && newPuzzleLabel && (
				<S.ActionButton
					type="button"
					onClick={onNewPuzzle}
					disabled={!canNewPuzzle}
					aria-label={newPuzzleLabel}
				>
					<Icon name="sparkles" size="sm" />
					<span>{newPuzzleLabel}</span>
				</S.ActionButton>
			)}

			{children}
		</S.ControlBar>
	);
}
