import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameCard } from '.';
import { render } from '../../test-utils';

describe('GameCard', () => {
	it('renders title, description, and icon', () => {
		const { container, unmount } = render(
			<GameCard title="Minesweeper" description="Clear the minefield" icon="💣" href="/minesweeper/en/" />,
		);

		expect(container.textContent).toContain('Minesweeper');
		expect(container.textContent).toContain('Clear the minefield');
		expect(container.textContent).toContain('💣');

		const anchor = container.querySelector('a');
		expect(anchor).not.toBeNull();
		expect(anchor?.getAttribute('href')).toBe('/minesweeper/en/');

		unmount();
	});

	it('renders string badge in footer', () => {
		const { container, unmount } = render(<GameCard title="Sudoku" icon="🔢" badge="Puzzle" href="/sudoku/en/" />);

		expect(container.textContent).toContain('Puzzle');
		unmount();
	});

	it('renders object badge in footer', () => {
		const { container, unmount } = render(
			<GameCard title="Sudoku" icon="🔢" badge={{ label: 'Featured', variant: 'accent' }} href="/sudoku/en/" />,
		);

		expect(container.textContent).toContain('Featured');
		unmount();
	});

	it('supports button rendering with onClick', () => {
		const handleClick = vi.fn();
		const { container, unmount } = render(
			<GameCard as="button" title="Quick Play" icon="⚡" onClick={handleClick} />,
		);

		const button = container.querySelector('button');
		expect(button).not.toBeNull();

		act(() => {
			button?.click();
		});
		expect(handleClick).toHaveBeenCalledTimes(1);

		unmount();
	});
});
