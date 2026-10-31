import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameSegmentedControl } from '.';
import { render } from '../../test-utils';
import type { GameSegmentedOption } from './_GameSegmentedControl.types';

const SAMPLE_OPTIONS: GameSegmentedOption[] = [
	{ id: 'all', label: 'All Games' },
	{ id: 'sudoku', label: 'Sudoku', icon: '🔢' },
	{ id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
	{ id: 'nonogram', label: 'Nonogram', icon: '🎨' },
];

describe('GameSegmentedControl', () => {
	it('renders as a tablist with options and emojis', () => {
		const { container, unmount } = render(
			<GameSegmentedControl
				options={SAMPLE_OPTIONS}
				selectedId="sudoku"
				onSelect={() => {}}
				ariaLabel="Filter Games"
			/>,
		);

		const tablist = container.querySelector('[role="tablist"]');
		expect(tablist).not.toBeNull();
		expect(tablist?.getAttribute('aria-label')).toBe('Filter Games');

		const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		expect(tabs.length).toBe(4);
		expect(tabs[0].getAttribute('aria-selected')).toBe('false');
		expect(tabs[1].getAttribute('aria-selected')).toBe('true');
		expect(tabs[1].textContent).toContain('🔢');
		expect(tabs[1].textContent).toContain('Sudoku');

		unmount();
	});

	it('calls onSelect when a tab is clicked', () => {
		const handleSelect = vi.fn();
		const { container, unmount } = render(
			<GameSegmentedControl options={SAMPLE_OPTIONS} selectedId="all" onSelect={handleSelect} />,
		);

		const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		act(() => {
			tabs[2].click();
		});

		expect(handleSelect).toHaveBeenCalledWith('minesweeper');
		unmount();
	});

	it('supports keyboard navigation via ArrowRight and ArrowLeft', () => {
		const handleSelect = vi.fn();
		const { container, unmount } = render(
			<GameSegmentedControl options={SAMPLE_OPTIONS} selectedId="sudoku" onSelect={handleSelect} />,
		);

		const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		tabs[1].focus();

		act(() => {
			tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(handleSelect).toHaveBeenCalledWith('minesweeper');

		act(() => {
			tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		});
		expect(handleSelect).toHaveBeenCalledWith('all');

		unmount();
	});
});
