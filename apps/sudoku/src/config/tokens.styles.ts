import { css } from '@linaria/core';

export const shapeTokenColors = css`
	&[data-shape-token='1'] {
		color: light-dark(oklch(0.52 0.21 25), oklch(0.72 0.19 25));
	}

	&[data-shape-token='2'] {
		color: light-dark(oklch(0.50 0.20 255), oklch(0.74 0.17 255));
	}

	&[data-shape-token='3'] {
		color: light-dark(oklch(0.50 0.17 150), oklch(0.74 0.17 150));
	}

	&[data-shape-token='4'] {
		color: light-dark(oklch(0.54 0.18 65), oklch(0.76 0.16 70));
	}

	&[data-shape-token='5'] {
		color: light-dark(oklch(0.50 0.21 300), oklch(0.74 0.18 300));
	}

	&[data-shape-token='6'] {
		color: light-dark(oklch(0.50 0.15 200), oklch(0.75 0.14 200));
	}

	&[data-shape-token='7'] {
		color: light-dark(oklch(0.52 0.21 345), oklch(0.74 0.19 345));
	}

	&[data-shape-token='8'] {
		color: light-dark(oklch(0.46 0.20 275), oklch(0.72 0.17 275));
	}

	&[data-shape-token='9'] {
		color: light-dark(oklch(0.50 0.16 115), oklch(0.76 0.16 115));
	}

	@media (forced-colors: active) {
		&[data-shape-token] {
			color: inherit;
		}
	}
`;
