import type { ElementType } from 'react';
import * as S from './_Text.styles';
import type { SemanticVariant, TextProps } from './_Text.types';

const VARIANT_COMPONENTS: Record<SemanticVariant, typeof S.Text> = {
	base: S.Text,
	small: S.Small,
	h3: S.H3,
	h2: S.H2,
	h1: S.H1,
	display: S.Display,
};

/**
 * Text component that enforces locked typography scale keys (size and line-height pairings)
 * and weight keys to protect consumer layouts.
 */
export function Text<C extends ElementType = 'div'>({ variant = 'base', wrap = 'pretty', as, children }: TextProps<C>) {
	const Component = as || 'div';
	const StyledComponent = VARIANT_COMPONENTS[variant] || S.Text;
	const wrapAttr = wrap !== 'pretty' ? wrap : undefined;

	return (
		<StyledComponent as={Component} data-wrap={wrapAttr}>
			{children}
		</StyledComponent>
	);
}
