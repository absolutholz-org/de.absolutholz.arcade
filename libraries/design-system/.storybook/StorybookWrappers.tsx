import React from 'react';
import { Global, css } from '@emotion/react';
import type { Decorator } from '@storybook/react-vite';

// Load our global styles helper
import { getGlobalStyles } from '../src/styles/global.css';

// Import all themeset CSS strings statically
import { themesetBaseCss } from '../src/styles/theme/themeset-base.css';
import { themesetChristmasCss } from '../src/styles/theme/themeset-christmas.css';
import { themesetEasterCss } from '../src/styles/theme/themeset-easter.css';
import { themesetClient2Css } from '../src/styles/theme/themeset-client2.css';

const themesets: Record<string, string> = {
	base: themesetBaseCss,
	christmas: themesetChristmasCss,
	easter: themesetEasterCss,
	client2: themesetClient2Css,
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
