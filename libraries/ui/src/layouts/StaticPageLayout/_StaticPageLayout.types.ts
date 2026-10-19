import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { BreadcrumbItem } from '../../components/Breadcrumb/_Breadcrumb.types';
import type { PageContainerVariant } from '../../components/PageContainer/_PageContainer.types';
import type { PageLayoutHeaderVariant } from '../PageLayout';

export interface StaticPageLayoutProps {
	title: string;
	description?: string;
	lang: SupportedLanguageCode;
	appTitle?: string;
	appHomeHref?: string;
	currentSlug?: string;
	basePath?: string;
	canonicalBase?: string;
	manifestHref?: string;
	headerVariant?: PageLayoutHeaderVariant;
	breadcrumbItems?: BreadcrumbItem[];
	containerVariant?: PageContainerVariant;
}
