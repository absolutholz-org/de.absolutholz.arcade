import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';

export const HeaderUserMenu = styled.div`
	display: inline-flex;
	align-items: center;

	.user-profile-button {
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

		.user-avatar {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			position: relative;
			width: 1.25rem;
			height: 1.25rem;
			border-radius: ${radiusScale.pill};
			background-color: oklch(from var(--color-text-1) l c h / 0.1);
			color: var(--color-text-1);
			overflow: hidden;
			flex-shrink: 0;

			.user-avatar-initials {
				font-size: 0.6875rem;
				font-weight: 700;
				line-height: 1;
				letter-spacing: 0.02em;
				text-transform: uppercase;
			}

			> img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			> svg {
				width: 75%;
				height: 75%;
			}
		}

		@media (max-width: 640px) {
			padding: 0.625rem;

			.user-name,
			> span[data-slot='content'] {
				display: none;
			}

			.user-avatar {
				width: 1rem;
				height: 1rem;

				.user-avatar-initials {
					font-size: 0.5625rem;
				}
			}
		}
	}
`;
