import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BridgeGroup = styled.g`
	cursor: pointer;

	&:hover line.bridge-line {
		stroke: ${themeColor('accent')};
	}
`;

export const BridgeLine = styled.line`
	stroke: ${themeColor('text-1')};
	stroke-linecap: round;
	transition: stroke 150ms ease, stroke-width 150ms ease;
`;

export const HitArea = styled.line`
	stroke: transparent;
	stroke-width: 24;
	stroke-linecap: round;
	pointer-events: stroke;
`;
