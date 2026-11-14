import { css } from '@linaria/core';

export const Container = css`
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	border-radius: 0.625rem;

	&[data-disabled='true'] {
		opacity: 0.6;
	}
`;

export const Input = css`
	width: 3rem;
	min-height: 2.25rem;
	padding: 0 0.25rem;
	border: none;
	background: transparent;
	text-align: center;
	font-size: 1rem;
	font-weight: 700;
	font-variant-numeric: tabular-nums;
	color: var(--color-text-1);
	appearance: textfield;
	-moz-appearance: textfield;

	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	&:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: 0.375rem;
	}

	&[data-size='sm'] {
		width: 2.5rem;
		min-height: 2rem;
		font-size: 0.9375rem;
	}
`;
