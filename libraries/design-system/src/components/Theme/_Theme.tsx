import type { ElementType } from 'react';
import React from 'react';
import { useThemeMapping } from './_Theme.hooks';
import type { ThemeProps } from './_Theme.types';

/**
 * Theme component that maps generic CSS custom variables to concrete theme tokens for a section of the page.
 *
 * For detailed information on the two-tier brand configuration, see the [Theming Architecture Documentation](file:///Users/swoo/Workspaces/de-absolutholz/libraries/design-system/src/styles/Themes.mdx).
 */
export function Theme<C extends ElementType = 'div'>({
	name = 'primary',
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
