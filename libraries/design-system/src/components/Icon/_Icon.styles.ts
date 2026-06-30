import styled from '@emotion/styled';
import { ICON_SIZES } from './_Icon.constants';
import type { IconSize } from './_Icon.types';

export const Icon = styled.span<{
	$size: IconSize;
}>`
	align-items: center;

	/* Inherit text color by default */
	color: currentColor;
	display: inline-flex;
	flex-shrink: 0;

	/* Emojis scale with font-size matching container size */
	font-size: ${({ $size }) => ICON_SIZES[$size]};
	height: ${({ $size }) => ICON_SIZES[$size]};
	justify-content: center;
	line-height: 1;
	vertical-align: middle;

	/* Width and height are controlled by the custom size key */
	width: ${({ $size }) => ICON_SIZES[$size]};

	/* Reset default user agent SVG behaviors to fit parent container */
	svg {
		display: block;
		height: 100%;
		width: 100%;
	}
`;
