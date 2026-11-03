import { describe, expect, it } from 'vitest';
import { GamesGrid } from '.';
import { render } from '../../test-utils';

describe('GamesGrid', () => {
	it('renders children within grid container', () => {
		const { container, unmount } = render(
			<GamesGrid>
				<div data-testid="item-1">Item 1</div>
				<div data-testid="item-2">Item 2</div>
			</GamesGrid>,
		);

		expect(container.querySelector('[data-testid="item-1"]')).not.toBeNull();
		expect(container.querySelector('[data-testid="item-2"]')).not.toBeNull();

		unmount();
	});

	it('renders custom polymorphic tag', () => {
		const { container, unmount } = render(
			<GamesGrid as="ul">
				<li>Item 1</li>
			</GamesGrid>,
		);

		const ul = container.querySelector('ul');
		expect(ul).not.toBeNull();

		unmount();
	});
});
