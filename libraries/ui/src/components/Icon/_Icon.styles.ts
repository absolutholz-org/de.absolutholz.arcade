import { styled } from '@linaria/react';
import { ICON_SIZES } from './_Icon.constants';
import type { IconSize } from './_Icon.types';

export const Icon = styled.span<{
	$size: IconSize;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	flex-shrink: 0;
	width: ${({ $size }: { $size: IconSize }) => ICON_SIZES[$size]};
	height: ${({ $size }: { $size: IconSize }) => ICON_SIZES[$size]};
	font-size: ${({ $size }: { $size: IconSize }) => ICON_SIZES[$size]};
	line-height: 1;
	user-select: none;
	color: currentColor;

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;
