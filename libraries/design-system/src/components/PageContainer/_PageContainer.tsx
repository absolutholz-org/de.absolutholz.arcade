import type { ElementType } from 'react';
import * as S from './_PageContainer.styles';
import type { PageContainerProps } from './_PageContainer.types';

/**
 * Responsive layout container that centrally spaces and pads page content.
 */
export function PageContainer<C extends ElementType = 'div'>({
	variant = 'standard',
	as,
	children,
}: PageContainerProps<C>) {
	const Component = as || 'div';

	return (
		<S.PageContainer as={Component} $variant={variant}>
			{children}
		</S.PageContainer>
	);
}
