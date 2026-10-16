import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { QuickPlayCard } from '.';
import { render } from '../../test-utils';

describe('QuickPlayCard', () => {
	it('renders default title when title is omitted', () => {
		const { container, unmount } = render(<QuickPlayCard subtitle="Procedural level" />);

		expect(container.textContent).toContain('Quick Play');
		expect(container.textContent).toContain('Procedural level');

		unmount();
	});

	it('renders custom title, subtitle, and icon', () => {
		const { container, unmount } = render(
			<QuickPlayCard
				title="Random Board"
				subtitle="Generated puzzle"
				icon={<span data-testid="icon-spark">⚡</span>}
			/>,
		);

		expect(container.textContent).toContain('Random Board');
		expect(container.textContent).toContain('Generated puzzle');
		expect(container.querySelector('[data-testid="icon-spark"]')).not.toBeNull();

		unmount();
	});

	it('handles card clicks directly', () => {
		const handleClick = vi.fn();
		const { container, unmount } = render(<QuickPlayCard onClick={handleClick} />);

		const card = container.querySelector('button');
		expect(card).not.toBeNull();

		act(() => {
			card?.click();
		});
		expect(handleClick).toHaveBeenCalledTimes(1);

		unmount();
	});
});
