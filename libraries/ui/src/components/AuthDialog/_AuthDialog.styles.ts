import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const AuthDialogContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;

	[data-slot='error-banner'] {
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		margin-bottom: 1rem;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		background-color: light-dark(oklch(0.55 0.22 25 / 0.1), oklch(0.68 0.22 25 / 0.15));
		border: 1px solid light-dark(oklch(0.55 0.22 25 / 0.25), oklch(0.68 0.22 25 / 0.3));
	}

	[data-slot='success-banner'] {
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		margin-bottom: 1rem;
		display: block;
		color: light-dark(oklch(0.5 0.18 145), oklch(0.7 0.18 145));
		background-color: light-dark(oklch(0.5 0.18 145 / 0.1), oklch(0.7 0.18 145 / 0.15));
		border: 1px solid light-dark(oklch(0.5 0.18 145 / 0.25), oklch(0.7 0.18 145 / 0.3));
	}

	[data-slot='success-state'] {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		button {
			width: 100%;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		button {
			width: 100%;
		}
	}

	[data-slot='or-divider'] {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 1rem 0;
		gap: 0.75rem;
		color: ${themeColor('text-2')};
		font-size: 0.875rem;

		&::before,
		&::after {
			content: '';
			flex: 1;
			border-bottom: 1px solid ${themeColor('container-2')};
		}
	}

	[data-slot='toggle-links'] {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1rem;

		button {
			background: none;
			border: none;
			color: ${themeColor('accent')};
			font-size: 0.875rem;
			cursor: pointer;
			text-decoration: underline;
			padding: 0.25rem 0.5rem;
			border-radius: ${radiusScale.sm};

			&:hover {
				opacity: 0.8;
			}

			&:focus-visible {
				outline: 2px solid ${themeColor('accent')};
				outline-offset: 2px;
			}
		}
	}
`;
