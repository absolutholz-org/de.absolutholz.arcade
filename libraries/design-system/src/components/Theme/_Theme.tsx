import React from 'react';
import type { ElementType } from 'react';
import { useThemeMapping } from './_Theme.hooks';
import type { ThemeProps } from './_Theme.types';
import { DEFAULT_THEME_NAME } from './_Theme.constants';

/**
 * Theme component that maps generic CSS custom variables to concrete theme tokens for a section of the page.
 */
export function Theme<C extends ElementType = 'div'>({
	name = DEFAULT_THEME_NAME,
	as,
	style,
	children,
	...props
}: ThemeProps<C>) {
	const Component = as || 'div';
	const themeMapping = useThemeMapping(name);

	return (
		<Component
			style={
				{
					...themeMapping,
					...style,
				} as React.CSSProperties
			}
			{...props}
		>
			{children}
		</Component>
	);
}
