import React, { Children, cloneElement, isValidElement } from 'react';
import { useTooltip } from './_Tooltip.hooks';
import * as S from './_Tooltip.styles';
import type { TooltipProps } from './_Tooltip.types';

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
	const { triggerRef, popoverRef, popoverId, showPopover, hidePopover } =
		useTooltip({ content, position });

	if (!content) return children;

	const child = Children.only(children);

	if (!isValidElement(child)) return children;

	// Merge refs cleanly
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const childRef = (child as any).ref;
	const mergedRef = (node: HTMLElement | null) => {
		triggerRef.current = node;
		if (typeof childRef === 'function') {
			childRef(node);
		} else if (childRef && typeof childRef === 'object') {
			childRef.current = node;
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const childProps = child.props as Record<string, any>;

	return (
		<>
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
			{cloneElement(child as React.ReactElement<any>, {
				'aria-describedby': popoverId,
				onBlur: (e: React.FocusEvent<HTMLElement>) => {
					hidePopover(0);
					childProps.onBlur?.(e);
				},
				onFocus: (e: React.FocusEvent<HTMLElement>) => {
					showPopover();
					childProps.onFocus?.(e);
				},
				onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
					showPopover();
					childProps.onMouseEnter?.(e);
				},
				onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
					hidePopover();
					childProps.onMouseLeave?.(e);
				},
				ref: mergedRef,
			})}
			<S.Tooltip
				id={popoverId}
				ref={popoverRef}
				role="tooltip"
				popover="manual"
				onMouseEnter={showPopover}
				onMouseLeave={() => hidePopover(100)}
			>
				{content}
			</S.Tooltip>
		</>
	);
}
