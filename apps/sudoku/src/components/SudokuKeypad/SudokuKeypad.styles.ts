import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const KeypadContainer = styled.div`
	width: 100%;
	max-width: min(calc(100vw - 1rem), 34rem);
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	user-select: none;

	@media (min-width: 640px) {
		max-width: min(calc(100vw - 2rem), 34rem);
		gap: 0.75rem;
	}
`;

export const ActionButton = styled.button`
	flex: 1 1 0;
	min-height: 3.25rem;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.375rem 0.125rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	touch-action: manipulation;
	transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease;

	> span {
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
		padding: 0 0.125rem;
		text-align: center;
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
	}

	&:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	&[data-active='true'] {
		background-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
		border-color: ${themeColor('accent')};

		> span {
			color: ${themeColor('accent-contrast')};
		}
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	@media (min-width: 640px) {
		flex-direction: row;
		min-height: 2.75rem;
		gap: 0.375rem;
		padding: 0.5rem;

		> span {
			font-size: 0.8125rem;
		}
	}
`;

export const DigitsGrid = styled.div`
	display: grid;
	width: 100%;
	gap: 0.375rem;

	/* Default / Auto mode: 3x3 grid on mobile (< 540px), 1 row on tablet/desktop */
	&[data-layout='auto'] {
		grid-template-columns: repeat(3, 1fr);

		@media (min-width: 540px) {
			grid-template-columns: repeat(9, 1fr);
			gap: 0.25rem;
		}
	}

	&[data-layout='grid'] {
		grid-template-columns: repeat(3, 1fr);
	}

	&[data-layout='row'] {
		grid-template-columns: repeat(9, 1fr);
		gap: 0.25rem;
	}
`;

export const DigitButton = styled.button`
	min-height: 3.25rem;
	min-width: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.25rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-variant-numeric: tabular-nums;
	touch-action: manipulation;
	transition: background-color 150ms ease, transform 100ms ease;

	/* 3-column keypad styling: big prominent thumb target */
	[data-layout='grid'] &,
	[data-layout='auto'] & {
		flex-direction: row;
		gap: 0.5rem;
		min-height: 3.25rem;

		> span:first-child {
			font-size: 1.5rem;
			font-weight: 700;
			line-height: 1;
		}

		> [data-slot='count'] {
			font-size: 0.6875rem;
			font-weight: 600;
			color: ${themeColor('text-2')};
			background-color: ${themeColor('container-1')};
			padding: 0.125rem 0.375rem;
			border-radius: var(--radius-pill);
			line-height: 1;
		}

		@media (min-width: 540px) {
			[data-layout='auto'] & {
				flex-direction: column;
				gap: 0.125rem;
				min-height: 3.25rem;
				padding: 0.25rem 0;

				> span:first-child {
					font-size: 1.25rem;
				}

				> [data-slot='count'] {
					background-color: transparent;
					padding: 0;
					font-size: 0.625rem;
				}
			}
		}
	}

	/* Explicit 9-column single row styling */
	[data-layout='row'] & {
		flex-direction: column;
		gap: 0.125rem;
		min-height: 3.25rem;
		padding: 0.25rem 0;

		> span:first-child {
			font-size: 1.25rem;
			font-weight: 600;
			line-height: 1;
		}

		> [data-slot='count'] {
			font-size: 0.625rem;
			font-weight: 500;
			color: ${themeColor('text-3')};
		}
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-1')};
		transform: translateY(-1px);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&[data-complete='true'] {
		opacity: 0.25;
		cursor: default;
		pointer-events: none;
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;
