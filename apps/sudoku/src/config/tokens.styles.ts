import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';

export const shapeTokenColors = css`
	&[data-shape-token='1'] {
		color: ${themeColor('rainbow-1')};
	}

	&[data-shape-token='2'] {
		color: ${themeColor('rainbow-2')};
	}

	&[data-shape-token='3'] {
		color: ${themeColor('rainbow-3')};
	}

	&[data-shape-token='4'] {
		color: ${themeColor('rainbow-4')};
	}

	&[data-shape-token='5'] {
		color: ${themeColor('rainbow-5')};
	}

	&[data-shape-token='6'] {
		color: ${themeColor('rainbow-6')};
	}

	&[data-shape-token='7'] {
		color: ${themeColor('rainbow-8')};
	}

	&[data-shape-token='8'] {
		color: ${themeColor('rainbow-10')};
	}

	&[data-shape-token='9'] {
		color: ${themeColor('rainbow-9')};
	}

	@media (forced-colors: active) {
		&[data-shape-token] {
			color: inherit;
		}
	}
`;
