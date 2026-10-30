import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { HeaderActions } from '../HeaderActions';
import { Logo } from '../Logo';
import { PageContainer } from '../PageContainer';
import * as S from './_SiteHeader.styles';
import type { SiteHeaderProps } from './_SiteHeader.types';

/**
 * Canonical portal landmark banner component.
 * Self-resolves brand logo, title, home link to the Arcade Hub root,
 * and standard header utility actions (language, theme switchers, settings, and user menu).
 */
export function SiteHeader({
	children,
	variant = 'standard',
	hideBrand = false,
	hasBorder = true,
	currentSlug,
	...rest
}: SiteHeaderProps) {
	const { t, language } = useI18n('common');
	const currentLang = (language ?? 'en') as SupportedLanguageCode;
	const resolvedHomeHref = `/${currentLang}/`;
	const titleText = t('app.title');

	return (
		<S.SiteHeader
			as="header"
			data-variant={variant}
			data-hide-brand={hideBrand ? '' : undefined}
			data-has-border={hasBorder ? 'true' : 'false'}
			{...rest}
		>
			<PageContainer>
				<div className="header-container">
					{variant === 'standard' && !hideBrand ? (
						<div className="header-brand">
							<a href={resolvedHomeHref} className="header-brand-link">
								<Logo size="sm" />
								<span className="header-app-title">{titleText}</span>
							</a>
						</div>
					) : null}
					{variant === 'standard' ? (
						<nav aria-label={t('navigation.breadcrumb')} className="header-nav">
							<a
								href={`/${currentLang}/medals`}
								className="header-nav-link"
								aria-current={currentSlug === 'medals' ? 'page' : undefined}
							>
								{t('navigation.medals')}
							</a>
							<a
								href={`/${currentLang}/stats`}
								className="header-nav-link"
								aria-current={currentSlug === 'stats' ? 'page' : undefined}
							>
								{t('navigation.stats')}
							</a>
						</nav>
					) : null}
					{children}
					<div className="header-actions">
						<HeaderActions lang={currentLang} currentSlug={currentSlug} />
					</div>
				</div>
			</PageContainer>
		</S.SiteHeader>
	);
}
