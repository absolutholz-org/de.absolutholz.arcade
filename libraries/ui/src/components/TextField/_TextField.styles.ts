import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const TextField = styled.div`
	display: inline-flex;
	flex-direction: column;
	gap: 0.375rem;
	width: auto;
	min-width: 0;

	/* Full-width modifier */
	&[data-full-width='true'] {
		width: 100%;
	}

	/* Disabled modifier */
	&[data-disabled='true'] {
		opacity: 0.6;
		cursor: not-allowed;

		> [data-slot='label'] {
			cursor: not-allowed;
		}

		> [data-slot='input-wrapper'] {
			cursor: not-allowed;
			background-color: ${themeColor('container-2')};
		}
	}

	/* Label slot */
	> [data-slot='label'] {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1.25;
		color: ${themeColor('text-1')};
		user-select: none;

		> [data-slot='required'] {
			color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
		}
	}

	/* Input wrapper slot */
	> [data-slot='input-wrapper'] {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		border: 1px solid ${themeColor('container-2')};
		border-radius: ${radiusScale.lg};
		background-color: ${themeColor('container-1')};
		transition: border-color 150ms ease, box-shadow 150ms ease;

		/* Native input */
		> input {
			width: 100%;
			height: 100%;
			border: none;
			background: transparent;
			color: ${themeColor('text-1')};
			font-family: inherit;
			outline: none;

			&::placeholder {
				color: ${themeColor('text-3')};
				opacity: 1;
			}

			&:disabled {
				cursor: not-allowed;
			}
		}

		/* Leading and trailing icon slots */
		> [data-slot='leading-icon'],
		> [data-slot='trailing-icon'] {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			color: ${themeColor('text-2')};
			flex-shrink: 0;
			user-select: none;
		}

		/* Focus-visible ring */
		&:has(input:focus-visible) {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
			border-color: ${themeColor('accent')};
		}
	}

	/* Sizing presets */
	&[data-size='sm'] > [data-slot='input-wrapper'] {
		min-height: 2rem;
		padding: 0 0.75rem;
		gap: 0.375rem;

		> input {
			font-size: 0.8125rem;
		}
	}

	&[data-size='md'] > [data-slot='input-wrapper'] {
		min-height: 2.625rem;
		padding: 0 0.875rem;
		gap: 0.5rem;

		> input {
			font-size: 0.9375rem;
		}
	}

	&[data-size='lg'] > [data-slot='input-wrapper'] {
		min-height: 3.125rem;
		padding: 0 1.125rem;
		gap: 0.625rem;

		> input {
			font-size: 1.0625rem;
		}
	}

	/* Validation Error state */
	&[data-invalid='true'] {
		> [data-slot='input-wrapper'] {
			border-color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));

			&:has(input:focus-visible) {
				outline-color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
				border-color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
			}
		}
	}

	/* Error message slot */
	> [data-slot='error'] {
		font-size: 0.8125rem;
		line-height: 1.3;
		font-weight: 500;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
	}

	/* Helper text slot */
	> [data-slot='helper'] {
		font-size: 0.8125rem;
		line-height: 1.3;
		color: ${themeColor('text-2')};
	}

	/* Forced Colors Mode support (High Contrast) */
	@media (forced-colors: active) {
		> [data-slot='input-wrapper'] {
			border: 1px solid ButtonBorder;

			&:has(input:focus-visible) {
				outline: 2px solid Highlight;
			}
		}

		&[data-invalid='true'] > [data-slot='input-wrapper'] {
			border: 2px solid Mark;
		}
	}
`;
