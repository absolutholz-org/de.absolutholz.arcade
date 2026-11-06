import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';

export const SwatchRow = styled.span`
	align-items: center;
	display: flex;
	gap: ${space('2xs')};
`;

export const Swatch = styled.span`
	border: 1px solid var(--color-container-2);
	border-radius: ${radiusScale.pill};
	display: inline-block;
	flex-shrink: 0;
	height: 1.5rem;
	width: 1.5rem;

	&[data-type='surface'] {
		background-color: var(--color-surface);
	}

	&[data-type='container'] {
		background-color: var(--color-container-1);
	}

	&[data-type='accent'] {
		background-color: var(--color-accent);
	}

	&[data-type='accent-secondary'] {
		background-color: var(--color-accent-secondary);
	}
`;
