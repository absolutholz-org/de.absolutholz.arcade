import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const pegTokensScope = css`
	:global(:root) {
		--cb-peg-red: ${themeColor('rainbow-1')};
		--cb-peg-blue: ${themeColor('rainbow-2')};
		--cb-peg-green: ${themeColor('rainbow-3')};
		--cb-peg-yellow: ${themeColor('rainbow-4')};
		--cb-peg-purple: ${themeColor('rainbow-5')};
		--cb-peg-teal: ${themeColor('rainbow-6')};
		--cb-peg-orange: ${themeColor('rainbow-7')};
		--cb-peg-pink: ${themeColor('rainbow-8')};
		--cb-peg-border: oklch(from ${themeColor('text-1')} l c h / 0.28);
	}
`;

export const PegCircle = styled.span`
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 999rem;
	border: 0.125rem solid var(--cb-peg-border);
	box-shadow: inset 0 -0.125rem 0 oklch(0 0 0 / 0.18);
	user-select: none;
	flex-shrink: 0;

	&[data-size='sm'] {
		width: 1.875rem;
		height: 1.875rem;
	}

	&[data-size='lg'] {
		width: 2.625rem;
		height: 2.625rem;
	}

	&[data-color='red'] { --peg-color: var(--cb-peg-red); }
	&[data-color='blue'] { --peg-color: var(--cb-peg-blue); }
	&[data-color='green'] { --peg-color: var(--cb-peg-green); }
	&[data-color='yellow'] { --peg-color: var(--cb-peg-yellow); }
	&[data-color='purple'] { --peg-color: var(--cb-peg-purple); }
	&[data-color='orange'] { --peg-color: var(--cb-peg-orange); }
	&[data-color='teal'] { --peg-color: var(--cb-peg-teal); }
	&[data-color='pink'] { --peg-color: var(--cb-peg-pink); }

	&[data-color] {
		background-color: var(--peg-color);
		color: oklch(from var(--peg-color) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
	}

	@media (forced-colors: active) {
		background-color: canvas;
		color: canvastext;
		border: 0.125rem solid buttonborder;
		box-shadow: none;
	}
`;

export const PegGlyph = styled.svg`
	width: 1.125rem;
	height: 1.125rem;
	display: block;

	&[data-visible='false'] {
		display: none;
	}

	[data-size='sm'] & {
		width: 0.9375rem;
		height: 0.9375rem;
	}

	[data-size='lg'] & {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (forced-colors: active) {
		&[data-visible='false'] {
			display: block;
		}
	}
`;

export const NumberTag = styled.span`
	position: absolute;
	bottom: -0.25rem;
	right: -0.25rem;
	min-width: 1.0625rem;
	height: 1.0625rem;
	padding: 0 0.1875rem;
	border-radius: 999rem;
	background-color: light-dark(oklch(0.18 0.02 260), oklch(0.95 0.01 260));
	color: light-dark(oklch(0.98 0.01 260), oklch(0.15 0.02 260));
	font-size: 0.625rem;
	font-weight: 800;
	line-height: 1.0625rem;
	text-align: center;
	font-variant-numeric: tabular-nums;
	border: 0.0625rem solid light-dark(oklch(0.98 0 0), oklch(0.18 0 0));

	@media (forced-colors: active) {
		background-color: canvas;
		color: canvastext;
		border: 0.0625rem solid canvastext;
	}
`;
