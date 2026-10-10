import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const SiteHeader = styled.header`
	width: 100%;

	&[data-variant='standard'] {
		align-items: center;
		border-bottom: 1px solid var(--color-container-2);
		display: flex;
		height: 4rem;
		min-height: 4rem;

		.header-container {
			justify-content: space-between;
		}
	}

	&[data-variant='minimal'] {
		border-bottom: none;
		display: flex;
		justify-content: flex-end;
		padding-block: ${space('md')};

		.header-container {
			justify-content: flex-end;
		}
	}

	.header-container {
		align-items: center;
		display: flex;
		height: 100%;
		margin: 0 auto;
	}

	.header-brand {
		align-items: center;
		display: inline-flex;
		gap: ${space('sm')};
	}

	.header-logo-link {
		align-items: center;
		display: inline-flex;
	}

	.header-logo-link,
	.header-app-title-link {
		&:hover {
			text-decoration: none;
		}
	}

	.header-app-title-link {
		align-items: center;
		color: var(--color-text-1);
		display: inline-flex;

		&:hover .header-app-title {
			color: var(--color-accent);
		}
	}

	.header-app-title {
		color: inherit;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.2;
		transition: color 120ms ease;
	}

	.header-actions {
		align-items: center;
		display: flex;
	}
`;
