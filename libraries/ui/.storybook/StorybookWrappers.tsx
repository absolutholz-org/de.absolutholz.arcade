import type { Decorator } from '@storybook/react-vite';
import type React from 'react';
import { useEffect } from 'react';

// Load our global styles helper
import { getGlobalStyles } from '../src/styles/global.css';

// Import all themeset CSS strings statically
import { themesetBaseCss } from '../src/styles/theme/themeset-base.css';
import { themesetBuckeyePrideCss } from '../src/styles/theme/themeset-buckeye-pride.css';
import { themesetChristmasCss } from '../src/styles/theme/themeset-christmas.css';
import { themesetClevelandGridironCss } from '../src/styles/theme/themeset-cleveland-gridiron.css';
import { themesetEasterCss } from '../src/styles/theme/themeset-easter.css';
import { themesetFastFoodFunCss } from '../src/styles/theme/themeset-fast-food-fun.css';
import { themesetGermanyCss } from '../src/styles/theme/themeset-germany.css';
import { themesetHalloweenCss } from '../src/styles/theme/themeset-halloween.css';
import { themesetJuly4thCss } from '../src/styles/theme/themeset-july4th.css';
import { themesetStPatricksCss } from '../src/styles/theme/themeset-stpatricks.css';

const themesets: Record<string, string> = {
	base: themesetBaseCss,
	christmas: themesetChristmasCss,
	easter: themesetEasterCss,
	'fast-food-fun': themesetFastFoodFunCss,
	july4th: themesetJuly4thCss,
	stpatricks: themesetStPatricksCss,
	'cleveland-gridiron': themesetClevelandGridironCss,
	'buckeye-pride': themesetBuckeyePrideCss,
	germany: themesetGermanyCss,
	halloween: themesetHalloweenCss,
};

const storybookCanvasOverrides = `
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
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = (e: MediaQueryListEvent) => {
			if (scheme === 'system') {
				document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
			}
		};

		if (scheme === 'light') {
			document.documentElement.style.colorScheme = 'light';
		} else if (scheme === 'dark') {
			document.documentElement.style.colorScheme = 'dark';
		} else {
			document.documentElement.style.colorScheme = mediaQuery.matches ? 'dark' : 'light';
		}

		mediaQuery.addEventListener('change', handleChange);
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [scheme]);

	return <>{children}</>;
};

export const themeDecorator: Decorator = (Story, context) => {
	const activeThemeset = context.globals?.themeset || 'base';
	const activeScheme = context.globals?.scheme || 'system';
	const activeCss = themesets[activeThemeset] || themesetBaseCss;

	return (
		<ThemeWrapper scheme={activeScheme}>
			{/* Inject active global styles dynamically without runtime CSS-in-JS */}
			<style
				key={`${activeThemeset}-${activeScheme}`}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting dynamic storybook themeset CSS
				dangerouslySetInnerHTML={{ __html: getGlobalStyles(activeCss) }}
			/>
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting storybook canvas overrides
				dangerouslySetInnerHTML={{ __html: storybookCanvasOverrides }}
			/>
			<Story />
		</ThemeWrapper>
	);
};
