import type { DieState } from '@arcade/lib-dice';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Die } from '.';
import { render } from '../../test-utils';

function createMockDie(overrides: Partial<DieState> = {}): DieState {
	return {
		id: 'die-1',
		sides: 6,
		value: 4,
		isHeld: false,
		isRolling: false,
		...overrides,
	};
}

describe('Die', () => {
	it('renders accessible button with aria-pressed false for unheld die', () => {
		const state = createMockDie({ value: 3, isHeld: false });
		const { container, unmount } = render(<Die state={state} index={0} />);

		const button = container.querySelector('button');
		expect(button).not.toBeNull();
		expect(button?.getAttribute('aria-pressed')).toBe('false');
		expect(button?.getAttribute('aria-label')).toBe('Die 1: 3');
		expect(button?.getAttribute('data-held')).toBe('false');

		// Lock indicator should not be rendered when not held
		expect(container.textContent).not.toContain('Held');

		unmount();
	});

	it('renders with aria-pressed true and visible lock badge when held', () => {
		const state = createMockDie({ value: 5, isHeld: true });
		const { container, unmount } = render(<Die state={state} index={2} />);

		const button = container.querySelector('button');
		expect(button?.getAttribute('aria-pressed')).toBe('true');
		expect(button?.getAttribute('aria-label')).toBe('Die 3: 5, held');
		expect(button?.getAttribute('data-held')).toBe('true');
		expect(container.textContent).toContain('Held');

		unmount();
	});

	it('triggers onToggleHold on click', () => {
		const handleToggle = vi.fn();
		const state = createMockDie({ id: 'die-abc', value: 6 });
		const { container, unmount } = render(<Die state={state} onToggleHold={handleToggle} />);

		const button = container.querySelector('button');
		expect(button).not.toBeNull();

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(handleToggle).toHaveBeenCalledWith('die-abc');
		unmount();
	});

	it('triggers onToggleHold on Enter and Space keydown events', () => {
		const handleToggle = vi.fn();
		const state = createMockDie({ id: 'die-xyz', value: 2 });
		const { container, unmount } = render(<Die state={state} onToggleHold={handleToggle} />);

		const button = container.querySelector('button');
		expect(button).not.toBeNull();

		act(() => {
			button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		});
		expect(handleToggle).toHaveBeenCalledTimes(1);
		expect(handleToggle).toHaveBeenCalledWith('die-xyz');

		act(() => {
			button?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		});
		expect(handleToggle).toHaveBeenCalledTimes(2);
		expect(handleToggle).toHaveBeenLastCalledWith('die-xyz');

		// Irrelevant keys should not trigger onToggleHold
		act(() => {
			button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		});
		expect(handleToggle).toHaveBeenCalledTimes(2);

		unmount();
	});

	it('reflects rolling state on the 3D cube', () => {
		const state = createMockDie({ value: 1, isRolling: true });
		const { container, unmount } = render(<Die state={state} isRolling={true} />);

		const cube = container.querySelector('[data-face="1"]');
		expect(cube).not.toBeNull();
		expect(cube?.getAttribute('data-rolling')).toBe('true');

		unmount();
	});
});
