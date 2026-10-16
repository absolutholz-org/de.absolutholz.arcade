import { type ForwardedRef, forwardRef } from 'react';
import { useSegmentedControlNavigation } from './_SegmentedControl.hooks';
import * as S from './_SegmentedControl.styles';
import type { SegmentedControlProps } from './_SegmentedControl.types';

function SegmentedControlInner(
	{ items, value, onChange, ariaLabel, name, ...restProps }: SegmentedControlProps,
	ref: ForwardedRef<HTMLDivElement>,
) {
	const { setItemRef, handleKeyDown } = useSegmentedControlNavigation({
		items,
		onChange,
	});

	const selectedItem = items.find((item) => item.id === value && !item.disabled);
	const firstEnabledItem = items.find((item) => !item.disabled);
	const activeFocusId = selectedItem ? selectedItem.id : firstEnabledItem?.id;

	return (
		<S.Container ref={ref} role="radiogroup" aria-label={ariaLabel} {...restProps}>
			{items.map((item) => {
				const isChecked = item.id === value;
				const isFocusable = item.id === activeFocusId;
				const isDisabled = item.disabled;

				return (
					<S.SegmentButton
						key={item.id}
						ref={(el) => setItemRef(item.id, el)}
						type="button"
						// biome-ignore lint/a11y/useSemanticElements: SegmentedControl uses WAI-ARIA radiogroup pattern with buttons
						role="radio"
						name={name}
						aria-checked={isChecked}
						aria-disabled={isDisabled || undefined}
						disabled={isDisabled}
						tabIndex={isFocusable ? 0 : -1}
						data-checked={isChecked ? 'true' : undefined}
						data-disabled={isDisabled ? 'true' : undefined}
						onClick={() => {
							if (!isDisabled) {
								onChange(item.id);
							}
						}}
						onKeyDown={(e) => handleKeyDown(e, item.id)}
					>
						<span data-slot="label">{item.label}</span>
						{item.sublabel && <span data-slot="sublabel">{item.sublabel}</span>}
					</S.SegmentButton>
				);
			})}
		</S.Container>
	);
}

/**
 * Generic, responsive, accessible segmented control switcher primitive.
 * Implements WAI-ARIA radiogroup pattern with arrow keyboard navigation.
 */
export const SegmentedControl = forwardRef(SegmentedControlInner);
