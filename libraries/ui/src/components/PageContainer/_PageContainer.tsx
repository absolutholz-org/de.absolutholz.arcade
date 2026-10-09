import type { ElementType } from 'react';
import * as S from './_PageContainer.styles';
import type { PageContainerProps } from './_PageContainer.types';

/**
 * Responsive layout container that centrally spaces and pads page content.
 * Establishes an inline-size container query context for child components.
 */
export function PageContainer<C extends ElementType = 'div'>({
	variant = 'standard',
	as,
	children,
	...rest
}: PageContainerProps<C>) {
	const Component = as || 'div';

	return (
		<S.PageContainer as={Component} data-variant={variant} {...rest}>
			{children}
		</S.PageContainer>
	);
}
