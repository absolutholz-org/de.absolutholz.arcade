import { css } from '@emotion/react';
import { reset } from './reset/reset.css';
import { getThemeMapping } from './theme/theme.utils';
import { themesetBaseCss } from './theme/themeset-base.css';
import { spacingCssTokensCompact, spacingCssTokensExpanded } from './spacing';
import { radiusCssTokens } from './radius/radius.constants';
// eslint-disable-next-line no-restricted-imports
import {
	typographyCssTokensCompact,
	typographyCssTokensExpanded,
} from '../components/Text/_Text.constants';

export const getGlobalStyles = (themesetCss: string = themesetBaseCss) => css`
	${reset}

	:root {
		${themesetCss}

		/* Typography base/compact tokens */
		${typographyCssTokensCompact}

		/* Spacing base/compact tokens */
		${spacingCssTokensCompact}

		/* Border radius tokens */
		${radiusCssTokens}

		/* Default generic functional variables mapped to primary theme */
		${Object.entries(getThemeMapping('primary'))
			.map(([key, val]) => `${key}: ${val};`)
			.join('\n')}
	}

	/* Two-dimensional media query constraint for expanding desktop tokens */
	@media (min-width: 1024px) and (min-height: 800px) {
		:root {
			/* Typography expanded desktop scale */
			${typographyCssTokensExpanded}

			/* Spacing expanded desktop scale */
			${spacingCssTokensExpanded}
		}
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
