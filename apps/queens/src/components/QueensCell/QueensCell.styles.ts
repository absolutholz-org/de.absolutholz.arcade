import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
	border-style: solid;
	border-width: 1px;
	border-color: color-mix(in srgb, ${themeColor('text-1')} 16%, transparent);
	color: ${themeColor('text-1')};
	padding: 0;
	margin: 0;
	cursor: pointer;
	user-select: none;
	touch-action: none;
	transition: background-color 150ms ease, transform 120ms ease, box-shadow 150ms ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	&:hover {
		filter: brightness(0.97);
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -2px;
		z-index: 5;
	}

	/* Dynamic border thickness matching region boundaries */
	&[data-border-top='thick'] {
		border-top-width: 2.5px;
		border-top-color: ${themeColor('text-1')};
	}

	&[data-border-bottom='thick'] {
		border-bottom-width: 2.5px;
		border-bottom-color: ${themeColor('text-1')};
	}

	&[data-border-left='thick'] {
		border-left-width: 2.5px;
		border-left-color: ${themeColor('text-1')};
	}

	&[data-border-right='thick'] {
		border-right-width: 2.5px;
		border-right-color: ${themeColor('text-1')};
	}

	/* Region palette using accessible light-dark OKLCH */
	&[data-region='0'] {
		background-color: light-dark(oklch(0.93 0.05 25), oklch(0.24 0.05 25));
	}
	&[data-region='1'] {
		background-color: light-dark(oklch(0.93 0.05 65), oklch(0.24 0.05 65));
	}
	&[data-region='2'] {
		background-color: light-dark(oklch(0.94 0.05 100), oklch(0.25 0.05 100));
	}
	&[data-region='3'] {
		background-color: light-dark(oklch(0.93 0.05 140), oklch(0.24 0.05 140));
	}
	&[data-region='4'] {
		background-color: light-dark(oklch(0.93 0.05 175), oklch(0.24 0.05 175));
	}
	&[data-region='5'] {
		background-color: light-dark(oklch(0.93 0.05 215), oklch(0.24 0.05 215));
	}
	&[data-region='6'] {
		background-color: light-dark(oklch(0.93 0.05 255), oklch(0.24 0.05 255));
	}
	&[data-region='7'] {
		background-color: light-dark(oklch(0.93 0.05 295), oklch(0.24 0.05 295));
	}
	&[data-region='8'] {
		background-color: light-dark(oklch(0.93 0.05 330), oklch(0.24 0.05 330));
	}
	&[data-region='9'] {
		background-color: light-dark(oklch(0.93 0.04 45), oklch(0.24 0.04 45));
	}
	&[data-region='10'] {
		background-color: light-dark(oklch(0.93 0.04 195), oklch(0.24 0.04 195));
	}
	&[data-region='11'] {
		background-color: light-dark(oklch(0.93 0.04 280), oklch(0.24 0.04 280));
	}

	/* State styling */
	&[data-state='empty'] {
		color: transparent;
	}

	&[data-state='mark'] {
		color: ${themeColor('text-2')};
		font-size: 1.125rem;
		opacity: 0.75;
	}

	&[data-state='token'] {
		color: ${themeColor('accent')};
		font-size: 1.5rem;
		z-index: 2;
	}

	/* Soft error conflict state */
	&[data-conflict='true'] {
		background-color: light-dark(oklch(0.88 0.12 25), oklch(0.35 0.12 25)) !important;
		color: light-dark(oklch(0.42 0.22 25), oklch(0.9 0.18 25)) !important;
		box-shadow: inset 0 0 0 2px light-dark(oklch(0.5 0.22 25), oklch(0.75 0.2 25));
		animation: conflictShake 240ms ease-in-out;
	}

	@keyframes conflictShake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-2px); }
		75% { transform: translateX(2px); }
	}
`;
