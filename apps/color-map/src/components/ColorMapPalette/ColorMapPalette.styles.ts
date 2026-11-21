import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PaletteBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	max-width: 34rem;
	margin-inline: auto;
	padding: 0.5rem;
	border-radius: var(--radius-md);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: Canvas;
	}
`;

export const SwatchGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
`;

export const ToolGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	flex-wrap: wrap;
	justify-content: center;
`;

export const ColorSwatchButton = styled.button`
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	min-width: 44px;
	min-height: 44px;
	border-radius: var(--radius-sm);
	border: 2px solid transparent;
	font-size: 1.125rem;
	font-weight: 800;
	line-height: 1;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;

	&[data-color='0'] {
		background-color: light-dark(oklch(0.66 0.19 28), oklch(0.56 0.19 28));
		color: light-dark(oklch(0.16 0.04 28), oklch(0.98 0.01 28));
	}

	&[data-color='1'] {
		background-color: light-dark(oklch(0.84 0.16 88), oklch(0.76 0.16 88));
		color: oklch(0.18 0.04 88);
	}

	&[data-color='2'] {
		background-color: light-dark(oklch(0.70 0.15 162), oklch(0.55 0.15 162));
		color: light-dark(oklch(0.14 0.04 162), oklch(0.98 0.01 162));
	}

	&[data-color='3'] {
		background-color: light-dark(oklch(0.55 0.18 255), oklch(0.52 0.18 255));
		color: oklch(0.98 0.01 255);
	}

	&[data-selected='true'] {
		border-color: ${themeColor('text-1')};
		box-shadow: 0 0 0 2px ${themeColor('surface')}, 0 0 0 4px ${themeColor('accent')};
		transform: translateY(-0.125rem);
	}

	&:hover:not(:disabled) {
		transform: translateY(-0.125rem);
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
	}

	${focusVisibleRing}

	@media (forced-colors: active) {
		forced-color-adjust: none;
		border: 2px solid ButtonBorder;

		&[data-selected='true'] {
			border: 3px solid Highlight;
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}
`;

export const KeyHint = styled.span`
	position: absolute;
	top: 0.125rem;
	right: 0.2rem;
	font-size: 0.625rem;
	font-weight: 800;
	line-height: 1;
	opacity: 0.85;
	pointer-events: none;
`;

export const ToolToggleButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
	min-height: 44px;
	min-width: 44px;
	padding: 0.375rem 0.75rem;
	border-radius: var(--radius-sm);
	border: 1.5px solid ${themeColor('container-2')};
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	font-size: 0.8125rem;
	font-weight: 700;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

	&[data-active='true'] {
		background-color: ${themeColor('accent')};
		border-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
	}

	&:hover:not(:disabled) {
		border-color: ${themeColor('accent')};
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	${focusVisibleRing}

	@media (forced-colors: active) {
		border: 2px solid ButtonBorder;
		background-color: ButtonFace;
		color: ButtonText;

		&[data-active='true'] {
			background-color: Highlight;
			color: HighlightText;
			border-color: Highlight;
		}
	}
`;
