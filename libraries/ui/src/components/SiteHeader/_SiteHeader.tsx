import type { ElementType } from 'react';
import * as S from './_SiteHeader.styles';
import type { SiteHeaderProps } from './_SiteHeader.types';

/**
 * Reusable site header providing the top landmark banner container.
 */
export function SiteHeader<C extends ElementType = 'header'>({
	actions,
	as,
	brandHref,
	brandLogo,
	brandTitle,
	children,
	homeAriaLabel = 'Home',
	homeHref = '/',
	variant = 'standard',
	...rest
}: SiteHeaderProps<C>) {
	const Component = as || 'header';

	return (
		<S.SiteHeader as={Component} data-variant={variant} {...rest}>
			<div className="header-container">
				{variant === 'standard' && (brandLogo || brandTitle) ? (
					<div className="header-brand">
						{brandLogo ? (
							<a href={homeHref} className="header-logo-link" aria-label={homeAriaLabel}>
								{brandLogo}
							</a>
						) : null}
						{brandTitle ? (
							brandHref ? (
								<a href={brandHref} className="header-app-title-link">
									<span className="header-app-title">{brandTitle}</span>
								</a>
							) : (
								<span className="header-app-title">{brandTitle}</span>
							)
						) : null}
					</div>
				) : null}
				{children}
				{actions ? <div className="header-actions">{actions}</div> : null}
			</div>
		</S.SiteHeader>
	);
}
