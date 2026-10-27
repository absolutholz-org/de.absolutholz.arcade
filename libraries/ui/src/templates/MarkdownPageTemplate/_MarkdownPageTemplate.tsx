import { Breadcrumb } from '../../components/Breadcrumb';
import { MarkdownContent } from '../../components/MarkdownContent';
import { PageContainer } from '../../components/PageContainer';
import { BaseLayoutWithSiteHeaderAndSiteFooter } from '../../layouts/BaseLayoutWithSiteHeaderAndSiteFooter';
import * as S from './_MarkdownPageTemplate.styles';
import type { MarkdownPageTemplateProps } from './_MarkdownPageTemplate.types';

/**
 * Tier 2 structural template for rendering prose, rules, documentation,
 * privacy, terms, and legal notices.
 *
 * Scaffolds an underlying Tier 1 BaseLayoutWithSiteHeaderAndSiteFooter,
 * centers content within a PageContainer (default: slim), renders hierarchical
 * breadcrumb navigation, and leaves top-level headings to the Markdown prose content.
 */
export function MarkdownPageTemplate({
	title,
	breadcrumbItems,
	containerWidth = 'slim',
	primaryAction,
	children,
	...layoutProps
}: MarkdownPageTemplateProps) {
	return (
		<BaseLayoutWithSiteHeaderAndSiteFooter title={title} {...layoutProps}>
			<PageContainer variant={containerWidth}>
				{breadcrumbItems && breadcrumbItems.length > 0 ? <Breadcrumb items={breadcrumbItems} /> : null}

				<MarkdownContent>{children}</MarkdownContent>

				{primaryAction ? <S.ActionArea>{primaryAction}</S.ActionArea> : null}
			</PageContainer>
		</BaseLayoutWithSiteHeaderAndSiteFooter>
	);
}
