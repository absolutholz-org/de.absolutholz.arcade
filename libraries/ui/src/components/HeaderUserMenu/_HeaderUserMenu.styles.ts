import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const HeaderUserMenu = styled.div`
	display: inline-flex;
	align-items: center;

	.user-profile-button[data-size='md'] {
		gap: 0.5rem;
		padding: 0 0.875rem;

		.user-name {
			max-width: 8rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.875rem;
			font-weight: 600;
		}

		@media (max-width: 640px) {
			width: 2.625rem;
			min-width: 2.625rem;
			max-width: 2.625rem;
			height: 2.625rem;
			padding: 0.625rem;
			aspect-ratio: 1 / 1;
			justify-content: center;

			.user-name,
			> span[data-slot='content'] {
				display: none;
			}
		}
	}
`;

export const MenuContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 17.5rem;
	max-width: 100%;

	.menu-error-banner {
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		border-radius: 0.375rem;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
		background-color: light-dark(oklch(0.55 0.22 25 / 0.1), oklch(0.68 0.22 25 / 0.15));
		border: 1px solid light-dark(oklch(0.55 0.22 25 / 0.25), oklch(0.68 0.22 25 / 0.3));
	}

	.menu-nav-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.menu-nav-button {
		width: 100%;
		justify-content: flex-start;
		text-align: left;
		font-weight: 500;
	}

	.menu-account-action {
		display: flex;
		flex-direction: column;
	}
`;

export const SummaryCard = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 0.125rem 0.125rem 0.25rem;

	.summary-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.summary-details {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;

		.summary-name {
			font-size: 0.9375rem;
			font-weight: 700;
			color: ${themeColor('text-1')};
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.summary-status {
			font-size: 0.75rem;
			color: ${themeColor('text-2')};
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.summary-tier {
		align-self: flex-start;
	}
`;
