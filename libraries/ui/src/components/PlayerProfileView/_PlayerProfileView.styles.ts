import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const ProfileRoot = styled.main`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	min-width: 0;

	> [data-slot='page-header'] {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		> h1 {
			margin: 0;
			font-size: 2rem;
			font-weight: 800;
			line-height: 1.2;
			color: ${themeColor('text-1')};
			letter-spacing: -0.02em;
		}

		> p {
			margin: 0;
			font-size: 1rem;
			line-height: 1.5;
			color: ${themeColor('text-2')};
		}
	}

	> [data-slot='live-region'] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	> [data-slot='status-banner'] {
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		line-height: 1.4;
		color: light-dark(oklch(0.45 0.18 145), oklch(0.75 0.18 145));
		background-color: light-dark(oklch(0.95 0.05 145 / 0.2), oklch(0.25 0.08 145 / 0.4));
		border: 1px solid light-dark(oklch(0.45 0.18 145 / 0.3), oklch(0.75 0.18 145 / 0.4));
	}

	> [data-slot='error-banner'] {
		padding: 0.75rem 1rem;
		border-radius: ${radiusScale.md};
		font-size: 0.875rem;
		line-height: 1.4;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
		background-color: light-dark(oklch(0.95 0.05 25 / 0.2), oklch(0.25 0.08 25 / 0.4));
		border: 1px solid light-dark(oklch(0.55 0.22 25 / 0.3), oklch(0.72 0.2 25 / 0.4));
	}
`;

export const ProfileSection = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	padding: 1.5rem;
	border-radius: ${radiusScale.lg};
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};

	> [data-slot='section-header'] {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		> h2 {
			margin: 0;
			font-size: 1.25rem;
			font-weight: 700;
			line-height: 1.3;
			color: ${themeColor('text-1')};
		}

		> p {
			margin: 0;
			font-size: 0.875rem;
			line-height: 1.4;
			color: ${themeColor('text-2')};
		}
	}

	> form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;

		> [data-slot='identity-row'] {
			display: flex;
			align-items: flex-start;
			gap: 1.5rem;
			flex-wrap: wrap;

			> [data-slot='avatar-picker-wrapper'] {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				align-items: center;

				> [data-slot='avatar-label'] {
					font-size: 0.875rem;
					font-weight: 600;
					color: ${themeColor('text-2')};
				}
			}

			> [data-slot='name-fields'] {
				flex: 1 1 15rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;

				> [data-slot='counter-row'] {
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 0.5rem;
					font-size: 0.75rem;
					color: ${themeColor('text-2')};

					> [data-slot='error-text'] {
						color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
						font-weight: 500;
					}

					> [data-slot='char-count'] {
						margin-left: auto;
						font-variant-numeric: tabular-nums;
					}
				}
			}
		}

		> [data-slot='form-actions'] {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
	}

	> [data-slot='tier-card'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		border-radius: ${radiusScale.md};
		background-color: ${themeColor('container-2')};
		border: 1px solid ${themeColor('container-2')};

		> [data-slot='tier-header'] {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem;
			flex-wrap: wrap;

			> [data-slot='tier-title'] {
				font-size: 1.125rem;
				font-weight: 700;
				color: ${themeColor('text-1')};
			}
		}

		> [data-slot='tier-desc'] {
			margin: 0;
			font-size: 0.875rem;
			line-height: 1.4;
			color: ${themeColor('text-2')};
		}
	}

	> [data-slot='control-group'] {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		> [data-slot='control-item'] {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			> [data-slot='control-hint'] {
				font-size: 0.75rem;
				line-height: 1.4;
				color: ${themeColor('text-2')};
			}

			> [data-slot='control-disabled-warning'] {
				font-size: 0.75rem;
				line-height: 1.4;
				color: light-dark(oklch(0.6 0.18 55), oklch(0.75 0.15 55));
			}
		}
	}

	> [data-slot='tools-nav-group'] {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	> [data-slot='tool-card'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: ${radiusScale.md};
		background-color: ${themeColor('container-2')};

		> [data-slot='tool-desc'] {
			margin: 0;
			font-size: 0.875rem;
			line-height: 1.4;
			color: ${themeColor('text-2')};
		}
	}

	> [data-slot='account-card'] {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: ${radiusScale.md};
		background-color: ${themeColor('container-2')};

		> [data-slot='auth-status'] {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.875rem;
			font-weight: 600;
			color: ${themeColor('text-1')};
		}

		> [data-slot='auth-notice'] {
			margin: 0;
			font-size: 0.875rem;
			line-height: 1.4;
			color: ${themeColor('text-2')};
		}

		> [data-slot='auth-actions'] {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			flex-wrap: wrap;
		}
	}
`;
