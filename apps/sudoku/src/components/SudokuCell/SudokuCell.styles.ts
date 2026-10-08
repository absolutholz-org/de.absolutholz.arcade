import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	margin: 0;
	border: none;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-family: inherit;
	font-variant-numeric: tabular-nums;
	font-size: 1.5rem;
	line-height: 1;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	transition: transform 180ms cubic-bezier(0.2, 0, 0, 1),
		background-color 150ms ease,
		color 150ms ease,
		box-shadow 180ms ease,
		border-radius 150ms ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	/* Clue vs user entry styling */
	&[data-clue='true'] {
		font-weight: 400;
		color: ${themeColor('text-1')};
	}

	&[data-clue='false'] {
		font-weight: 600;
		color: ${themeColor('accent')};
	}

	/* Peer cell highlighting (soft light tint on row, column, and block) */
	&[data-peer-cell='true'] {
		background-color: color-mix(in srgb, ${themeColor('accent')} 14%, ${themeColor('surface')});
	}

	/* Peer digit highlighting (matching numbers across the board) */
	&[data-peer-digit='true'] {
		background-color: ${themeColor('accent')};
		color: ${themeColor('accent-contrast')};
		font-weight: 600;

		> span {
			color: ${themeColor('accent-contrast')};
		}
	}

	/* Active selected cell: elevated and zoomed pop-out */
	&[data-active='true'] {
		transform: scale(1.35);
		z-index: 10;
		border-radius: var(--radius-md) !important;
		background-color: ${themeColor('surface')} !important;
		color: ${themeColor('accent')} !important;
		box-shadow: 0 0 0 2px ${themeColor('accent')}, 0 4px 16px rgba(0, 0, 0, 0.16);

		> span {
			color: ${themeColor('accent')} !important;
			font-weight: 600;
		}

		> [data-slot='notes'] {
			> span {
				color: ${themeColor('text-1')};
				font-weight: 700;
			}
		}
	}

	/* Error / duplicate conflict */
	&[data-invalid='true'] {
		background-color: color-mix(in srgb, #ef4444 20%, ${themeColor('surface')}) !important;
		color: #ef4444 !important;

		> span {
			color: #ef4444 !important;
		}
	}

	&[data-invalid='true'][data-active='true'] {
		box-shadow: 0 0 0 2px #ef4444, 0 4px 16px rgba(239, 68, 68, 0.25);
	}

	/* Focus state for keyboard navigation */
	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -2px;
	}

	/* Notes candidate grid */
	> [data-slot='notes'] {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		width: 100%;
		height: 100%;
		padding: 0.125rem;
		box-sizing: border-box;
		pointer-events: none;

		> span {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.625rem;
			font-weight: 500;
			color: ${themeColor('text-3')};
			line-height: 1;

			&[data-empty='true'] {
				visibility: hidden;
			}

			&[data-highlighted='true'] {
				font-weight: 800;
				color: ${themeColor('accent')};
			}
		}
	}
`;
