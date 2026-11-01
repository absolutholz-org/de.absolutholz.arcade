import { Button } from '../Button';
import { Die } from '../Die';
import { SegmentedControl } from '../SegmentedControl';
import { COUNT_SELECTOR_SEGMENTS } from './_DiceTray.constants';
import { useDiceTray } from './_DiceTray.hooks';
import * as S from './_DiceTray.styles';
import type { DiceTrayProps } from './_DiceTray.types';

export function DiceTray({
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
}: DiceTrayProps): JSX.Element {
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

	return (
		<S.TrayContainer aria-label={ariaLabel} className={className}>
			<S.TopBar>
				<SegmentedControl
					size="sm"
					ariaLabel="Dice count selector"
					value={activeCount.toString()}
					onChange={(val) => handleSelectCount(Number(val))}
					items={COUNT_SELECTOR_SEGMENTS}
				/>
				<S.TotalBadge>
					Total: <strong>{total}</strong>
				</S.TotalBadge>
			</S.TopBar>

			{/* biome-ignore lint/a11y/useSemanticElements: W3C APG pattern groups interactive dice controls using role="group" */}
			<S.DiceGrid role="group" aria-label="Dice in tray">
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
					Roll Dice
				</Button>
				<Button variant="secondary" disabled={disabled || isRolling} onClick={handleReset}>
					Reset
				</Button>
			</S.ControlsBar>

			<S.LiveAnnouncer aria-live="polite" aria-atomic="true">
				{announcement}
			</S.LiveAnnouncer>
		</S.TrayContainer>
	);
}
