import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '../Button';
import { Die } from '../Die';
import { NumberStepper } from '../NumberStepper';
import { MAX_TRAY_DICE, MIN_TRAY_DICE } from './_DiceTray.constants';
import { useDiceTray } from './_DiceTray.hooks';
import * as S from './_DiceTray.styles';
import type { DiceTrayHandle, DiceTrayProps } from './_DiceTray.types';

function DiceTrayInner(
	{
		defaultCount = 5,
		count,
		onCountChange,
		onRollComplete,
		dice,
		onToggleHold,
		playRollSound,
		disabled = false,
		ariaLabel = 'Dice Tray',
		className,
		countLabel = 'Number of dice',
		decrementLabel = 'Decrease dice count',
		incrementLabel = 'Increase dice count',
		rollButtonLabel = 'Roll Dice',
		resetButtonLabel = 'Reset',
		totalLabel = 'Total:',
	}: DiceTrayProps,
	ref: ForwardedRef<DiceTrayHandle>,
): JSX.Element {
	const {
		activeDice,
		activeCount,
		isRolling,
		total,
		announcement,
		handleRoll,
		handleReset,
		handleToggleHold,
		handleSelectCount,
	} = useDiceTray({
		defaultCount,
		count,
		onCountChange,
		onRollComplete,
		dice,
		onToggleHold,
		playRollSound,
	});

	useImperativeHandle(
		ref,
		() => ({
			roll: handleRoll,
			reset: handleReset,
		}),
		[handleRoll, handleReset],
	);

	return (
		<S.TrayContainer aria-label={ariaLabel} className={className}>
			<S.TopBar>
				<NumberStepper
					value={activeCount}
					onChange={handleSelectCount}
					min={MIN_TRAY_DICE}
					max={MAX_TRAY_DICE}
					disabled={disabled || isRolling}
					label={countLabel}
					decrementLabel={decrementLabel}
					incrementLabel={incrementLabel}
				/>
				<S.TotalBadge>
					{totalLabel} <strong>{total}</strong>
				</S.TotalBadge>
			</S.TopBar>

			{/* biome-ignore lint/a11y/useSemanticElements: W3C APG pattern groups interactive dice controls using role="group" */}
			<S.DiceGrid role="group" aria-label="Dice in tray" data-count={activeCount.toString()}>
				{activeDice.map((die, idx) => (
					<Die
						key={die.id}
						state={die}
						index={idx}
						tumbleIndex={idx}
						onToggleHold={disabled ? undefined : handleToggleHold}
						isRolling={isRolling && !die.isHeld}
					/>
				))}
			</S.DiceGrid>

			<S.ControlsBar>
				<Button variant="primary" disabled={disabled || isRolling} onClick={handleRoll}>
					{rollButtonLabel}
				</Button>
				<Button variant="secondary" disabled={disabled || isRolling} onClick={handleReset}>
					{resetButtonLabel}
				</Button>
			</S.ControlsBar>

			<S.LiveAnnouncer aria-live="polite" aria-atomic="true">
				{announcement}
			</S.LiveAnnouncer>
		</S.TrayContainer>
	);
}

export const DiceTray = forwardRef(DiceTrayInner);
