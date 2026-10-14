export interface BaseLayoutProps {
	title: string;
	description?: string;
	lang?: string;
	dir?: 'ltr' | 'rtl';
	canonical?: string;
	appTitle?: string;
	manifestHref?: string;
}
