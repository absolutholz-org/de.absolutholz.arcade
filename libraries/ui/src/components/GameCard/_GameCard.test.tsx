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

	it('renders modeBadge alongside category badge in footer', () => {
		const { container, unmount } = render(
			<GameCard
				title="Tic-Tac-Toe"
				icon="❌"
				badge="Card & Board"
				modeBadge={{ label: '👥 2 Players', variant: 'accent' }}
				href="/tictactoe/en/"
			/>,
		);

		expect(container.textContent).toContain('Card & Board');
		expect(container.textContent).toContain('👥 2 Players');
		unmount();
	});

	it('renders multiple badges array in footer', () => {
		const { container, unmount } = render(
			<GameCard
				title="Tic-Tac-Toe"
				icon="❌"
				badges={['Card & Board', { label: 'Multiplayer', variant: 'accent' }]}
				href="/tictactoe/en/"
			/>,
		);

		expect(container.textContent).toContain('Card & Board');
		expect(container.textContent).toContain('Multiplayer');
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

	it('renders favorite button outside anchor and prevents card click propagation', () => {
		const handleCardClick = vi.fn();
		const { container, unmount } = render(
			<GameCard title="Sudoku" icon="🔢" gameId="sudoku" href="/sudoku/en/" onClick={handleCardClick} />,
		);

		const anchor = container.querySelector('a');
		expect(anchor).not.toBeNull();

		// The anchor must NOT contain the favorite button (avoids illegal nested interactive elements in HTML)
		const buttonInsideAnchor = anchor?.querySelector('button');
		expect(buttonInsideAnchor).toBeNull();

		// The favorite button exists inside the card container as a sibling
		const favoriteButton = container.querySelector('button');
		expect(favoriteButton).not.toBeNull();
		expect(favoriteButton?.getAttribute('aria-label')).toBe('Add Sudoku to favorites');

		act(() => {
			favoriteButton?.click();
		});

		// Clicking the favorite button must NOT bubble to card click handler
		expect(handleCardClick).not.toHaveBeenCalled();

		unmount();
	});
});
