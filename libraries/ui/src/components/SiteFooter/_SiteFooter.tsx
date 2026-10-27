import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import packageJson from '../../../package.json';
import { VisuallyHidden } from '../VisuallyHidden';
import * as S from './_SiteFooter.styles';
import type { SiteFooterLinkItem, SiteFooterProps } from './_SiteFooter.types';

const BASE_RESOURCE_LINKS: SiteFooterLinkItem[] = [
	{ external: true, href: 'https://github.com/absolutholz-org/de.absolutholz.arcade', label: 'GitHub' },
	{ external: true, href: '/storybook', label: 'Storybook' },
];

/**
 * Reusable site footer providing structured clusters for legal navigation,
 * identity / copyright notice, and project resource links.
 * Self-resolves default links and translations from ambient i18n context if omitted.
 */
export function SiteFooter({
	children,
	copyright,
	copyrightAriaLabel,
	legalAriaLabel,
	legalLinks,
	resourceLinks = BASE_RESOURCE_LINKS,
	resourcesAriaLabel,
	version = packageJson.version,
}: SiteFooterProps) {
	const { t, language } = useI18n('common');
	const currentLang = language ?? 'en';

	const defaultLegalLinks: SiteFooterLinkItem[] = [
		{ href: `/${currentLang}/privacy`, label: t('navigation.privacy') },
		{ href: `/${currentLang}/imprint`, label: t('navigation.imprint') },
		{ href: `/${currentLang}/accessibility`, label: t('navigation.accessibility') },
		{ href: `/${currentLang}/settings`, label: t('navigation.settings') },
		{ href: `/${currentLang}/medals`, label: t('navigation.medals') },
	];

	const resolvedLegalLinks = legalLinks ?? defaultLegalLinks;
	const resolvedLegalAriaLabel = legalAriaLabel ?? t('navigation.legal');
	const resolvedResourcesAriaLabel = resourcesAriaLabel ?? 'Project resources';
	const resolvedCopyrightAriaLabel = copyrightAriaLabel ?? 'Copyright notice';

	const hasLegal = Boolean(resolvedLegalLinks && resolvedLegalLinks.length > 0);
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
		<S.SiteFooter>
			{hasLegal ? (
				<nav aria-label={resolvedLegalAriaLabel} className="site-footer-legal">
					<ul>
						{resolvedLegalLinks.map((link) => (
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
						<span className="site-footer-copyright" aria-label={resolvedCopyrightAriaLabel}>
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
				<nav aria-label={resolvedResourcesAriaLabel} className="site-footer-resources">
					<ul>
						{resourceLinks.map((link) => (
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
