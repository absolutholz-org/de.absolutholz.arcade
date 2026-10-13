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

	&:focus-visible,
	&[data-focused='true']:focus {
		outline: 3px solid ${themeColor('accent')};
		outline-offset: -3px;
		box-shadow: 0 0 0 2px ${themeColor('surface')}, inset 0 0 0 1px ${themeColor('accent')};
		z-index: 10;
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

	/* Pattern background fade layer with smooth radial edge vignette */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: var(--cell-pattern, none);
		-webkit-mask-image: radial-gradient(circle at center, black 28%, rgba(0, 0, 0, 0.45) 62%, transparent 90%);
		mask-image: radial-gradient(circle at center, black 28%, rgba(0, 0, 0, 0.45) 62%, transparent 90%);
		pointer-events: none;
		z-index: 0;
		opacity: 0.9;
	}

	/* Region palette using accessible light-dark OKLCH + high-contrast overlay pattern */
	&[data-region='0'] {
		background-color: light-dark(oklch(0.93 0.05 25), oklch(0.24 0.05 25));
		--cell-pattern: var(--pattern-diagonal-forward);
	}
	&[data-region='1'] {
		background-color: light-dark(oklch(0.93 0.05 65), oklch(0.24 0.05 65));
		--cell-pattern: var(--pattern-diagonal-reverse);
	}
	&[data-region='2'] {
		background-color: light-dark(oklch(0.94 0.05 100), oklch(0.25 0.05 100));
		--cell-pattern: var(--pattern-horizontal-stripes);
	}
	&[data-region='3'] {
		background-color: light-dark(oklch(0.93 0.05 140), oklch(0.24 0.05 140));
		--cell-pattern: var(--pattern-vertical-stripes);
	}
	&[data-region='4'] {
		background-color: light-dark(oklch(0.93 0.05 175), oklch(0.24 0.05 175));
		--cell-pattern: var(--pattern-cross-hatch);
	}
	&[data-region='5'] {
		background-color: light-dark(oklch(0.93 0.05 215), oklch(0.24 0.05 215));
		--cell-pattern: var(--pattern-fine-dots);
	}
	&[data-region='6'] {
		background-color: light-dark(oklch(0.93 0.05 255), oklch(0.24 0.05 255));
		--cell-pattern: var(--pattern-checker-dots);
	}
	&[data-region='7'] {
		background-color: light-dark(oklch(0.93 0.05 295), oklch(0.24 0.05 295));
		--cell-pattern: var(--pattern-cross-diagonal);
	}
	&[data-region='8'] {
		background-color: light-dark(oklch(0.93 0.05 330), oklch(0.24 0.05 330));
		--cell-pattern: var(--pattern-chevron);
	}
	&[data-region='9'] {
		background-color: light-dark(oklch(0.93 0.04 45), oklch(0.24 0.04 45));
		--cell-pattern: var(--pattern-diamond-mesh);
	}
	&[data-region='10'] {
		background-color: light-dark(oklch(0.93 0.04 195), oklch(0.24 0.04 195));
		--cell-pattern: var(--pattern-brick);
	}
	&[data-region='11'] {
		background-color: light-dark(oklch(0.93 0.04 280), oklch(0.24 0.04 280));
		--cell-pattern: var(--pattern-solid);
	}

	/* Base icon scaling and placement */
	& svg {
		display: block;
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
		pointer-events: none;
		position: relative;
		animation: iconPop 130ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	@keyframes iconPop {
		0% {
			transform: scale(0.65);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		& svg {
			animation: none;
		}
	}

	/* State styling */
	&[data-state='empty'] {
		color: transparent;
	}

	&[data-state='mark'] {
		color: light-dark(oklch(0.28 0.02 250), oklch(0.96 0.01 250));
		z-index: 1;

		& svg {
			width: clamp(1.125rem, 58%, 2.5rem);
			height: clamp(1.125rem, 58%, 2.5rem);
			opacity: 0.92;
			filter: drop-shadow(0 1px 1px light-dark(rgba(255, 255, 255, 0.65), rgba(0, 0, 0, 0.75)));
		}
	}

	&[data-state='token'] {
		color: light-dark(oklch(0.62 0.2 68), oklch(0.86 0.18 78));
		z-index: 2;

		& svg {
			width: clamp(1.125rem, 62%, 2.75rem);
			height: clamp(1.125rem, 62%, 2.75rem);
			filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))
				drop-shadow(0 0 1px light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.8)));
		}
	}

	/* Soft error conflict state */
	&[data-conflict='true'] {
		background-color: light-dark(oklch(0.88 0.12 25), oklch(0.35 0.12 25)) !important;
		color: light-dark(oklch(0.42 0.22 25), oklch(0.95 0.18 25)) !important;
		box-shadow: inset 0 0 0 2px light-dark(oklch(0.5 0.22 25), oklch(0.75 0.2 25));
		animation: conflictShake 240ms ease-in-out;

		& svg {
			filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
		}
	}

	@keyframes conflictShake {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-2px); }
		75% { transform: translateX(2px); }
	}
`;
