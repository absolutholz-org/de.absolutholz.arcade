import { type JSX, useMemo } from 'react';
import { SegmentedControl } from '../SegmentedControl';
import * as S from './_GameSegmentedControl.styles';
import type { GameSegmentedControlProps } from './_GameSegmentedControl.types';

export function GameSegmentedControl({
	options,
	selectedId,
	onSelect,
	ariaLabel,
}: GameSegmentedControlProps): JSX.Element {
	const items = useMemo(
		() =>
			options.map((opt) => ({
				id: opt.id,
				label: opt.label,
				icon: opt.icon,
				ariaControls: `panel-${opt.id}`,
			})),
		[options],
	);

	return (
		<S.GameSegmentedControl aria-label={ariaLabel}>
			<SegmentedControl
				role="tablist"
				items={items}
				value={selectedId}
				onChange={onSelect}
				ariaLabel={ariaLabel}
			/>
		</S.GameSegmentedControl>
	);
}
