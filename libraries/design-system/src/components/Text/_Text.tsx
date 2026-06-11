import type { ElementType } from 'react';
import { SEMANTIC_VARIANTS } from './_Text.constants';
import { generateFontShorthand } from './_Text.hooks';
import * as S from './_Text.styles';
import type { TextProps } from './_Text.types';

/**
 * Text component that enforces locked typography scale keys (size and line-height pairings)
 * and weight keys to protect consumer layouts.
 */
export function Text<C extends ElementType = 'span'>({
	variant = 'base',
	as,
	children,
	...props
}: TextProps<C>) {
	const Component = as || 'span';
	const mapping = SEMANTIC_VARIANTS[variant];
	const fontShorthand = generateFontShorthand(mapping.scale, mapping.weight);

	return (
		<S.Text as={Component} $fontShorthand={fontShorthand} {...props}>
			{children}
		</S.Text>
	);
}
