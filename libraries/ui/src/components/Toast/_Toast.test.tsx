import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastContainer, toast } from '.';
import { render } from '../../test-utils';
import { toastStore } from './_Toast.functions';

describe('Toast Notification System', () => {
	beforeEach(() => {
		toastStore.dismissAll();
		toastStore.setMaxVisible(3);
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		toastStore.dismissAll();
	});

	describe('1. Persistent Live Region Host', () => {
		it('renders the persistent live region in the DOM before any toasts exist', () => {
			const { container, unmount } = render(<ToastContainer />);

			const host = container.querySelector('aside[role="status"]');
			expect(host).not.toBeNull();
			expect(host?.getAttribute('aria-live')).toBe('polite');
			expect(host?.getAttribute('aria-atomic')).toBe('false');

			// Initially empty of toast items
			const items = host?.querySelectorAll('[data-variant]');
			expect(items?.length).toBe(0);

			unmount();
		});

		it('retains the live region container as toasts are added and removed', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Initial message');
			});

			const host = container.querySelector('aside[role="status"]');
			expect(host?.querySelectorAll('[data-variant]').length).toBe(1);

			act(() => {
				toast.dismissAll();
			});

			// Host remains present in DOM even after all toasts are dismissed
			expect(container.querySelector('aside[role="status"]')).not.toBeNull();
			expect(host?.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});
	});

	describe('2. Focus Safety (Never Steals Focus)', () => {
		it('does not pull active keyboard focus away from active inputs when a toast appears', () => {
			const input = document.createElement('input');
			input.type = 'text';
			input.id = 'game-input';
			document.body.appendChild(input);
			input.focus();
			expect(document.activeElement).toBe(input);

			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.achievement('Level Complete!');
			});

			// Focus MUST stay on the user's active input and not be stolen by the toast
			expect(document.activeElement).toBe(input);

			input.remove();
			unmount();
		});
	});

	describe('3. Timer Contract & Hover/Focus Pause', () => {
		it('auto-dismisses after the default duration (7 seconds)', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Temporary status', { duration: 7000 });
			});

			expect(container.querySelectorAll('[data-variant]').length).toBe(1);

			// Fast-forward 6.9 seconds
			act(() => {
				vi.advanceTimersByTime(6900);
			});
			expect(container.querySelectorAll('[data-variant]').length).toBe(1);

			// Fast-forward another 200ms (total 7.1s)
			act(() => {
				vi.advanceTimersByTime(200);
			});
			expect(container.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});

		it('pauses auto-dismiss timer on mouseenter and resumes after mouseleave', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.success('File saved', { duration: 6000 });
			});

			const toastItem = container.querySelector('[data-variant]') as HTMLElement;
			expect(toastItem).not.toBeNull();

			// Advance 2 seconds
			act(() => {
				vi.advanceTimersByTime(2000);
			});

			// User hovers mouse over toast
			act(() => {
				toastItem.dispatchEvent(new Event('mouseenter'));
			});

			// Advance another 10 seconds while hovered
			act(() => {
				vi.advanceTimersByTime(10000);
			});

			// Toast must NOT be dismissed while hovered
			expect(container.querySelectorAll('[data-variant]').length).toBe(1);

			// Pointer exits
			act(() => {
				toastItem.dispatchEvent(new Event('mouseleave'));
			});

			// Remaining time was ~4000ms. Advance 3500ms
			act(() => {
				vi.advanceTimersByTime(3500);
			});
			expect(container.querySelectorAll('[data-variant]').length).toBe(1);

			// Advance final 600ms
			act(() => {
				vi.advanceTimersByTime(600);
			});
			expect(container.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});

		it('pauses auto-dismiss timer when keyboard focus is on the dismiss button and resumes on blur', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.warning('Check your connection', { duration: 6000 });
			});

			const toastItem = container.querySelector('[data-variant]') as HTMLElement;
			const dismissBtn = container.querySelector(
				'button[aria-label="Dismiss notification"]',
			) as HTMLButtonElement;
			expect(dismissBtn).not.toBeNull();

			// Advance 2 seconds
			act(() => {
				vi.advanceTimersByTime(2000);
			});

			// Focus shifts onto dismiss button
			act(() => {
				dismissBtn.focus();
				dismissBtn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
			});

			// Advance 10 seconds while focused
			act(() => {
				vi.advanceTimersByTime(10000);
			});

			// Toast must NOT dismiss while focused
			expect(container.querySelectorAll('[data-variant]').length).toBe(1);

			// Focus moves outside toast
			act(() => {
				dismissBtn.blur();
				dismissBtn.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
			});

			// Advance remaining time
			act(() => {
				vi.advanceTimersByTime(4100);
			});
			expect(container.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});
	});

	describe('4. Accessible Dismiss Action', () => {
		it('renders accessible dismiss button with aria-label and triggers dismissal on click', () => {
			const onDismiss = vi.fn();
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Dismissible message', { onDismiss });
			});

			const dismissBtn = container.querySelector(
				'button[aria-label="Dismiss notification"]',
			) as HTMLButtonElement;
			expect(dismissBtn).not.toBeNull();
			expect(dismissBtn.getAttribute('aria-label')).toBe('Dismiss notification');

			act(() => {
				dismissBtn.click();
			});

			expect(onDismiss).toHaveBeenCalledTimes(1);
			expect(container.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});
	});

	describe('5. Sequential Queue Management', () => {
		it('limits concurrently visible toasts and promotes queued toasts upon dismissal', () => {
			const { container, unmount } = render(<ToastContainer maxVisibleToasts={2} />);

			act(() => {
				toast.info('Toast 1');
				toast.info('Toast 2');
				toast.info('Toast 3');
				toast.info('Toast 4');
			});

			// Only 2 visible due to maxVisibleToasts=2
			let activeItems = container.querySelectorAll('[data-variant]');
			expect(activeItems.length).toBe(2);
			expect(activeItems[0].textContent).toContain('Toast 1');
			expect(activeItems[1].textContent).toContain('Toast 2');

			// Dismiss the first toast
			const firstDismissBtn = activeItems[0].querySelector('button') as HTMLButtonElement;
			act(() => {
				firstDismissBtn.click();
			});

			// Toast 3 should now be promoted from queue into active
			activeItems = container.querySelectorAll('[data-variant]');
			expect(activeItems.length).toBe(2);
			expect(activeItems[0].textContent).toContain('Toast 2');
			expect(activeItems[1].textContent).toContain('Toast 3');

			unmount();
		});

		it('dismisses all toasts on toast.dismissAll()', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Toast A');
				toast.success('Toast B');
				toast.achievement('Toast C');
			});

			expect(container.querySelectorAll('[data-variant]').length).toBe(3);

			act(() => {
				toast.dismissAll();
			});

			expect(container.querySelectorAll('[data-variant]').length).toBe(0);

			unmount();
		});
	});

	describe('6. Status Variants', () => {
		it('renders info, success, warning, and achievement status variants properly', () => {
			const { container, unmount } = render(<ToastContainer maxVisibleToasts={4} />);

			act(() => {
				toast.info('Info note');
				toast.success('Success note');
				toast.warning('Warning note');
				toast.achievement('Achievement note', { title: 'Trophy' });
			});

			expect(container.querySelector('[data-variant="info"]')).not.toBeNull();
			expect(container.querySelector('[data-variant="success"]')).not.toBeNull();
			expect(container.querySelector('[data-variant="warning"]')).not.toBeNull();
			expect(container.querySelector('[data-variant="achievement"]')).not.toBeNull();

			const achievement = container.querySelector('[data-variant="achievement"]');
			expect(achievement?.textContent).toContain('Trophy');
			expect(achievement?.textContent).toContain('Achievement note');

			unmount();
		});
	});

	describe('7. Animated Countdown Bar', () => {
		it('renders progress bar when toast has a positive auto-dismiss duration', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Auto-dismiss toast', { duration: 5000 });
			});

			const track = container.querySelector('[data-toast-progress-track]');
			const bar = container.querySelector('[data-toast-progress-bar]');
			expect(track).not.toBeNull();
			expect(bar).not.toBeNull();
			expect(track?.getAttribute('aria-hidden')).toBe('true');

			unmount();
		});

		it('does not render progress bar when duration is 0 or showProgress is false', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Persistent toast', { duration: 0 });
			});

			expect(container.querySelector('[data-toast-progress-track]')).toBeNull();

			act(() => {
				toast.info('No progress toast', { duration: 5000, showProgress: false });
			});

			const toastItems = container.querySelectorAll('[data-variant]');
			expect(toastItems.length).toBe(2);
			const tracks = container.querySelectorAll('[data-toast-progress-track]');
			expect(tracks.length).toBe(0);

			unmount();
		});

		it('sets data-paused on pointerenter/mouseenter and removes on pointerleave/mouseleave', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Hoverable toast', { duration: 5000 });
			});

			const toastItem = container.querySelector('[data-variant]') as HTMLElement;
			expect(toastItem.getAttribute('data-paused')).toBeNull();

			act(() => {
				toastItem.dispatchEvent(new Event('mouseenter'));
			});
			expect(toastItem.getAttribute('data-paused')).toBe('true');

			act(() => {
				toastItem.dispatchEvent(new Event('mouseleave'));
			});
			expect(toastItem.getAttribute('data-paused')).toBeNull();

			unmount();
		});

		it('sets data-paused on focusin within toast and removes on focusout', () => {
			const { container, unmount } = render(<ToastContainer />);

			act(() => {
				toast.info('Focusable toast', { duration: 5000 });
			});

			const toastItem = container.querySelector('[data-variant]') as HTMLElement;
			const dismissBtn = container.querySelector('button[aria-label="Dismiss notification"]') as HTMLElement;

			act(() => {
				dismissBtn.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
			});
			expect(toastItem.getAttribute('data-paused')).toBe('true');

			act(() => {
				dismissBtn.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
			});
			expect(toastItem.getAttribute('data-paused')).toBeNull();

			unmount();
		});
	});
});
