import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const pegTokensScope = css`
	:global(:root) {
		--cb-peg-red: light-dark(oklch(0.57 0.22 25), oklch(0.66 0.21 25));
		--cb-peg-red-ink: light-dark(oklch(0.99 0.01 25), oklch(0.14 0.02 25));

		--cb-peg-blue: light-dark(oklch(0.52 0.2 255), oklch(0.68 0.18 255));
		--cb-peg-blue-ink: light-dark(oklch(0.99 0.01 255), oklch(0.14 0.02 255));

		--cb-peg-green: light-dark(oklch(0.52 0.17 148), oklch(0.68 0.17 148));
		--cb-peg-green-ink: light-dark(oklch(0.99 0.01 148), oklch(0.14 0.02 148));

		--cb-peg-yellow: light-dark(oklch(0.82 0.17 90), oklch(0.84 0.16 90));
		--cb-peg-yellow-ink: light-dark(oklch(0.18 0.04 90), oklch(0.16 0.04 90));

		--cb-peg-purple: light-dark(oklch(0.51 0.21 305), oklch(0.68 0.19 305));
		--cb-peg-purple-ink: light-dark(oklch(0.99 0.01 305), oklch(0.14 0.02 305));

		--cb-peg-orange: light-dark(oklch(0.65 0.2 52), oklch(0.73 0.18 52));
		--cb-peg-orange-ink: light-dark(oklch(0.16 0.03 52), oklch(0.14 0.03 52));

		--cb-peg-teal: light-dark(oklch(0.54 0.14 198), oklch(0.7 0.14 198));
		--cb-peg-teal-ink: light-dark(oklch(0.99 0.01 198), oklch(0.14 0.02 198));

		--cb-peg-pink: light-dark(oklch(0.58 0.21 350), oklch(0.72 0.19 350));
		--cb-peg-pink-ink: light-dark(oklch(0.99 0.01 350), oklch(0.14 0.02 350));

		--cb-peg-border: light-dark(oklch(0.2 0.02 260 / 0.28), oklch(0.95 0.01 260 / 0.28));
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

	&[data-color='red'] {
		background-color: var(--cb-peg-red);
		color: var(--cb-peg-red-ink);
	}

	&[data-color='blue'] {
		background-color: var(--cb-peg-blue);
		color: var(--cb-peg-blue-ink);
	}

	&[data-color='green'] {
		background-color: var(--cb-peg-green);
		color: var(--cb-peg-green-ink);
	}

	&[data-color='yellow'] {
		background-color: var(--cb-peg-yellow);
		color: var(--cb-peg-yellow-ink);
	}

	&[data-color='purple'] {
		background-color: var(--cb-peg-purple);
		color: var(--cb-peg-purple-ink);
	}

	&[data-color='orange'] {
		background-color: var(--cb-peg-orange);
		color: var(--cb-peg-orange-ink);
	}

	&[data-color='teal'] {
		background-color: var(--cb-peg-teal);
		color: var(--cb-peg-teal-ink);
	}

	&[data-color='pink'] {
		background-color: var(--cb-peg-pink);
		color: var(--cb-peg-pink-ink);
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
