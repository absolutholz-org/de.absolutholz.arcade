import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { PageLayoutHeaderVariant } from '../PageLayout';

export interface GameRulesLayoutProps {
	title: string;
	description?: string;
	lang: SupportedLanguageCode;
	appTitle: string;
	appHomeHref?: string;
	basePath: string;
	currentSlug?: string;
	primaryActionLabel?: string;
	primaryActionHref?: string;
	headerVariant?: PageLayoutHeaderVariant;
}
