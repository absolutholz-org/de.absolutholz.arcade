import type { FocusEvent, KeyboardEvent } from 'react';
import { useToolbar } from './_Toolbar.hooks';
import * as S from './_Toolbar.styles';
import type { ToolbarProps } from './_Toolbar.types';

/**
 * Toolbar component provides an accessible grouping container for interactive controls
 * conforming strictly to W3C WAI-ARIA Authoring Practices (APG), WCAG 2.2 AA, and German BITV 2.0 standards.
 * Manages roving tabindex, arrow key navigation, Home/End jumping, and orientation.
 */
export function Toolbar({
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	align = 'start',
	children,
	className,
	fullWidth = false,
	id,
	loop = true,
	onFocus,
	onKeyDown,
	orientation = 'horizontal',
	size = 'md',
	variant = 'default',
}: ToolbarProps) {
	const { handleFocus, handleKeyDown, toolbarRef } = useToolbar({
		loop,
		orientation,
	});

	const handleFocusCombined = (event: FocusEvent<HTMLDivElement>) => {
		handleFocus(event);
		onFocus?.(event);
	};

	const handleKeyDownCombined = (event: KeyboardEvent<HTMLDivElement>) => {
		handleKeyDown(event);
		onKeyDown?.(event);
	};

	return (
		<S.Toolbar
			id={id}
			ref={toolbarRef}
			role="toolbar"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-orientation={orientation}
			className={className}
			onFocus={handleFocusCombined}
			onKeyDown={handleKeyDownCombined}
			data-align={align}
			data-full-width={fullWidth ? 'true' : undefined}
			data-orientation={orientation}
			data-size={size}
			data-variant={variant}
		>
			{children}
		</S.Toolbar>
	);
}
