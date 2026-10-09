import { css } from '@linaria/core';
import { typographyCssTokensCompact, typographyCssTokensExpanded } from '../components/Text/_Text.constants';
import { generateFontShorthand } from '../components/Text/_Text.functions';
import { radiusCssTokens } from './radius/radius.constants';
import { reset } from './reset/reset.css';
import { spacingCssTokensCompact, spacingCssTokensExpanded } from './spacing';
import { getThemeMapping } from './theme/theme.utils';
import { themesetBaseCss } from './theme/themeset-base.css';
import { themesetBuckeyePrideCss } from './theme/themeset-buckeye-pride.css';
import { themesetChristmasCss } from './theme/themeset-christmas.css';
import { themesetClevelandGridironCss } from './theme/themeset-cleveland-gridiron.css';
import { themesetEasterCss } from './theme/themeset-easter.css';
import { themesetFastFoodFunCss } from './theme/themeset-fast-food-fun.css';
import { themesetGermanyCss } from './theme/themeset-germany.css';
import { themesetHalloweenCss } from './theme/themeset-halloween.css';
import { themesetJuly4thCss } from './theme/themeset-july4th.css';
import { themesetStPatricksCss } from './theme/themeset-stpatricks.css';

/**
 * Global zero-runtime CSS block compiled via Linaria.
 * Injects Tier 1 themeset tokens, typography tokens, spacing tokens,
 * and Tier 2 functional bindings directly into :root.
 */
export const globalStyles = css`
	:global() {
		${reset}

		:root,
		[data-themeset='base'] {
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

		/* Re-bind generic functional variables for any scoped themeset container */
		[data-themeset] {
			${Object.entries(getThemeMapping('primary'))
				.map(([key, val]) => `${key}: ${val};`)
				.join('\n')}
		}

		[data-themeset='cleveland-gridiron'] {
			${themesetClevelandGridironCss}
		}

		[data-themeset='christmas'] {
			${themesetChristmasCss}
		}

		[data-themeset='easter'] {
			${themesetEasterCss}
		}

		[data-themeset='germany'] {
			${themesetGermanyCss}
		}

		[data-themeset='july4th'] {
			${themesetJuly4thCss}
		}

		[data-themeset='fast-food-fun'] {
			${themesetFastFoodFunCss}
		}

		[data-themeset='buckeye-pride'] {
			${themesetBuckeyePrideCss}
		}

		[data-themeset='stpatricks'] {
			${themesetStPatricksCss}
		}

		[data-themeset='halloween'] {
			${themesetHalloweenCss}
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

		/* Global link styling (Option 1: Context-aware underline) */
		a {
			color: var(--color-accent);
			cursor: pointer;
			text-decoration: none;
			text-underline-offset: 0.25em;
			transition: color 150ms ease, text-decoration-color 150ms ease;

			&:hover {
				text-decoration: underline;
			}

			&:focus-visible {
				border-radius: var(--radius-sm);
				outline: 2px solid var(--color-accent);
				outline-offset: 2px;
			}
		}

		/* Inline text links (articles, paragraphs, lists) guarantee WCAG 1.4.1 non-color distinction */
		p a,
		li a,
		blockquote a {
			text-decoration: underline;
			text-decoration-color: color-mix(in oklch, var(--color-accent) 50%, transparent);

			&:hover {
				text-decoration-color: var(--color-accent);
			}
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

	/* Global link styling (Option 1: Context-aware underline) */
	a {
		color: var(--color-accent);
		cursor: pointer;
		text-decoration: none;
		text-underline-offset: 0.25em;
		transition: color 150ms ease, text-decoration-color 150ms ease;

		&:hover {
			text-decoration: underline;
		}

		&:focus-visible {
			border-radius: var(--radius-sm);
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}
	}

	/* Inline text links (articles, paragraphs, lists) guarantee WCAG 1.4.1 non-color distinction */
	p a,
	li a,
	blockquote a {
		text-decoration: underline;
		text-decoration-color: color-mix(in oklch, var(--color-accent) 50%, transparent);

		&:hover {
			text-decoration-color: var(--color-accent);
		}
	}
`;
