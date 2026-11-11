import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from '.';
import { render } from '../../test-utils';

describe('Collapsible', () => {
	it('renders title, count badge, and children', () => {
		const { container, unmount } = render(
			<Collapsible title="Curated Levels" count={12}>
				<div>Level grid content</div>
			</Collapsible>,
		);

		expect(container.textContent).toContain('Curated Levels');
		expect(container.textContent).toContain('12');
		expect(container.textContent).toContain('Level grid content');

		const details = container.querySelector('details');
		expect(details).not.toBeNull();
		expect(details?.open).toBe(false);

		unmount();
	});

	it('renders initially open when defaultOpen is true', () => {
		const { container, unmount } = render(
			<Collapsible title="Curated Levels" defaultOpen>
				<div>Content</div>
			</Collapsible>,
		);

		const details = container.querySelector('details');
		expect(details?.open).toBe(true);

		unmount();
	});

	it('handles toggle events and updates state', () => {
		const onToggle = vi.fn();
		const { container, unmount } = render(
			<Collapsible title="Curated Levels" onToggle={onToggle}>
				<div>Content</div>
			</Collapsible>,
		);

		const details = container.querySelector('details');
		expect(details).not.toBeNull();

		act(() => {
			if (details) {
				details.dispatchEvent(new Event('toggle'));
			}
		});

		expect(onToggle).toHaveBeenCalled();

		unmount();
	});

	it('renders with custom badge slot', () => {
		const { container, unmount } = render(
			<Collapsible title="Curated Levels" badge={<span data-testid="custom-badge">New</span>}>
				<div>Content</div>
			</Collapsible>,
		);

		expect(container.textContent).toContain('New');

		unmount();
	});

	it('applies variant attribute', () => {
		const { container, unmount } = render(
			<Collapsible title="Curated Levels" variant="bordered">
				<div>Content</div>
			</Collapsible>,
		);

		const details = container.querySelector('details');
		expect(details?.getAttribute('data-variant')).toBe('bordered');

		unmount();
	});
});
