import type { ElementType } from 'react';
import * as S from './_Stack.styles';
import type { StackProps } from './_Stack.types';

/**
 * Stack component provides a flexbox-based layout container to organize and space child elements.
 */
export function Stack<C extends ElementType = 'div'>({
	align = 'stretch',
	children,
	component,
	as,
	crossSpacing,
	direction = 'column',
	justify = 'start',
	spacing = 'md',
	wrap = false,
	...props
}: StackProps<C>) {
	const Component = component || as || 'div';

	return (
		<S.StyledStack
			as={Component}
			$direction={direction}
			$spacing={spacing}
			$crossSpacing={crossSpacing}
			$align={align}
			$justify={justify}
			$wrap={wrap}
			{...props}
		>
			{children}
		</S.StyledStack>
	);
}
