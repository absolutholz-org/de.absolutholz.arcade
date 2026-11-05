import { ALL_GAMES, ALL_TOOLS, getActiveCategories } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { getCategoryLabel } from '@arcade/lib-i18n/utils/taxonomy';
import { useMemo } from 'react';
import packageJson from '../../../package.json';
import { Logo } from '../Logo';
import { PageContainer } from '../PageContainer';
import { VisuallyHidden } from '../VisuallyHidden';
import * as S from './_SiteFooter.styles';
import type { SiteFooterLinkItem, SiteFooterProps } from './_SiteFooter.types';

const GITHUB_REPO_URL = 'https://github.com/absolutholz-org/de.absolutholz.arcade';
const STORYBOOK_URL = '/storybook';

/**
 * Reusable structured site footer establishing information hierarchy for
 * brand, game catalog, player profile/settings, platform resources, and legal compliance.
 */
export function SiteFooter({
	aboutAriaLabel,
	aboutHeading,
	aboutLinks: propAboutLinks,
	arcadeAriaLabel,
	arcadeHeading,
	arcadeLinks: propArcadeLinks,
	ariaLabel,
	catalogAriaLabel,
	catalogHeading,
	catalogLinks: propCatalogLinks,
	children,
	copyright,
	copyrightAriaLabel,
	legalAriaLabel,
	legalLinks: propLegalLinks,
	resourceLinks,
	resourcesAriaLabel,
	version = packageJson.version,
}: SiteFooterProps) {
	const { t, language } = useI18n('common');
	const currentLang = (language ?? 'en') as SupportedLanguageCode;
	const resolvedHomeHref = `/${currentLang}/`;

	// Tier 1 - Column 2: Catalog links
	const catalogLinks = useMemo<SiteFooterLinkItem[]>(() => {
		if (propCatalogLinks) {
			return propCatalogLinks;
		}
		const activeCategories = getActiveCategories(ALL_GAMES);
		const categoryItems: SiteFooterLinkItem[] = activeCategories.map(({ category }) => ({
			href: `/${currentLang}/categories/${category}`,
			label: getCategoryLabel(category, currentLang),
		}));
		const toolItems: SiteFooterLinkItem[] = ALL_TOOLS.map((tool) => ({
			href: `/${currentLang}${tool.route}`,
			label: t(`tools.${tool.id}.title`) || tool.name,
		}));
		return [...categoryItems, ...toolItems];
	}, [propCatalogLinks, currentLang, t]);

	// Tier 1 - Column 3: Arcade progress / meta links
	const arcadeLinks = useMemo<SiteFooterLinkItem[]>(() => {
		if (propArcadeLinks) {
			return propArcadeLinks;
		}
		return [
			{ href: `/${currentLang}/medals`, label: t('navigation.medals') },
			{ href: `/${currentLang}/stats`, label: t('navigation.stats') },
			{ href: `/${currentLang}/settings`, label: t('navigation.settings') },
		];
	}, [propArcadeLinks, currentLang, t]);

	// Tier 1 - Column 4: Platform & Development links
	const aboutLinks = useMemo<SiteFooterLinkItem[]>(() => {
		if (propAboutLinks) {
			return propAboutLinks;
		}
		if (resourceLinks) {
			return resourceLinks;
		}
		return [
			{ href: `/${currentLang}/accessibility`, label: t('navigation.accessibility') },
			{ external: true, href: GITHUB_REPO_URL, label: 'Source Code (GitHub)' },
			{ external: true, href: STORYBOOK_URL, label: 'Design System (Storybook)' },
		];
	}, [propAboutLinks, resourceLinks, currentLang, t]);

	// Tier 2: Sub-footer legal links
	const defaultLegalLinks = useMemo<SiteFooterLinkItem[]>(
		() => [
			{ href: `/${currentLang}/privacy`, label: t('navigation.privacy') },
			{ href: `/${currentLang}/imprint`, label: t('navigation.imprint') },
		],
		[currentLang, t],
	);

	const resolvedLegalLinks = propLegalLinks ?? defaultLegalLinks;

	// Accessible landmark labels
	const resolvedFooterAriaLabel = ariaLabel ?? t('navigation.footer');
	const resolvedCatalogAriaLabel = catalogAriaLabel ?? t('navigation.catalog');
	const resolvedCatalogHeading = catalogHeading ?? t('navigation.catalog');
	const resolvedArcadeAriaLabel = arcadeAriaLabel ?? t('app.title');
	const resolvedArcadeHeading = arcadeHeading ?? t('app.title');
	const resolvedAboutAriaLabel = aboutAriaLabel ?? resourcesAriaLabel ?? t('navigation.about');
	const resolvedAboutHeading = aboutHeading ?? t('navigation.about');
	const resolvedLegalAriaLabel = legalAriaLabel ?? t('navigation.legal');
	const resolvedCopyrightAriaLabel = copyrightAriaLabel ?? 'Copyright notice';

	const hasCatalog = catalogLinks.length > 0;
	const hasArcade = arcadeLinks.length > 0;
	const hasAbout = aboutLinks.length > 0;
	const hasLegal = resolvedLegalLinks.length > 0;
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
		<S.SiteFooter as="footer" aria-label={resolvedFooterAriaLabel}>
			<PageContainer>
				{/* Tier 1: Primary 4-Column Grid */}
				<div className="site-footer-grid">
					{/* Column 1: Brand & Actions */}
					<div className="site-footer-column site-footer-brand-column">
						<a href={resolvedHomeHref} className="site-footer-brand-link">
							<Logo size="sm" />
							<span className="site-footer-brand-title">{t('app.title')}</span>
						</a>
						<p className="site-footer-tagline">{t('app.tagline')}</p>
						<div className="footer-share-slot" data-share-slot="" />
					</div>

					{/* Column 2: Catalog Directory */}
					{hasCatalog ? (
						<nav aria-label={resolvedCatalogAriaLabel} className="site-footer-column">
							<h2 className="site-footer-heading">{resolvedCatalogHeading}</h2>
							{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/noRedundantRoles: VoiceOver requires explicit role="list" on ul with list-style: none */}
							<ul role="list" className="site-footer-list">
								{catalogLinks.map((link) => (
									<li key={link.href} className="site-footer-list-item">
										<a href={link.href} hrefLang={link.hrefLang} className="site-footer-link">
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					) : null}

					{/* Column 3: Arcade Profile & Progress */}
					{hasArcade ? (
						<nav aria-label={resolvedArcadeAriaLabel} className="site-footer-column">
							<h2 className="site-footer-heading">{resolvedArcadeHeading}</h2>
							{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/noRedundantRoles: VoiceOver requires explicit role="list" on ul with list-style: none */}
							<ul role="list" className="site-footer-list">
								{arcadeLinks.map((link) => (
									<li key={link.href} className="site-footer-list-item">
										<a href={link.href} hrefLang={link.hrefLang} className="site-footer-link">
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					) : null}

					{/* Column 4: Platform & Development */}
					{hasAbout ? (
						<nav aria-label={resolvedAboutAriaLabel} className="site-footer-column">
							<h2 className="site-footer-heading">{resolvedAboutHeading}</h2>
							{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/noRedundantRoles: VoiceOver requires explicit role="list" on ul with list-style: none */}
							<ul role="list" className="site-footer-list">
								{aboutLinks.map((link) => (
									<li key={link.href} className="site-footer-list-item">
										<a
											href={link.href}
											hrefLang={link.hrefLang}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noopener noreferrer external' : undefined}
											aria-label={link.ariaLabel}
											className="site-footer-link"
										>
											{link.label}
											{link.external ? (
												<>
													<span aria-hidden="true" className="external-indicator">
														↗
													</span>
													<VisuallyHidden> (opens in a new tab)</VisuallyHidden>
												</>
											) : null}
										</a>
									</li>
								))}
							</ul>
						</nav>
					) : null}
				</div>

				{/* Tier 2: Legal & Utility Bar (Sub-Footer) */}
				<div className="site-footer-subfooter">
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

					{hasLegal ? (
						<nav aria-label={resolvedLegalAriaLabel} className="site-footer-legal">
							{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/noRedundantRoles: VoiceOver requires explicit role="list" on ul with list-style: none */}
							<ul role="list" className="site-footer-legal-list">
								{resolvedLegalLinks.map((link) => (
									<li key={link.href} className="site-footer-legal-item">
										<a
											href={link.href}
											hrefLang={link.hrefLang}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noopener noreferrer' : undefined}
											aria-label={link.ariaLabel}
											className="site-footer-link"
										>
											{link.label}
											{link.external ? (
												<>
													<span aria-hidden="true" className="external-indicator">
														↗
													</span>
													<VisuallyHidden> (opens in a new tab)</VisuallyHidden>
												</>
											) : null}
										</a>
									</li>
								))}
							</ul>
						</nav>
					) : null}
				</div>

				{children}
			</PageContainer>
		</S.SiteFooter>
	);
}
