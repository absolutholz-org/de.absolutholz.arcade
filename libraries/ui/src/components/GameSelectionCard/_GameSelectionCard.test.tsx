import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameSelectionCard } from '.';
import { render } from '../../test-utils';

describe('GameSelectionCard', () => {
	it('renders title, subtitle, and dimensions', () => {
		const { container, unmount } = render(
			<GameSelectionCard title="Puzzle 42" subtitle="Easy Pack" dimensions="6×6 Grid" />,
		);

		expect(container.textContent).toContain('Puzzle 42');
		expect(container.textContent).toContain('Easy Pack');
		expect(container.textContent).toContain('6×6 Grid');

		unmount();
	});

	it('renders optional badge and preview slots', () => {
		const { container, unmount } = render(
			<GameSelectionCard
				title="Heart"
				badge={{ label: 'Completed', variant: 'success' }}
				preview={<div data-testid="preview-artwork">Preview Artwork</div>}
			/>,
		);

		expect(container.textContent).toContain('Completed');
		expect(container.querySelector('[data-testid="preview-artwork"]')).not.toBeNull();

		unmount();
	});

	it('handles card surface clicks', () => {
		const handleClick = vi.fn();
		const { container, unmount } = render(<GameSelectionCard title="Start Game" onClick={handleClick} />);

		const card = container.querySelector('button');
		expect(card).not.toBeNull();

		act(() => {
			card?.click();
		});
		expect(handleClick).toHaveBeenCalledTimes(1);

		unmount();
	});
});
