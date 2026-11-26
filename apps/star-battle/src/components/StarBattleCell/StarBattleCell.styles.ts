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
	border-color: oklch(from ${themeColor('text-1')} l c h / 0.16);
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

	/* Region palette: subtle alpha over surface so all 12 hues stay true while X marks and Stars pop */
	&[data-region] {
		background-color: oklch(from var(--region-color, ${themeColor('surface')}) l c h / 0.26);
	}
	&[data-region='0'] { --region-color: ${themeColor('rainbow-1')}; }
	&[data-region='1'] { --region-color: ${themeColor('rainbow-2')}; }
	&[data-region='2'] { --region-color: ${themeColor('rainbow-3')}; }
	&[data-region='3'] { --region-color: ${themeColor('rainbow-4')}; }
	&[data-region='4'] { --region-color: ${themeColor('rainbow-5')}; }
	&[data-region='5'] { --region-color: ${themeColor('rainbow-6')}; }
	&[data-region='6'] { --region-color: ${themeColor('rainbow-7')}; }
	&[data-region='7'] { --region-color: ${themeColor('rainbow-8')}; }
	&[data-region='8'] { --region-color: ${themeColor('rainbow-9')}; }
	&[data-region='9'] { --region-color: ${themeColor('rainbow-10')}; }
	&[data-region='10'] { --region-color: ${themeColor('rainbow-11')}; }
	&[data-region='11'] { --region-color: ${themeColor('rainbow-12')}; }

	& svg[data-pattern='true'] {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: ${themeColor('text-1')};
		opacity: 0.24;
		pointer-events: none;
		z-index: 0;
	}

	/* Dim optional region pattern under X marks and hide it behind Stars so placed tokens stay crisp */
	&[data-state='mark'] svg[data-pattern='true'] {
		opacity: 0.12;
	}

	&[data-state='token'] svg[data-pattern='true'] {
		opacity: 0;
	}

	/* Base icon scaling and placement */
	& svg:not([data-pattern='true']) {
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
		& svg:not([data-pattern='true']) {
			animation: none;
		}
	}

	/* State styling */
	&[data-state='empty'] {
		color: transparent;
	}

	&[data-state='mark'] {
		color: ${themeColor('text-1')};
		z-index: 1;

		& svg:not([data-pattern='true']) {
			width: clamp(1.125rem, 58%, 2.5rem);
			height: clamp(1.125rem, 58%, 2.5rem);
			opacity: 0.92;
			filter: drop-shadow(0 1px 1px oklch(from ${themeColor('surface')} l c h / 0.65));
		}
	}

	&[data-state='token'] {
		color: light-dark(oklch(0.68 0.2 76), oklch(0.86 0.18 82));
		z-index: 2;

		&::after {
			content: '';
			position: absolute;
			inset: 8%;
			border-radius: 9999px;
			background: radial-gradient(
				circle,
				oklch(from ${themeColor('surface')} l c h / 0.88) 0%,
				oklch(from ${themeColor('surface')} l c h / 0.55) 55%,
				transparent 75%
			);
			pointer-events: none;
			z-index: 0;
		}

		& svg:not([data-pattern='true']) {
			width: clamp(1.125rem, 62%, 2.75rem);
			height: clamp(1.125rem, 62%, 2.75rem);
			z-index: 1;
			filter: drop-shadow(0 0 1.5px oklch(0.12 0.01 250 / 0.95))
				drop-shadow(0 1px 2px oklch(0.12 0.01 250 / 0.7));
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
