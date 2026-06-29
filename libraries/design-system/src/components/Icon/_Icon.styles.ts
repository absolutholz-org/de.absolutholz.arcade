import styled from '@emotion/styled';
import { ICON_SIZES } from './_Icon.constants';
import type { IconSize } from './_Icon.types';

export const Icon = styled.span<{
	$size: IconSize;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	vertical-align: middle;
	line-height: 1;

	/* Width and height are controlled by the custom size key */
	width: ${({ $size }) => ICON_SIZES[$size]};
	height: ${({ $size }) => ICON_SIZES[$size]};

	/* Emojis scale with font-size matching container size */
	font-size: ${({ $size }) => ICON_SIZES[$size]};

	/* Inherit text color by default */
	color: currentColor;

	/* Reset default user agent SVG behaviors to fit parent container */
	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;
