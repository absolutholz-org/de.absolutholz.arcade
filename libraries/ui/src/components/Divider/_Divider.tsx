import type { ElementType } from 'react';
import * as S from './_Divider.styles';
import type { DividerProps } from './_Divider.types';

/**
 * Divider component renders a horizontal separation line with optional content
 * and responsive desktop visibility controls.
 */
export function Divider<C extends ElementType = 'div'>({ as, children, hideOnDesktop = false }: DividerProps<C>) {
	const hideOnDesktopAttr = hideOnDesktop ? 'true' : undefined;

	if (children) {
		const Component = as || 'div';
		return (
			// biome-ignore lint/a11y/useSemanticElements: Divider with children cannot use void element <hr>
			<S.Labeled as={Component} data-hide-on-desktop={hideOnDesktopAttr} role="separator">
				<span>{children}</span>
			</S.Labeled>
		);
	}

	const Component = as || 'hr';
	return <S.Divider as={Component} data-hide-on-desktop={hideOnDesktopAttr} />;
}
