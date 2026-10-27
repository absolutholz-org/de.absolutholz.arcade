import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../components/Breadcrumb/_Breadcrumb.types';
import type { PageContainerVariant } from '../../components/PageContainer/_PageContainer.types';
import type { BaseLayoutWithSiteHeaderAndSiteFooterProps } from '../../layouts/BaseLayoutWithSiteHeaderAndSiteFooter/_BaseLayoutWithSiteHeaderAndSiteFooter.types';

export interface MarkdownPageTemplateProps extends Omit<BaseLayoutWithSiteHeaderAndSiteFooterProps, 'children'> {
	/**
	 * Document title used for metadata and tab title.
	 */
	title: string;
	/**
	 * Optional breadcrumb items rendered above the markdown content.
	 */
	breadcrumbItems?: BreadcrumbItem[];
	/**
	 * Width constraint variant for the enclosing PageContainer.
	 * @default 'slim'
	 */
	containerWidth?: PageContainerVariant;
	/**
	 * Optional primary action button or controls anchored at the bottom of the document.
	 */
	primaryAction?: ReactNode;
	/**
	 * Main prose / markdown content children.
	 */
	children?: ReactNode;
}
