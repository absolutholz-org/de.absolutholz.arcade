import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const TileSvg = styled.svg`
	width: 100%;
	height: 100%;
	display: block;
	overflow: visible;
	pointer-events: none;

	.track-ballast {
		fill: none;
		stroke: ${themeColor('container-2')};
		stroke-width: 44;
		stroke-linecap: butt;
		opacity: 0.55;
		transition: stroke 150ms ease, opacity 150ms ease;
	}

	.track-sleeper {
		fill: none;
		stroke: ${themeColor('text-3')};
		stroke-width: 8;
		stroke-linecap: round;
		transition: stroke 150ms ease;
	}

	.track-rail {
		fill: none;
		stroke: ${themeColor('text-1')};
		stroke-width: 7;
		stroke-linecap: butt;
		transition: stroke 150ms ease;
	}

	&[data-fixed='true'] {
		.track-ballast {
			opacity: 0.8;
		}

		.track-sleeper {
			stroke: ${themeColor('text-2')};
		}

		.track-rail {
			stroke: ${themeColor('accent')};
			stroke-width: 8;
		}
	}

	&[data-victory='true'] {
		.track-rail {
			stroke: ${themeColor('accent')};
			stroke-width: 8;
		}
	}

	&[data-error='true'] {
		.track-rail {
			stroke: #dc2626;
		}

		.track-sleeper {
			stroke: #ef4444;
		}
	}
`;

export const MarkerSvg = styled.svg`
	width: 100%;
	height: 100%;
	display: block;
	pointer-events: none;

	.cross-line {
		fill: none;
		stroke: ${themeColor('text-3')};
		stroke-width: 7;
		stroke-linecap: round;
	}

	&[data-error='true'] .cross-line {
		stroke: #dc2626;
	}

	.candidate-guide {
		fill: none;
		stroke: ${themeColor('accent')};
		stroke-width: 5;
		stroke-dasharray: 8 8;
		stroke-linecap: round;
		opacity: 0.65;
	}

	.candidate-dot {
		fill: ${themeColor('accent')};
		opacity: 0.65;
	}
`;

export const GateSvg = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	display: block;
	pointer-events: none;
	overflow: visible;
	z-index: 2;

	.gate-bar {
		fill: ${themeColor('accent')};
	}

	.gate-arrow {
		fill: ${themeColor('accent')};
	}

	.gate-badge {
		fill: ${themeColor('accent')};
		stroke: ${themeColor('surface')};
		stroke-width: 3;
	}

	.gate-text {
		fill: ${themeColor('surface')};
		font-size: 18;
		font-weight: 800;
		text-anchor: middle;
		dominant-baseline: central;
	}
`;

export const LocomotiveSvg = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	display: block;
	pointer-events: none;
	z-index: 3;
	transition: transform 150ms ease;

	&[data-direction='N'] {
		transform: rotate(-90deg);
	}

	&[data-direction='E'] {
		transform: rotate(0deg);
	}

	&[data-direction='S'] {
		transform: rotate(90deg);
	}

	&[data-direction='W'] {
		transform: rotate(180deg);
	}

	.loco-shadow {
		fill: rgba(0, 0, 0, 0.18);
	}

	.loco-body {
		fill: ${themeColor('accent')};
		stroke: ${themeColor('surface')};
		stroke-width: 3;
	}

	.loco-cab {
		fill: ${themeColor('text-1')};
	}

	.loco-window {
		fill: ${themeColor('surface')};
	}

	.loco-chimney {
		fill: ${themeColor('text-1')};
		stroke: ${themeColor('surface')};
		stroke-width: 2;
	}

	.loco-lamp {
		fill: #facc15;
	}
`;
