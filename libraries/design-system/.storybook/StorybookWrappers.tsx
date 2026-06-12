import React from 'react';
import { Global, css } from '@emotion/react';
import type { Decorator } from '@storybook/react-vite';

// Load our global styles helper
import { getGlobalStyles } from '../src/styles/global.css';

// Import all themeset CSS strings statically
import { themesetBaseCss } from '../src/styles/theme/themeset-base.css';
import { themesetChristmasCss } from '../src/styles/theme/themeset-christmas.css';
import { themesetEasterCss } from '../src/styles/theme/themeset-easter.css';
import { themesetMcDonaldsCss } from '../src/styles/theme/themeset-mcdonalds.css';
import { themesetJuly4thCss } from '../src/styles/theme/themeset-july4th.css';
import { themesetStPatricksCss } from '../src/styles/theme/themeset-stpatricks.css';
import { themesetBrownsCss } from '../src/styles/theme/themeset-browns.css';
import { themesetOsuCss } from '../src/styles/theme/themeset-osu.css';
import { themesetGermanyCss } from '../src/styles/theme/themeset-germany.css';

const themesets: Record<string, string> = {
	base: themesetBaseCss,
	christmas: themesetChristmasCss,
	easter: themesetEasterCss,
	mcdonalds: themesetMcDonaldsCss,
	july4th: themesetJuly4thCss,
	stpatricks: themesetStPatricksCss,
	browns: themesetBrownsCss,
	osu: themesetOsuCss,
	germany: themesetGermanyCss,
};

const storybookCanvasOverrides = css`
	.sb-show-main,
	.docs-story {
		background-color: var(--color-surface) !important;
		color: var(--color-text-1) !important;
	}
`;

const ThemeWrapper = ({
	scheme,
	children,
}: {
	scheme: 'light' | 'dark' | 'system';
	children: React.ReactNode;
}) => {
	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = (e: MediaQueryListEvent) => {
			if (scheme === 'system') {
				document.documentElement.style.colorScheme = e.matches
					? 'dark'
					: 'light';
			}
		};

		if (scheme === 'light') {
			document.documentElement.style.colorScheme = 'light';
		} else if (scheme === 'dark') {
			document.documentElement.style.colorScheme = 'dark';
		} else {
			document.documentElement.style.colorScheme = mediaQuery.matches
				? 'dark'
				: 'light';
		}

		mediaQuery.addEventListener('change', handleChange);
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [scheme]);

	return <>{children}</>;
};

export const themeDecorator: Decorator = (Story, context) => {
	const activeThemeset = context.globals.themeset || 'base';
	const activeScheme = context.globals.scheme || 'system';
	const activeCss = themesets[activeThemeset] || themesetBaseCss;
	console.log(
		'Storybook themeDecorator activeThemeset:',
		activeThemeset,
		'activeScheme:',
		activeScheme,
	);

	return (
		<ThemeWrapper scheme={activeScheme}>
			{/* Inject active global styles dynamically */}
			<Global key={activeThemeset} styles={getGlobalStyles(activeCss)} />
			<Global styles={storybookCanvasOverrides} />
			<Story />
		</ThemeWrapper>
	);
};
