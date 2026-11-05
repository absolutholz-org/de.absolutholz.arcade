import { ALL_GAMES, ALL_TOOLS, getActiveCategories } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { getCategoryLabel } from '@arcade/lib-i18n/utils/taxonomy';
import { useEffect, useMemo, useState } from 'react';
import packageJson from '../../../package.json';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { PageContainer } from '../PageContainer';
import { ShareDialog } from '../ShareDialog';
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
	gamesAriaLabel,
	gamesHeading,
	gamesLinks: propGamesLinks,
	legalAriaLabel,
	legalLinks: propLegalLinks,
	resourceLinks,
	resourcesAriaLabel,
	version = packageJson.version,
}: SiteFooterProps) {
	const { t, language } = useI18n('common');
	const currentLang = (language ?? 'en') as SupportedLanguageCode;
	const resolvedHomeHref = `/${currentLang}/`;

	const [isShareOpen, setIsShareOpen] = useState(false);
	const [shareUrl, setShareUrl] = useState(resolvedHomeHref);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setShareUrl(`${window.location.origin}${resolvedHomeHref}`);
		}
	}, [resolvedHomeHref]);

	// Tier 1 - Column 2: Games category directory links (pure taxonomy, no tools)
	const gamesLinks = useMemo<SiteFooterLinkItem[]>(() => {
		const customLinks = propGamesLinks ?? propCatalogLinks;
		if (customLinks) {
			return customLinks;
		}
		const activeCategories = getActiveCategories(ALL_GAMES);
		return activeCategories.map(({ category }) => ({
			href: `/${currentLang}/categories/${category}`,
			label: getCategoryLabel(category, currentLang),
		}));
	}, [propGamesLinks, propCatalogLinks, currentLang]);

	// Tier 1 - Column 3: Arcade progress / meta links + tools
	const arcadeLinks = useMemo<SiteFooterLinkItem[]>(() => {
		if (propArcadeLinks) {
			return propArcadeLinks;
		}
		const toolItems: SiteFooterLinkItem[] = ALL_TOOLS.map((tool) => ({
			href: `/${currentLang}${tool.route}`,
			label: t(`tools.${tool.id}.title`) || tool.name,
		}));
		return [
			{ href: `/${currentLang}/medals`, label: t('navigation.medals') },
			{ href: `/${currentLang}/stats`, label: t('navigation.stats') },
			{ href: `/${currentLang}/settings`, label: t('navigation.settings') },
			...toolItems,
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
	const resolvedGamesAriaLabel = gamesAriaLabel ?? catalogAriaLabel ?? t('navigation.games');
	const resolvedGamesHeading = gamesHeading ?? catalogHeading ?? t('navigation.games');
	const resolvedArcadeAriaLabel = arcadeAriaLabel ?? t('app.title');
	const resolvedArcadeHeading = arcadeHeading ?? t('app.title');
	const resolvedAboutAriaLabel = aboutAriaLabel ?? resourcesAriaLabel ?? t('navigation.about');
	const resolvedAboutHeading = aboutHeading ?? t('navigation.about');
	const resolvedLegalAriaLabel = legalAriaLabel ?? t('navigation.legal');
	const resolvedCopyrightAriaLabel = copyrightAriaLabel ?? 'Copyright notice';

	const hasGames = gamesLinks.length > 0;
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
						<div className="footer-share-slot" data-share-slot="">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsShareOpen(true)}
								aria-label={t('share.shareArcade')}
								leadingIcon={<Icon name="share" size="xs" />}
							>
								{t('share.shareArcade')}
							</Button>
							<ShareDialog
								id="footer-share-dialog"
								isOpen={isShareOpen}
								onClose={() => setIsShareOpen(false)}
								title={t('share.shareArcade')}
								shareUrl={shareUrl}
								shareText={t('app.tagline')}
							/>
						</div>
					</div>

					{/* Column 2: Games Directory */}
					{hasGames ? (
						<nav aria-label={resolvedGamesAriaLabel} className="site-footer-column">
							<h2 className="site-footer-heading">{resolvedGamesHeading}</h2>
							{/* biome-ignore lint/a11y/useSemanticElements lint/a11y/noRedundantRoles: VoiceOver requires explicit role="list" on ul with list-style: none */}
							<ul role="list" className="site-footer-list">
								{gamesLinks.map((link) => (
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
