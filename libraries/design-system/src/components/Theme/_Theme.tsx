import type { ElementType } from 'react';
import React from 'react';
import { DEFAULT_THEME_NAME } from './_Theme.constants';
import { useThemeMapping } from './_Theme.hooks';
import type { ThemeProps } from './_Theme.types';

/**
 * Theme component that maps generic CSS custom variables to concrete theme tokens for a section of the page.
 */
export function Theme<C extends ElementType = 'div'>({
	name = DEFAULT_THEME_NAME,
	as,
	children,
}: ThemeProps<C>) {
	const Component = as || 'div';
	const themeMapping = useThemeMapping(name);

	return (
		<Component
			style={
				{
					...themeMapping,
				} as React.CSSProperties
			}
		>
			{children}
		</Component>
	);
}
