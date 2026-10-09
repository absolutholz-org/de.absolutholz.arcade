import type { ElementType } from 'react';
import * as S from './_MarkdownContent.styles';
import type { MarkdownContentProps } from './_MarkdownContent.types';

/**
 * MarkdownContent component encapsulates semantic typography and prose styling
 * for rendered Markdown blocks, static documentation, and informational pages.
 */
export function MarkdownContent<C extends ElementType = 'article'>({
	variant = 'standard',
	as,
	children,
	...rest
}: MarkdownContentProps<C>) {
	const Component = as || 'article';

	return (
		<S.MarkdownContent as={Component} data-variant={variant} {...rest}>
			{children}
		</S.MarkdownContent>
	);
}
