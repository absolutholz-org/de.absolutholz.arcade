import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { BaseLayout } from '../BaseLayout';
import * as S from './_BaseLayoutWithSiteHeaderAndSiteFooter.styles';
import type { BaseLayoutWithSiteHeaderAndSiteFooterProps } from './_BaseLayoutWithSiteHeaderAndSiteFooter.types';

/**
 * Foundational Tier 1 layout pairing BaseLayout with built-in SiteHeader
 * (self-resolved brand logo, title, header actions, user menu),
 * unconstrained main landmark, and SiteFooter anchored to the bottom.
 */
export function BaseLayoutWithSiteHeaderAndSiteFooter({
	children,
	breadcrumb,
	currentSlug,
	hideBrand,
	hasBorder,
	...baseLayoutProps
}: BaseLayoutWithSiteHeaderAndSiteFooterProps) {
	return (
		<BaseLayout {...baseLayoutProps}>
			<SiteHeader hideBrand={hideBrand} hasBorder={hasBorder} currentSlug={currentSlug} />
			{breadcrumb}
			<S.Main id="main-content">{children}</S.Main>
			<SiteFooter />
		</BaseLayout>
	);
}
