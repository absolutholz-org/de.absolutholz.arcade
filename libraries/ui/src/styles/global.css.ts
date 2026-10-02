import { css } from '@linaria/core';
import { typographyCssTokensCompact, typographyCssTokensExpanded } from '../components/Text/_Text.constants';
import { generateFontShorthand } from '../components/Text/_Text.functions';
import { radiusCssTokens } from './radius/radius.constants';
import { reset } from './reset/reset.css';
import { spacingCssTokensCompact, spacingCssTokensExpanded } from './spacing';
import { getThemeMapping } from './theme/theme.utils';
import { themesetBaseCss } from './theme/themeset-base.css';

/**
 * Global zero-runtime CSS block compiled via Linaria.
 * Injects Tier 1 themeset tokens, typography tokens, spacing tokens,
 * and Tier 2 functional bindings directly into :root.
 */
export const globalStyles = css`
	:global() {
		:root {
			${themesetBaseCss}

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
			background-color: var(--color-surface);
			color: var(--color-text-1);
			font: ${generateFontShorthand('base', 'regular')};
		}
	}
`;

/**
 * Dynamic helper used in Storybook decorators to switch themesets on the fly.
 */
export const getGlobalStyles = (themesetCss: string = themesetBaseCss): string => `
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
		font: ${generateFontShorthand('base', 'regular')};
	}
`;
