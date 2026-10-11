import type { ElementType } from 'react';
import { PageContainer } from '../PageContainer';
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
	const resolvedHomeHref = brandHref || homeHref;

	return (
		<S.SiteHeader as={Component} data-variant={variant} {...rest}>
			<PageContainer>
				<div className="header-container">
					{variant === 'standard' && (brandLogo || brandTitle) ? (
						<div className="header-brand">
							<a
								href={resolvedHomeHref}
								className="header-brand-link"
								aria-label={brandTitle ? undefined : homeAriaLabel}
							>
								{brandLogo}
								{brandTitle ? <span className="header-app-title">{brandTitle}</span> : null}
							</a>
						</div>
					) : null}
					{children}
					{actions ? <div className="header-actions">{actions}</div> : null}
				</div>
			</PageContainer>
		</S.SiteHeader>
	);
}
