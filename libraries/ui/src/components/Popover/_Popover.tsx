import { Children, type ReactElement, cloneElement } from 'react';
import { usePopover } from './_Popover.hooks';
import * as S from './_Popover.styles';
import type { PopoverProps } from './_Popover.types';

export function Popover({ align = 'bottom', children, onOpenChange }: PopoverProps) {
	const { createMergedRef, handleContentClick, id, popoverRef } = usePopover({
		align,
		onOpenChange,
	});

	const [trigger, popoverContent] = Children.toArray(children) as [ReactElement, ReactElement];

	return (
		<>
			{cloneElement(trigger, {
				popovertarget: id,
				ref: createMergedRef(trigger),
			})}
			<S.PopoverContent id={id} popover="auto" ref={popoverRef} onClick={handleContentClick}>
				{popoverContent}
			</S.PopoverContent>
		</>
	);
}
