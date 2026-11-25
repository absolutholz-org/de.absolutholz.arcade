import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const IslandGroup = styled.g`
	cursor: pointer;
	outline: none;

	&:focus-visible circle.focus-ring {
		stroke: ${themeColor('text-1')};
		opacity: 1;
	}

	&[data-selected='true'] circle.island-circle {
		stroke: ${themeColor('accent')};
		stroke-width: 4;
		filter: drop-shadow(0 0 6px ${themeColor('accent')});
	}

	&[data-state='satisfied'] circle.island-circle {
		stroke: ${themeColor('accent')};
		fill: ${themeColor('container-1')};
	}

	&[data-state='overflow'] circle.island-circle {
		stroke: ${themeColor('status-danger')};
		fill: ${themeColor('container-1')};
	}
`;

export const IslandCircle = styled.circle`
	fill: ${themeColor('surface')};
	stroke: ${themeColor('text-1')};
	stroke-width: 3;
	transition: stroke 150ms ease, fill 150ms ease, stroke-width 150ms ease;
`;

export const IslandText = styled.text`
	fill: ${themeColor('text-1')};
	font-family: inherit;
	font-size: 1.125rem;
	font-weight: 700;
	text-anchor: middle;
	dominant-baseline: central;
	user-select: none;
	pointer-events: none;
`;

export const HitArea = styled.circle`
	fill: transparent;
	pointer-events: all;
`;

export const FocusRing = styled.circle`
	fill: none;
	stroke: transparent;
	stroke-width: 2.5;
	stroke-dasharray: 4 2.5;
	opacity: 0;
	pointer-events: none;
	transition: opacity 120ms ease;
`;
