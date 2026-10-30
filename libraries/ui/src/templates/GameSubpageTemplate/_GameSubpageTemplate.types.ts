import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../components/Breadcrumb/_Breadcrumb.types';
import type { PageContainerVariant } from '../../components/PageContainer/_PageContainer.types';
import type { BaseLayoutWithSiteHeaderAndSiteFooterProps } from '../../layouts/BaseLayoutWithSiteHeaderAndSiteFooter/_BaseLayoutWithSiteHeaderAndSiteFooter.types';

export interface GameSubpageActionItem {
	label: string;
	href: string;
	ariaLabel?: string;
}

export interface GameSubpageTemplateProps extends Omit<BaseLayoutWithSiteHeaderAndSiteFooterProps, 'children'> {
	/**
	 * Page and document title used for metadata and the hero <h1>.
	 */
	title: string;
	/**
	 * Optional subtitle / lead description explaining the page context.
	 */
	subtitle?: string;
	/**
	 * Optional breadcrumb items rendered above the page title.
	 */
	breadcrumbItems?: BreadcrumbItem[];
	/**
	 * Width constraint variant for the enclosing PageContainer.
	 * @default 'standard'
	 */
	containerWidth?: PageContainerVariant;
	/**
	 * Primary call-to-action (e.g., "Play Now" / "New Game").
	 */
	primaryAction?: GameSubpageActionItem | ReactNode;
	/**
	 * Secondary action (e.g., "Back to Lobby").
	 */
	secondaryAction?: GameSubpageActionItem | ReactNode;
	/**
	 * Main page content children (e.g., <GameStatsDashboard /> or <GameMedalGrid />).
	 */
	children?: ReactNode;
}
