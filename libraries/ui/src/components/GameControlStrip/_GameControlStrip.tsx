import { Button } from '../Button';
import { Icon } from '../Icon';
import { Toolbar } from '../Toolbar';
import * as S from './_GameControlStrip.styles';
import type { GameControlStripProps } from './_GameControlStrip.types';

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
	align = 'center',
	'aria-label': ariaLabel,
	children,
	className,
}: GameControlStripProps) {
	return (
		<S.GameControlStrip className={className}>
			<Toolbar fullWidth variant="ghost" size="sm" align={align} aria-label={ariaLabel}>
				{onUndo && undoLabel && (
					<Button
						type="button"
						variant="secondary"
						size="sm"
						leadingIcon={<Icon name="undo" size="sm" />}
						onClick={onUndo}
						disabled={!canUndo}
					>
						{undoLabel}
					</Button>
				)}

				{onRedo && redoLabel && (
					<Button
						type="button"
						variant="secondary"
						size="sm"
						leadingIcon={<Icon name="redo" size="sm" />}
						onClick={onRedo}
						disabled={!canRedo}
					>
						{redoLabel}
					</Button>
				)}

				{onReset && resetLabel && (
					<Button
						type="button"
						variant="secondary"
						size="sm"
						leadingIcon={<Icon name="rotate-ccw" size="sm" />}
						onClick={onReset}
						disabled={!canReset}
					>
						{resetLabel}
					</Button>
				)}

				{onNewPuzzle && newPuzzleLabel && (
					<Button
						type="button"
						variant="secondary"
						size="sm"
						leadingIcon={<Icon name="sparkles" size="sm" />}
						onClick={onNewPuzzle}
						disabled={!canNewPuzzle}
					>
						{newPuzzleLabel}
					</Button>
				)}

				{children}
			</Toolbar>
		</S.GameControlStrip>
	);
}
