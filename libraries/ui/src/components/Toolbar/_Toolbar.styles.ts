import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Toolbar = styled.div`
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	width: auto;
	border-radius: ${radiusScale.lg};
	outline: none;
	transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;

	/* Full width modifier */
	&[data-full-width='true'] {
		display: flex;
		width: 100%;
	}

	/* Layout Orientations */
	&[data-orientation='horizontal'] {
		flex-direction: row;
		align-items: center;

		> hr,
		> [role='separator'] {
			width: 1px;
			height: 1.5rem;
			margin-inline: ${space('2xs')};
		}
	}

	&[data-orientation='vertical'] {
		flex-direction: column;
		align-items: stretch;

		> hr,
		> [role='separator'] {
			width: 100%;
			height: 1px;
			margin-block: ${space('2xs')};
		}
	}

	/* Main-axis Alignment */
	&[data-align='start'] {
		justify-content: flex-start;
	}

	&[data-align='center'] {
		justify-content: center;
	}

	&[data-align='end'] {
		justify-content: flex-end;
	}

	&[data-align='between'] {
		justify-content: space-between;
	}

	/* Sizing Presets using design system spacing tokens */
	&[data-size='sm'] {
		padding: ${space('2xs')};
		gap: ${space('2xs')};
	}

	&[data-size='md'] {
		padding: 0.375rem;
		gap: 0.375rem;
	}

	&[data-size='lg'] {
		padding: ${space('xs')};
		gap: ${space('xs')};
	}

	/* Visual Surface Variants */
	&[data-variant='default'] {
		background-color: ${themeColor('container-1')};
		border: 1px solid var(--color-container-2);
	}

	&[data-variant='outline'] {
		background-color: transparent;
		border: 1px solid var(--color-container-2);
	}

	&[data-variant='elevated'] {
		background-color: ${themeColor('surface')};
		border: 1px solid var(--color-container-2);
		box-shadow: 0 4px 12px oklch(0% 0 0 / 0.1);
	}

	&[data-variant='ghost'] {
		background-color: transparent;
		border: 1px solid transparent;
	}

	/* Nested Separators Base */
	> hr,
	> [role='separator'] {
		border: 0;
		background-color: var(--color-container-2);
		flex-shrink: 0;
		align-self: center;
	}

	/* Nested Control Groups */
	> [role='group'] {
		display: inline-flex;
		align-items: center;
		gap: inherit;
		flex-direction: inherit;
	}

	/* Forced Colors Mode for BITV 2.0 / WCAG AA High Contrast */
	@media (forced-colors: active) {
		border: 1px solid CanvasText;

		> hr,
		> [role='separator'] {
			background-color: CanvasText;
		}
	}
`;
