import { Children, type FocusEvent, type MouseEvent, type ReactElement, cloneElement } from 'react';
import { useTooltip } from './_Tooltip.hooks';
import * as S from './_Tooltip.styles';
import type { TooltipProps } from './_Tooltip.types';

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
	if (!content) {
		return children;
	}

	const child = Children.only(children);
	const { createMergedRef, hideTooltip, id, popoverRef, showTooltip } = useTooltip({
		content,
		position,
	});

	const childAriaDescribedBy = (child.props as { 'aria-describedby'?: string })['aria-describedby'];
	const ariaDescribedBy = childAriaDescribedBy ? `${childAriaDescribedBy} ${id}` : id;

	return (
		<>
			{cloneElement(child, {
				'aria-describedby': ariaDescribedBy,
				onBlur: (e: FocusEvent<HTMLElement>) => {
					hideTooltip(0);
					(child.props as { onBlur?: (e: FocusEvent<HTMLElement>) => void }).onBlur?.(e);
				},
				onFocus: (e: FocusEvent<HTMLElement>) => {
					showTooltip();
					(child.props as { onFocus?: (e: FocusEvent<HTMLElement>) => void }).onFocus?.(e);
				},
				onMouseEnter: (e: MouseEvent<HTMLElement>) => {
					showTooltip();
					(child.props as { onMouseEnter?: (e: MouseEvent<HTMLElement>) => void }).onMouseEnter?.(e);
				},
				onMouseLeave: (e: MouseEvent<HTMLElement>) => {
					hideTooltip();
					(child.props as { onMouseLeave?: (e: MouseEvent<HTMLElement>) => void }).onMouseLeave?.(e);
				},
				ref: createMergedRef(child),
			})}
			<S.Tooltip
				id={id}
				ref={popoverRef}
				role="tooltip"
				popover="manual"
				onMouseEnter={showTooltip}
				onMouseLeave={() => hideTooltip()}
			>
				{content}
			</S.Tooltip>
		</>
	);
}
