import { Button } from '../Button';
import type { ButtonVariant } from '../Button/_Button.types';
import { Icon } from '../Icon';
import { ICON_CATALOG } from '../Icon/_Icon.constants';
import type { IconName } from '../Icon/_Icon.types';
import { Popover } from '../Popover';
import { useCollapsibleListbox } from './_CollapsibleListbox.hooks';
import * as S from './_CollapsibleListbox.styles';
import type { CollapsibleListboxProps } from './_CollapsibleListbox.types';

function isIconCatalogName(iconName?: string): iconName is IconName {
	return Boolean(iconName && iconName in ICON_CATALOG);
}

/**
 * CollapsibleListbox provides an accessible select-like dropdown menu
 * built on native popover capabilities, WAI-ARIA listbox pattern, and Button.
 */
export function CollapsibleListbox<T extends string = string>({
	activeId,
	defaultActiveId,
	onSelect,
	options,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	className,
	variant = 'outline',
	showLabel = true,
	size = 'md',
	align = 'bottom',
	disabled = false,
	id,
}: CollapsibleListboxProps<T>) {
	const {
		activeOption,
		getOptionDomId,
		handleOpenChange,
		handleOptionClick,
		handleOptionKeyDown,
		handleTriggerKeyDown,
		isOpen,
		listboxId,
		resolvedActiveId,
		triggerId,
	} = useCollapsibleListbox({
		activeId,
		defaultActiveId,
		id,
		onSelect,
		options,
	});

	const buttonVariant: ButtonVariant = variant === 'danger' ? 'primary' : variant;

	const leadingIcon = activeOption?.icon ? (
		isIconCatalogName(activeOption.icon) ? (
			<Icon name={activeOption.icon} size="sm" />
		) : (
			<Icon emoji={activeOption.icon} size="sm" />
		)
	) : !showLabel && typeof activeOption?.label === 'string' ? (
		<Icon text={activeOption.label.slice(0, 2)} size="sm" />
	) : undefined;

	return (
		<Popover align={align} onOpenChange={handleOpenChange}>
			<Button
				id={triggerId}
				variant={buttonVariant}
				size={size}
				disabled={disabled}
				className={className}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				isIconOnly={!showLabel}
				leadingIcon={leadingIcon}
				trailingIcon={showLabel ? <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size="sm" /> : undefined}
				onKeyDown={handleTriggerKeyDown}
			>
				{showLabel ? activeOption?.label : null}
			</Button>
			<S.ListboxContainer
				id={listboxId}
				// biome-ignore lint/a11y/useSemanticElements: Popover collapsible listbox pattern requires custom listbox container
				role="listbox"
				aria-label={ariaLabel}
				aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || triggerId}
				aria-activedescendant={resolvedActiveId ? getOptionDomId(resolvedActiveId) : undefined}
				tabIndex={-1}
			>
				{options.map((option, index) => {
					const isSelected = option.id === resolvedActiveId;
					return (
						<S.OptionItem
							key={option.id}
							id={getOptionDomId(option.id)}
							type="button"
							// biome-ignore lint/a11y/useSemanticElements: Custom listbox options inside popover require option role with button semantics
							role="option"
							title={option.title}
							aria-selected={isSelected}
							data-active={isSelected ? 'true' : undefined}
							tabIndex={isSelected ? 0 : -1}
							onClick={() => handleOptionClick(option.id)}
							onKeyDown={(e) => handleOptionKeyDown(e, index)}
						>
							<span data-slot="content">
								{option.icon && (
									<span data-slot="icon" aria-hidden="true">
										{isIconCatalogName(option.icon) ? (
											<Icon name={option.icon} size="sm" />
										) : (
											<Icon emoji={option.icon} size="sm" />
										)}
									</span>
								)}
								{option.label}
							</span>
							{isSelected && (
								<span data-slot="check" aria-hidden="true">
									<Icon name="check" size="sm" />
								</span>
							)}
						</S.OptionItem>
					);
				})}
			</S.ListboxContainer>
		</Popover>
	);
}
