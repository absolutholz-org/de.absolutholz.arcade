import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const SwatchRow = styled.span`
	align-items: center;
	display: flex;
	gap: ${space('2xs')};
`;

export const Swatch = styled.span`
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.pill};
	display: inline-block;
	flex-shrink: 0;
	height: 1.5rem;
	width: 1.5rem;

	&[data-type='surface'] {
		background-color: ${themeColor('surface')};
	}

	&[data-type='container'] {
		background-color: ${themeColor('container-1')};
	}

	&[data-type='accent'] {
		background-color: ${themeColor('accent')};
	}

	&[data-type='accent-secondary'] {
		background-color: ${themeColor('accent-secondary')};
	}
`;
