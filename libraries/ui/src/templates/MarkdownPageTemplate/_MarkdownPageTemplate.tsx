import { Children, Fragment, type ReactNode, isValidElement } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Hero } from '../../components/Hero';
import { MarkdownContent } from '../../components/MarkdownContent';
import { PageContainer } from '../../components/PageContainer';
import { BaseLayoutWithSiteHeaderAndSiteFooter } from '../../layouts/BaseLayoutWithSiteHeaderAndSiteFooter';
import * as S from './_MarkdownPageTemplate.styles';
import type { MarkdownPageTemplateProps } from './_MarkdownPageTemplate.types';

function extractAndStripH1(children: ReactNode): {
	extractedTitle?: ReactNode;
	filteredChildren: ReactNode;
} {
	let extractedTitle: ReactNode | undefined;
	let h1Found = false;

	function filterNodes(nodes: ReactNode): ReactNode {
		return Children.map(nodes, (child) => {
			if (h1Found || !isValidElement(child)) {
				return child;
			}

			if (child.type === 'h1') {
				h1Found = true;
				extractedTitle = (child.props as { children?: ReactNode }).children;
				return null;
			}

			if (child.type === Fragment && (child.props as { children?: ReactNode }).children) {
				return filterNodes((child.props as { children?: ReactNode }).children);
			}

			return child;
		});
	}

	const filteredChildren = filterNodes(children);
	return { extractedTitle, filteredChildren };
}

/**
 * Tier 2 structural template for rendering prose, rules, documentation,
 * privacy, terms, and legal notices.
 *
 * Scaffolds an underlying Tier 1 BaseLayoutWithSiteHeaderAndSiteFooter,
 * centers content within a PageContainer (default: slim), renders hierarchical
 * breadcrumb navigation, and renders the primary page heading using Hero.
 * Identifies and strips any leading H1 heading from the content to avoid duplicate titles.
 */
export function MarkdownPageTemplate({
	title,
	breadcrumbItems,
	containerWidth = 'slim',
	primaryAction,
	children,
	...layoutProps
}: MarkdownPageTemplateProps) {
	const { extractedTitle, filteredChildren } = extractAndStripH1(children);
	const resolvedTitle = title || (typeof extractedTitle === 'string' ? extractedTitle : '');

	return (
		<BaseLayoutWithSiteHeaderAndSiteFooter title={resolvedTitle} {...layoutProps}>
			<PageContainer variant={containerWidth}>
				{breadcrumbItems && breadcrumbItems.length > 0 ? <Breadcrumb items={breadcrumbItems} /> : null}

				<Hero title={title || extractedTitle || ''} />

				<MarkdownContent>{filteredChildren}</MarkdownContent>

				{primaryAction ? <S.ActionArea>{primaryAction}</S.ActionArea> : null}
			</PageContainer>
		</BaseLayoutWithSiteHeaderAndSiteFooter>
	);
}
