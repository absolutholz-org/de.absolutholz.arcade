import type { ElementType } from 'react';
import * as S from './_VisuallyHidden.styles';
import type { VisuallyHiddenProps } from './_VisuallyHidden.types';

/**
 * VisuallyHidden component hides content visually while keeping it accessible to screen readers.
 */
export function VisuallyHidden<C extends ElementType = 'span'>({ as, children }: VisuallyHiddenProps<C>) {
	const Component = as || 'span';

	return <S.VisuallyHidden as={Component}>{children}</S.VisuallyHidden>;
}
