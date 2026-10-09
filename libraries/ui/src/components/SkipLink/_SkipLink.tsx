import * as S from './_SkipLink.styles';
import type { SkipLinkProps } from './_SkipLink.types';

/**
 * Accessible skip link component enabling keyboard and screen reader users
 * to bypass navigation landmarks and jump directly to the primary page content.
 */
export function SkipLink({ children, href = '#main-content' }: SkipLinkProps) {
	return <S.SkipLink href={href}>{children}</S.SkipLink>;
}
