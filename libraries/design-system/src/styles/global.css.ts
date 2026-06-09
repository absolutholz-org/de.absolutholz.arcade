import { css } from '@emotion/react';
import { reset } from './reset/reset.css';
import { getThemeMapping } from './theme/theme.utils';
import { themesetStandardCss } from './theme/themeset-standard.css';

export const getGlobalStyles = (
	themesetCss: string = themesetStandardCss,
) => css`
	${reset}

	:root {
		${themesetCss}

		/* Default generic functional variables mapped to primary theme */
		${Object.entries(getThemeMapping('primary'))
			.map(([key, val]) => `${key}: ${val};`)
			.join('\n')}
	}

	/* CONTENT LAYER: Paints your brand tokens and typography rules */
	body {
		background-color: var(
			--color-surface
		); /* Applies theme surface background */
		color: var(--color-text-1); /* Applies theme base text color */
		font-synthesize: none; /* Protects font weight rendering */
	}
`;
