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
	orientation = 'horizontal',
	size = 'md',
	variant = 'default',
}: ToolbarProps) {
	const { handleFocus, handleKeyDown, toolbarRef } = useToolbar({
		loop,
		orientation,
	});

	return (
		<S.Toolbar
			id={id}
			ref={toolbarRef}
			role="toolbar"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			aria-orientation={orientation}
			className={className}
			tabIndex={-1}
			onFocus={handleFocus}
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
