import type { ElementType } from 'react';
import packageJson from '../../../package.json';
import { VisuallyHidden } from '../VisuallyHidden';
import * as S from './_SiteFooter.styles';
import type { SiteFooterProps } from './_SiteFooter.types';

/**
 * Reusable site footer providing structured clusters for legal navigation,
 * identity / copyright notice, and project resource links.
 */
export function SiteFooter<C extends ElementType = 'footer'>({
	as,
	children,
	copyright,
	copyrightAriaLabel = 'Copyright notice',
	legalAriaLabel = 'Legal',
	legalLinks,
	resourceLinks,
	resourcesAriaLabel = 'Project resources',
	version = packageJson.version,
}: SiteFooterProps<C>) {
	const Component = as || 'footer';

	const hasLegal = Boolean(legalLinks && legalLinks.length > 0);
	const hasResources = Boolean(resourceLinks && resourceLinks.length > 0);
	const hasIdentity = copyright !== false || Boolean(version);

	const resolvedOwner =
		typeof copyright === 'object' && copyright !== null
			? (copyright.owner ?? 'absolutholz')
			: typeof copyright === 'string'
				? undefined
				: 'absolutholz';

	const resolvedCurrentYear =
		typeof copyright === 'object' && copyright !== null
			? (copyright.currentYear ?? new Date().getFullYear())
			: new Date().getFullYear();

	const startYear = typeof copyright === 'object' && copyright !== null ? copyright.startYear : undefined;
	const isRange = typeof startYear === 'number' && startYear < resolvedCurrentYear;

	return (
		<S.SiteFooter as={Component}>
			{hasLegal ? (
				<nav aria-label={legalAriaLabel} className="site-footer-legal">
					<ul>
						{legalLinks?.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									hrefLang={link.hrefLang}
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
									aria-label={link.ariaLabel}
								>
									{link.label}
									{link.external ? <VisuallyHidden> (opens in a new tab)</VisuallyHidden> : null}
								</a>
							</li>
						))}
					</ul>
				</nav>
			) : null}

			{hasIdentity ? (
				<div className="site-footer-identity">
					{copyright !== false ? (
						<span className="site-footer-copyright" aria-label={copyrightAriaLabel}>
							{typeof copyright === 'string' ? (
								copyright
							) : (
								<>
									©{' '}
									{isRange ? (
										<>
											<time dateTime={String(startYear)}>{startYear}</time>–
										</>
									) : null}
									<time dateTime={String(resolvedCurrentYear)}>{resolvedCurrentYear}</time>
									{resolvedOwner ? ` ${resolvedOwner}` : ''}
								</>
							)}
						</span>
					) : null}
					{version ? (
						<span className="site-footer-version" aria-label={`Version ${version}`}>
							v{version}
						</span>
					) : null}
				</div>
			) : null}

			{hasResources ? (
				<nav aria-label={resourcesAriaLabel} className="site-footer-resources">
					<ul>
						{resourceLinks?.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									hrefLang={link.hrefLang}
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
									aria-label={link.ariaLabel}
								>
									{link.label}
									{link.external ? <VisuallyHidden> (opens in a new tab)</VisuallyHidden> : null}
								</a>
							</li>
						))}
					</ul>
				</nav>
			) : null}

			{children}
		</S.SiteFooter>
	);
}
