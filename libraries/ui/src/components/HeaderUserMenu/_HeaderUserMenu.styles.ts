import { styled } from '@linaria/react';

export const HeaderUserMenu = styled.div`
	display: inline-flex;
	align-items: center;

	.user-trigger-content {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		max-width: 10rem;

		.user-name {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.875rem;
			font-weight: 600;
		}

		.sync-badge {
			display: inline-flex;
			align-items: center;
			opacity: 0.75;
		}
	}

	@media (max-width: 640px) {
		.user-name {
			display: none;
		}
	}
`;
