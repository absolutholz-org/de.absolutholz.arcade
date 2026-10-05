import * as S from './_SiteHeader.styles';
import type { SiteHeaderProps } from './_SiteHeader.types';

/**
 * Reusable site header providing the top landmark banner container.
 */
export function SiteHeader({ children }: SiteHeaderProps) {
	return <S.SiteHeader>{children}</S.SiteHeader>;
}
