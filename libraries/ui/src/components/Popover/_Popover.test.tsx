import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Popover } from '.';
import { render } from '../../test-utils';

describe('Popover', () => {
	beforeEach(() => {
		if (!HTMLElement.prototype.showPopover) {
			HTMLElement.prototype.showPopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
			};
		}
		if (!HTMLElement.prototype.hidePopover) {
			HTMLElement.prototype.hidePopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
			};
		}
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders trigger and popover element with initial attributes', () => {
		const { container } = render(
			<Popover>
				<button type="button">Trigger</button>
				<div>Popover Content</div>
			</Popover>,
		);

		const trigger = container.querySelector('button');
		const popover = container.querySelector('[popover]');

		expect(trigger).not.toBeNull();
		expect(popover).not.toBeNull();
		expect(trigger?.getAttribute('popovertarget')).toBe(popover?.id);
		expect(popover?.getAttribute('popover')).toBe('auto');
	});

	it('closes popover on window scroll when open', () => {
		const onOpenChange = vi.fn();
		const { container } = render(
			<Popover onOpenChange={onOpenChange}>
				<button type="button">Trigger</button>
				<div>Popover Content</div>
			</Popover>,
		);

		const popover = container.querySelector('[popover]') as HTMLElement;
		const hidePopoverSpy = vi.spyOn(popover, 'hidePopover');

		// Open popover
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});
		expect(onOpenChange).toHaveBeenCalledWith(true);

		// Dispatch scroll event on window
		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		expect(hidePopoverSpy).toHaveBeenCalled();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('does not close popover if scroll originates inside popover content', () => {
		const onOpenChange = vi.fn();
		const { container } = render(
			<Popover onOpenChange={onOpenChange}>
				<button type="button">Trigger</button>
				<div data-testid="scroll-container">
					<p>Scrollable inner content</p>
				</div>
			</Popover>,
		);

		const popover = container.querySelector('[popover]') as HTMLElement;
		const scrollContainer = container.querySelector('[data-testid="scroll-container"]') as HTMLElement;
		const hidePopoverSpy = vi.spyOn(popover, 'hidePopover');

		// Open popover
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});
		expect(onOpenChange).toHaveBeenCalledWith(true);

		// Scroll originating from inside the popover
		act(() => {
			scrollContainer.dispatchEvent(new Event('scroll', { bubbles: true }));
		});

		expect(hidePopoverSpy).not.toHaveBeenCalled();
	});

	it('closes popover on scroll from nested container outside the popover', () => {
		const onOpenChange = vi.fn();
		const { container } = render(
			<div>
				<div id="nested-scroll-container">
					<p>Some outer container content</p>
				</div>
				<Popover onOpenChange={onOpenChange}>
					<button type="button">Trigger</button>
					<div>Popover Content</div>
				</Popover>
			</div>,
		);

		const popover = container.querySelector('[popover]') as HTMLElement;
		const outerContainer = container.querySelector('#nested-scroll-container') as HTMLElement;
		const hidePopoverSpy = vi.spyOn(popover, 'hidePopover');

		// Open popover
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});
		expect(onOpenChange).toHaveBeenCalledWith(true);

		// Scroll originating from outer container
		act(() => {
			outerContainer.dispatchEvent(new Event('scroll', { bubbles: true }));
		});

		expect(hidePopoverSpy).toHaveBeenCalled();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('cleans up scroll listener when closed or unmounted', () => {
		const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

		const { container, unmount } = render(
			<Popover>
				<button type="button">Trigger</button>
				<div>Popover Content</div>
			</Popover>,
		);

		const popover = container.querySelector('[popover]') as HTMLElement;

		// Initially not listening to scroll
		expect(addEventListenerSpy.mock.calls.some(([event]) => event === 'scroll')).toBe(false);

		// Open
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});

		expect(
			addEventListenerSpy.mock.calls.some(
				([event, , options]) =>
					event === 'scroll' &&
					typeof options === 'object' &&
					options?.capture === true &&
					options?.passive === true,
			),
		).toBe(true);

		// Close
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
		});

		expect(
			removeEventListenerSpy.mock.calls.some(
				([event, , options]) =>
					event === 'scroll' &&
					(options === true || (typeof options === 'object' && options?.capture === true)),
			),
		).toBe(true);

		// Open again and unmount
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});

		removeEventListenerSpy.mockClear();
		unmount();

		expect(
			removeEventListenerSpy.mock.calls.some(
				([event, , options]) =>
					event === 'scroll' &&
					(options === true || (typeof options === 'object' && options?.capture === true)),
			),
		).toBe(true);
	});
});
