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
	fullWidth = true,
	inline = false,
	justify = 'start',
	spacing = 'md',
	wrap = false,
	...props
}: StackProps<C>) {
	const Component = component || as || 'div';

	return (
		<S.Stack
			as={Component}
			data-align={align}
			data-cross-spacing={crossSpacing}
			data-direction={direction}
			data-full-width={fullWidth ? 'true' : 'false'}
			data-inline={inline ? 'true' : undefined}
			data-justify={justify}
			data-spacing={spacing}
			data-wrap={wrap ? 'true' : undefined}
			{...props}
		>
			{children}
		</S.Stack>
	);
}
