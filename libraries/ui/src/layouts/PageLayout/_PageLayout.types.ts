import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { PAGE_LAYOUT_HEADER_VARIANTS } from './_PageLayout.constants';

export type PageLayoutHeaderVariant = (typeof PAGE_LAYOUT_HEADER_VARIANTS)[number];

export interface PageLayoutProps {
	title: string;
	description?: string;
	lang: SupportedLanguageCode;
	appTitle: string;
	appHomeHref?: string;
	currentSlug?: string;
	basePath?: string;
	canonicalBase?: string;
	manifestHref?: string;
	headerVariant?: PageLayoutHeaderVariant;
}
