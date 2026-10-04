import type { ElementType } from 'react';
import * as S from './_Divider.styles';
import type { DividerProps } from './_Divider.types';

/**
 * Divider component renders a horizontal separation line with optional content
 * and responsive desktop visibility controls.
 */
export function Divider<C extends ElementType = 'div'>({ as, children, hideOnDesktop = false }: DividerProps<C>) {
	const Component = as || 'div';

	return (
		// biome-ignore lint/a11y/useSemanticElements: Divider supports children content which void element <hr> cannot accommodate
		<S.Divider as={Component} data-hide-on-desktop={hideOnDesktop ? 'true' : undefined} role="separator">
			{children ? <S.Content>{children}</S.Content> : null}
		</S.Divider>
	);
}
