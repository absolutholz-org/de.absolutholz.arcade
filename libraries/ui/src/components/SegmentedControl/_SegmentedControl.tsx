import { type ForwardedRef, type JSX, forwardRef } from 'react';
import { useSegmentedControlNavigation } from './_SegmentedControl.hooks';
import * as S from './_SegmentedControl.styles';
import type { SegmentedControlOption, SegmentedControlProps } from './_SegmentedControl.types';

function normalizeOptions<T extends string>(
	options?: readonly SegmentedControlOption<T>[],
	items?: readonly unknown[],
): SegmentedControlOption<T>[] {
	if (options && options.length > 0) {
		return [...options];
	}
	if (items && items.length > 0) {
		return items.map((rawItem) => {
			const item = rawItem as Record<string, unknown>;
			return {
				value: (item.value ?? item.id) as T,
				label: item.label as SegmentedControlOption<T>['label'],
				icon: item.icon as SegmentedControlOption<T>['icon'],
				sublabel: item.sublabel as SegmentedControlOption<T>['sublabel'],
				disabled: Boolean(item.disabled),
				ariaLabel: item.ariaLabel as string | undefined,
				ariaControls: (item.ariaControls ?? item['aria-controls']) as string | undefined,
			};
		});
	}
	return [];
}

function SegmentedControlInner<T extends string = string>(
	{
		options,
		items,
		value,
		onChange,
		size = 'md',
		ariaLabel,
		name,
		role = 'radiogroup',
		...restProps
	}: SegmentedControlProps<T>,
	ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
	const normalizedOptions = normalizeOptions(options, items);
	const isTablist = role === 'tablist';

	const navigationItems = normalizedOptions.map((opt) => ({
		id: opt.value,
		disabled: opt.disabled,
	}));

	const { setItemRef, handleKeyDown } = useSegmentedControlNavigation({
		items: navigationItems,
		onChange: (id) => onChange(id as T),
	});

	const selectedOption = normalizedOptions.find((opt) => opt.value === value && !opt.disabled);
	const firstEnabledOption = normalizedOptions.find((opt) => !opt.disabled);
	const activeFocusValue = selectedOption ? selectedOption.value : firstEnabledOption?.value;

	return (
		<S.Container ref={ref} role={role} aria-label={ariaLabel} data-size={size} {...restProps}>
			{normalizedOptions.map((option) => {
				const isChecked = option.value === value;
				const isFocusable = option.value === activeFocusValue;
				const isDisabled = option.disabled;
				const hasIcon = Boolean(option.icon);

				return (
					<S.SegmentButton
						key={option.value}
						ref={(el) => setItemRef(option.value, el)}
						type="button"
						role={isTablist ? 'tab' : 'radio'}
						name={isTablist ? undefined : name}
						aria-checked={isTablist ? undefined : isChecked}
						aria-selected={isTablist ? isChecked : undefined}
						aria-controls={option.ariaControls}
						aria-disabled={isDisabled || undefined}
						aria-label={option.ariaLabel}
						disabled={isDisabled}
						tabIndex={isFocusable ? 0 : -1}
						data-checked={isChecked ? 'true' : undefined}
						data-disabled={isDisabled ? 'true' : undefined}
						data-size={size}
						data-has-icon={hasIcon ? 'true' : undefined}
						onClick={() => {
							if (!isDisabled) {
								onChange(option.value);
							}
						}}
						onKeyDown={(e) => handleKeyDown(e, option.value)}
					>
						{option.icon && <span data-slot="icon">{option.icon}</span>}
						{option.label && <span data-slot="label">{option.label}</span>}
						{option.sublabel && <span data-slot="sublabel">{option.sublabel}</span>}
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
export const SegmentedControl = forwardRef(SegmentedControlInner) as <T extends string = string>(
	props: SegmentedControlProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;
