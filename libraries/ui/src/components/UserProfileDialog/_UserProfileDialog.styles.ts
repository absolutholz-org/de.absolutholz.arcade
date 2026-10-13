import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const UserProfileDialog = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;

	> [data-slot='error-banner'] {
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		line-height: 1.4;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
		background-color: light-dark(oklch(0.95 0.05 25 / 0.2), oklch(0.25 0.08 25 / 0.4));
		border: 1px solid light-dark(oklch(0.55 0.22 25 / 0.3), oklch(0.72 0.2 25 / 0.4));
	}

	> [data-slot='success-banner'] {
		display: block;
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		line-height: 1.4;
		color: light-dark(oklch(0.45 0.18 145), oklch(0.75 0.18 145));
		background-color: light-dark(oklch(0.95 0.05 145 / 0.2), oklch(0.25 0.08 145 / 0.4));
		border: 1px solid light-dark(oklch(0.45 0.18 145 / 0.3), oklch(0.75 0.18 145 / 0.4));
	}

	> [data-slot='session-info'] {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0.875rem 1rem;
		border-radius: ${radiusScale.md};
		background-color: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};

		> [data-slot='session-header'] {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;

			> [data-slot='session-badge'] {
				font-size: 0.75rem;
				font-weight: 600;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				color: ${themeColor('text-3')};
			}

			> [data-slot='sync-indicator'] {
				display: inline-flex;
				align-items: center;
				gap: 0.25rem;
				font-size: 0.75rem;
				font-weight: 600;
				color: ${themeColor('accent')};
			}
		}

		> [data-slot='session-detail'] {
			font-size: 0.9375rem;
			font-weight: 500;
			color: ${themeColor('text-1')};
			word-break: break-word;
		}
	}

	> form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;

		> button[type='submit'],
		> [data-slot='primary-action'] {
			width: 100%;
		}
	}

	/* Form for display name */
	[data-slot='display-name-form'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		> button[type='submit'] {
			align-self: flex-end;
		}
	}

	/* Informational card for guests explaining local storage & cloud sync CTA */
	> [data-slot='guest-sync-card'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: ${radiusScale.md};
		background-color: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};

		> [data-slot='card-header'] {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			color: ${themeColor('text-1')};
			font-weight: 600;
			font-size: 0.9375rem;
		}

		> button {
			width: 100%;
		}
	}

	/* Cloud sync card for authenticated users */
	> [data-slot='cloud-sync-card'] {
		padding: 0.25rem 0;
	}

	/* Centered secondary actions */
	[data-slot='secondary-actions'] {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;

		> [data-slot='link-button'] {
			background: none;
			border: none;
			padding: 0.375rem 0.625rem;
			min-height: 1.5rem;
			font-size: 0.875rem;
			font-weight: 500;
			color: ${themeColor('accent')};
			cursor: pointer;
			text-decoration: none;
			border-radius: ${radiusScale.sm};
			transition: color 150ms ease, text-decoration 150ms ease;

			&:hover {
				text-decoration: underline;
			}

			&:focus-visible {
				outline: 2px solid ${themeColor('accent')};
				outline-offset: 2px;
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				text-decoration: none;
			}
		}
	}

	> [data-slot='actions'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		> button {
			width: 100%;
		}
	}
`;
