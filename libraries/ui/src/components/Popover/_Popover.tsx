import { Children, type ReactElement, cloneElement } from 'react';
import { usePopover } from './_Popover.hooks';
import * as S from './_Popover.styles';
import type { PopoverProps } from './_Popover.types';

export function Popover({ align = 'bottom', children, onOpenChange }: PopoverProps) {
	const { createMergedRef, handleContentClick, id, popoverRef } = usePopover({
		align,
		onOpenChange,
	});

	const childrenArray = Children.toArray(children);
	const trigger = childrenArray[0] as ReactElement;
	const popoverContent = childrenArray.slice(1);

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
