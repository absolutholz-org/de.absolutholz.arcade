import { describe, expect, it } from 'vitest';
import { Breadcrumb } from '.';
import { render } from '../../test-utils';
import type { BreadcrumbItem } from './_Breadcrumb.types';

const SAMPLE_ITEMS: BreadcrumbItem[] = [
	{ label: 'Arcade Home', href: '/en/', isHome: true },
	{ label: 'Medal Showcase', isCurrent: true },
];

describe('Breadcrumb', () => {
	it('renders a nav landmark with accessible label and ordered list', () => {
		const { container, unmount } = render(<Breadcrumb items={SAMPLE_ITEMS} aria-label="Breadcrumb" />);

		const nav = container.querySelector('nav');
		expect(nav).not.toBeNull();
		expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');

		const list = container.querySelector('ol');
		expect(list).not.toBeNull();
		expect(list?.getAttribute('role')).toBe('list');

		const items = container.querySelectorAll('li');
		expect(items.length).toBe(2);

		// First item is a link
		const homeLink = items[0].querySelector('a');
		expect(homeLink).not.toBeNull();
		expect(homeLink?.getAttribute('href')).toBe('/en/');
		expect(homeLink?.textContent).toBe('Arcade Home');

		// Separator
		const separator = items[0].querySelector('span[aria-hidden="true"]');
		expect(separator).not.toBeNull();
		expect(separator?.textContent).toBe('/');

		// Current item is a span with aria-current="page"
		const currentSpan = items[1].querySelector('span[aria-current="page"]');
		expect(currentSpan).not.toBeNull();
		expect(currentSpan?.textContent).toBe('Medal Showcase');
		expect(items[1].querySelector('a')).toBeNull();

		unmount();
	});

	it('returns null if there is only 1 item in the trail', () => {
		const { container, unmount } = render(<Breadcrumb items={[{ label: 'Home', href: '/' }]} />);

		expect(container.firstChild).toBeNull();
		unmount();
	});

	it('renders custom localized labels when provided on items', () => {
		const { container, unmount } = render(
			<Breadcrumb
				items={[
					{ label: 'Arcade Startseite', href: '/de/', isHome: true },
					{ label: 'Statistiken', isCurrent: true },
				]}
			/>,
		);

		const homeLink = container.querySelector('a');
		expect(homeLink?.textContent).toBe('Arcade Startseite');

		const currentSpan = container.querySelector('span[aria-current="page"]');
		expect(currentSpan?.textContent).toBe('Statistiken');

		unmount();
	});
});
