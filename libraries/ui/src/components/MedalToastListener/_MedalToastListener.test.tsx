import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { ToastContainer, toast } from '../Toast';
import { MedalToastListener } from './_MedalToastListener';

describe('MedalToastListener Integration', () => {
	beforeEach(() => {
		toast.dismissAll();
	});

	afterEach(() => {
		toast.dismissAll();
	});

	it('triggers an achievement toast with a medal showcase action link when medalUnlocked fires', () => {
		const assignSpy = vi.fn();
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: {
				...window.location,
				assign: assignSpy,
			},
		});

		const { container, unmount } = render(
			<>
				<ToastContainer />
				<MedalToastListener lang="en" />
			</>,
		);

		act(() => {
			window.dispatchEvent(
				new CustomEvent('medalUnlocked', {
					detail: {
						gameId: 'sudoku',
						medals: [
							{
								id: 'sudoku_first_win',
								tier: 'bronze',
								unlockedAt: 1700000000000,
							},
						],
					},
				}),
			);
		});

		const achievementToast = container.querySelector('[data-variant="achievement"]');
		expect(achievementToast).not.toBeNull();
		expect(achievementToast?.textContent).toContain('First Victory');
		expect(achievementToast?.textContent).toContain('Sudoku');

		const actionBtn = achievementToast?.querySelector('button[aria-label*="View Showcase"]');
		expect(actionBtn).not.toBeNull();
		expect(actionBtn?.textContent).toContain('View Showcase');

		act(() => {
			(actionBtn as HTMLButtonElement).click();
		});

		expect(assignSpy).toHaveBeenCalledWith('/sudoku/en/medals');

		unmount();
	});
});
