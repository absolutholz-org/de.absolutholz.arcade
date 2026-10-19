import { styled } from '@linaria/react';

export const SvgMedal = styled.svg`
	display: inline-block;
	vertical-align: middle;
	flex-shrink: 0;

	&[data-state='locked'] {
		opacity: 0.28;
	}

	&[data-state='unlocked'] {
		opacity: 1;
	}
`;
