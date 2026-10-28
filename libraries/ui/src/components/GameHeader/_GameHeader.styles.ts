import { styled } from '@linaria/react';

export const Header = styled.header`
	--game-header-height: 3.5rem;
	width: 100%;
	height: var(--game-header-height);
	min-height: var(--game-header-height);
	border-bottom: 1px solid var(--color-container-2);
	background-color: var(--color-surface);

	&[data-has-border='false'] {
		border-bottom: none;
	}

	.game-header-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		height: 100%;
		padding-inline: var(--space-xs);
		gap: var(--space-2xs);
		max-width: var(--game-container-max-width, none);
		margin-inline: auto;
		box-sizing: border-box;

		@media (max-width: 359px) {
			padding-inline: var(--space-2xs);
			gap: 2px;
		}

		@media (min-width: 380px) {
			padding-inline: var(--space-md);
			gap: var(--space-xs);
		}
	}

	.game-header-left {
		justify-self: start;
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		min-width: 0;
		overflow: hidden;

		@media (min-width: 380px) {
			gap: var(--space-xs);
		}

		/* Prevent difficulty badge from overflowing or colliding on compact viewports */
		> :not(button):not(a) {
			min-width: 0;
			max-width: 3rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex-shrink: 1;

			@media (min-width: 360px) {
				max-width: 4.5rem;
			}

			@media (min-width: 380px) {
				max-width: none;
			}
		}
	}

	.game-header-center {
		justify-self: center;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		max-width: 100%;
	}

	.game-header-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		min-width: 0;
		overflow: hidden;

		@media (min-width: 380px) {
			gap: var(--space-xs);
		}
	}
`;
