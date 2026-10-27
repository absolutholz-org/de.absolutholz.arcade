import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { HeaderActions } from '../HeaderActions';
import { HeaderUserMenu } from '../HeaderUserMenu';
import { Logo } from '../Logo';
import { PageContainer } from '../PageContainer';
import * as S from './_SiteHeader.styles';
import type { SiteHeaderProps } from './_SiteHeader.types';

/**
 * Canonical portal landmark banner component.
 * Self-resolves brand logo, title, home link to the Arcade Hub root,
 * and standard header utility actions (language, theme switchers, user menu).
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
					{children}
					<div className="header-actions">
						<HeaderActions lang={currentLang} currentSlug={currentSlug} />
						<HeaderUserMenu lang={currentLang} />
					</div>
				</div>
			</PageContainer>
		</S.SiteHeader>
	);
}
