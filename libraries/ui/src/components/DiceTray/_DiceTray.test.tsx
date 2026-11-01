import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DiceTray } from '.';
import { render } from '../../test-utils';

describe('DiceTray', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it('renders default 5 dice, roll and reset buttons, and sum total', () => {
		const { container, unmount } = render(<DiceTray defaultCount={5} />);

		const diceButtons = container.querySelectorAll<HTMLButtonElement>('[data-held]');
		expect(diceButtons.length).toBe(5);

		const rollBtn = Array.from(container.querySelectorAll('button')).find((b) =>
			b.textContent?.includes('Roll Dice'),
		);
		const resetBtn = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Reset'));
		expect(rollBtn).toBeDefined();
		expect(resetBtn).toBeDefined();

		const totalElement = container.querySelector('strong');
		expect(totalElement).not.toBeNull();
		// Initially, 5 dice with baseline value 1 sum to 5
		expect(totalElement?.textContent).toBe('5');

		unmount();
	});

	it('triggers audio and updates aria-live announcement when rolling dice', () => {
		const playSoundMock = vi.fn();
		const handleRollComplete = vi.fn();

		const { container, unmount } = render(
			<DiceTray defaultCount={3} playRollSound={playSoundMock} onRollComplete={handleRollComplete} />,
		);

		const rollBtn = Array.from(container.querySelectorAll('button')).find((b) =>
			b.textContent?.includes('Roll Dice'),
		);
		expect(rollBtn).toBeDefined();

		act(() => {
			rollBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(playSoundMock).toHaveBeenCalledTimes(1);
		// All 3 dice were unheld, so 3 was passed to playSound
		expect(playSoundMock).toHaveBeenCalledWith(3);

		act(() => {
			vi.advanceTimersByTime(600);
		});

		const announcer = container.querySelector('[aria-live="polite"]');
		expect(announcer?.textContent).toContain('Rolled 3 dice');
		expect(announcer?.textContent).toContain('Total');

		expect(handleRollComplete).toHaveBeenCalledTimes(1);
		expect(handleRollComplete.mock.calls[0]?.[0].dice).toHaveLength(3);

		unmount();
	});

	it('updates rendered dice count when changing count selector', () => {
		const handleCountChange = vi.fn();
		const { container, unmount } = render(<DiceTray defaultCount={2} onCountChange={handleCountChange} />);

		let diceButtons = container.querySelectorAll<HTMLButtonElement>('[data-held]');
		expect(diceButtons.length).toBe(2);

		// Find the segment button for "5d"
		const segment5d = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]')).find((b) =>
			b.textContent?.includes('5d'),
		);
		expect(segment5d).toBeDefined();

		act(() => {
			segment5d?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(handleCountChange).toHaveBeenCalledWith(5);

		diceButtons = container.querySelectorAll<HTMLButtonElement>('[data-held]');
		expect(diceButtons.length).toBe(5);

		const announcer = container.querySelector('[aria-live="polite"]');
		expect(announcer?.textContent).toBe('Selected 5 dice.');

		unmount();
	});

	it('toggles hold state and preserves held dice when rolling', () => {
		const { container, unmount } = render(<DiceTray defaultCount={3} />);

		const firstDie = container.querySelectorAll<HTMLButtonElement>('[data-held]')[0];
		expect(firstDie).toBeDefined();

		act(() => {
			firstDie?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(firstDie?.getAttribute('data-held')).toBe('true');
		expect(firstDie?.getAttribute('aria-pressed')).toBe('true');

		const announcer = container.querySelector('[aria-live="polite"]');
		expect(announcer?.textContent).toBe('Die 1 held.');

		unmount();
	});

	it('resets all dice to baseline value 1 and unheld on reset button click', () => {
		const { container, unmount } = render(<DiceTray defaultCount={4} />);

		// Hold die 1
		const firstDie = container.querySelectorAll<HTMLButtonElement>('[data-held]')[0];
		act(() => {
			firstDie?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(firstDie?.getAttribute('data-held')).toBe('true');

		const resetBtn = Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes('Reset'));
		act(() => {
			resetBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const diceButtons = container.querySelectorAll<HTMLButtonElement>('[data-held]');
		for (const button of diceButtons) {
			expect(button.getAttribute('data-held')).toBe('false');
		}

		const total = container.querySelector('strong');
		expect(total?.textContent).toBe('4');

		const announcer = container.querySelector('[aria-live="polite"]');
		expect(announcer?.textContent).toBe('Reset 4 dice. Total 4.');

		unmount();
	});
});
