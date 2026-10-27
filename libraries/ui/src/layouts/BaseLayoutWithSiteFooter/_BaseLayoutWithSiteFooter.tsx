import { SiteFooter } from '../../components/SiteFooter';
import { BaseLayout } from '../BaseLayout';
import * as S from './_BaseLayoutWithSiteFooter.styles';
import type { BaseLayoutWithSiteFooterProps } from './_BaseLayoutWithSiteFooter.types';

/**
 * Foundational Tier 1 layout pairing BaseLayout with an unconstrained
 * main landmark and SiteFooter with localized base links anchored to the bottom.
 */
export function BaseLayoutWithSiteFooter({ children, ...baseLayoutProps }: BaseLayoutWithSiteFooterProps) {
	return (
		<BaseLayout {...baseLayoutProps}>
			<S.Main id="main-content">{children}</S.Main>
			<SiteFooter />
		</BaseLayout>
	);
}
