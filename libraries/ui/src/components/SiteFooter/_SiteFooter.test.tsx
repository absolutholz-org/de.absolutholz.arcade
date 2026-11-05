import { describe, expect, it } from 'vitest';
import { SiteFooter } from '.';
import { render } from '../../test-utils';

describe('SiteFooter', () => {
	it('renders landmark footer with accessible label', () => {
		const { container, unmount } = render(<SiteFooter ariaLabel="Site Footer" />);

		const footer = container.querySelector('footer');
		expect(footer).not.toBeNull();
		expect(footer?.getAttribute('aria-label')).toBe('Site Footer');

		unmount();
	});

	it('renders semantic nav landmarks with distinct aria-labels and explicit role="list"', () => {
		const { container, unmount } = render(<SiteFooter />);

		const navs = container.querySelectorAll('nav');
		expect(navs.length).toBeGreaterThanOrEqual(4);

		const ariaLabels = Array.from(navs).map((nav) => nav.getAttribute('aria-label'));
		const uniqueAriaLabels = new Set(ariaLabels);
		expect(uniqueAriaLabels.size).toBe(ariaLabels.length);

		const lists = container.querySelectorAll('ul');
		expect(lists.length).toBeGreaterThanOrEqual(4);
		for (const list of lists) {
			expect(list.getAttribute('role')).toBe('list');
		}

		unmount();
	});

	it('renders Column 1 brand identity, tagline, and share slot placeholder', () => {
		const { container, unmount } = render(<SiteFooter />);

		expect(container.textContent).toContain('Classic games built with accessibility in mind.');

		const shareSlot = container.querySelector('.footer-share-slot[data-share-slot]');
		expect(shareSlot).not.toBeNull();

		unmount();
	});

	it('renders external link visual indicator and screen-reader announcement', () => {
		const { container, unmount } = render(
			<SiteFooter
				aboutLinks={[{ external: true, href: 'https://github.com/example', label: 'Source Code (GitHub)' }]}
			/>,
		);

		const externalLink = container.querySelector('a[href="https://github.com/example"]');
		expect(externalLink).not.toBeNull();
		expect(externalLink?.getAttribute('target')).toBe('_blank');
		expect(externalLink?.getAttribute('rel')).toContain('external');
		expect(externalLink?.textContent).toContain('↗');
		expect(externalLink?.textContent).toContain('(opens in a new tab)');

		unmount();
	});

	it('renders Tier 2 copyright and version', () => {
		const { container, unmount } = render(
			<SiteFooter copyright={{ currentYear: 2026, owner: 'absolutholz' }} version="1.2.3" />,
		);

		expect(container.textContent).toContain('© 2026 absolutholz');
		expect(container.textContent).toContain('v1.2.3');

		unmount();
	});

	it('renders pure taxonomy category links under Column 2 and tools under Column 3', () => {
		const { container, unmount } = render(<SiteFooter />);

		const navs = container.querySelectorAll('nav');
		const gamesNav = Array.from(navs).find((nav) => nav.querySelector('h2')?.textContent === 'Games');
		expect(gamesNav).toBeDefined();

		// Column 2 must contain category links and NOT contain tools (Dice Roller)
		const gamesNavLinks = Array.from(gamesNav?.querySelectorAll('a') ?? []).map((a) => a.getAttribute('href'));
		expect(gamesNavLinks.some((href) => href?.includes('/categories/logic-deduction'))).toBe(true);
		expect(gamesNavLinks.some((href) => href?.includes('/tools/dice'))).toBe(false);

		const arcadeNav = Array.from(navs).find((nav) => nav.querySelector('h2')?.textContent === 'Arcade');
		expect(arcadeNav).toBeDefined();

		// Column 3 must contain medals, stats, settings, and dice roller
		const arcadeNavLinks = Array.from(arcadeNav?.querySelectorAll('a') ?? []).map((a) => a.getAttribute('href'));
		expect(arcadeNavLinks.some((href) => href?.includes('/medals'))).toBe(true);
		expect(arcadeNavLinks.some((href) => href?.includes('/stats'))).toBe(true);
		expect(arcadeNavLinks.some((href) => href?.includes('/settings'))).toBe(true);
		expect(arcadeNavLinks.some((href) => href?.includes('/tools/dice'))).toBe(true);

		unmount();
	});
});
