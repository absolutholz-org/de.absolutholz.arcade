import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameSelectionCard } from '.';
import { render } from '../../test-utils';

describe('GameSelectionCard', () => {
	it('renders title and children', () => {
		const { container, unmount } = render(<GameSelectionCard title="Puzzle 42">Easy Pack</GameSelectionCard>);

		expect(container.textContent).toContain('Puzzle 42');
		expect(container.textContent).toContain('Easy Pack');

		unmount();
	});

	it('renders metadata items as pills and skips falsy entries', () => {
		const { container, unmount } = render(
			<GameSelectionCard title="Heart" metadata={['Completed', false, null, 'Best: 00:12']}>
				<div data-testid="preview-artwork">Preview Artwork</div>
			</GameSelectionCard>,
		);

		expect(container.textContent).toContain('Completed');
		expect(container.textContent).toContain('Best: 00:12');
		expect(container.querySelector('[data-testid="preview-artwork"]')).not.toBeNull();

		unmount();
	});

	it('preserves ClickableCard attributes when rendered as an anchor', () => {
		const { container, unmount } = render(
			<GameSelectionCard as="a" href="/sudoku/en/game" title="Easy">
				Description
			</GameSelectionCard>,
		);

		const anchor = container.querySelector('a');
		expect(anchor).not.toBeNull();
		expect(anchor?.getAttribute('href')).toBe('/sudoku/en/game');
		expect(anchor?.getAttribute('data-density')).toBe('normal');

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
