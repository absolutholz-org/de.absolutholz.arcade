import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Confetti } from '.';
import { render } from '../../test-utils';

describe('Confetti', () => {
	let originalMatchMedia: typeof window.matchMedia;
	let originalRequestAnimationFrame: typeof window.requestAnimationFrame;
	let originalCancelAnimationFrame: typeof window.cancelAnimationFrame;

	beforeEach(() => {
		originalMatchMedia = window.matchMedia;
		originalRequestAnimationFrame = window.requestAnimationFrame;
		originalCancelAnimationFrame = window.cancelAnimationFrame;

		// Default matchMedia mock returning prefers-reduced-motion: false
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		// Mock canvas context
		HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
			clearRect: vi.fn(),
			fillRect: vi.fn(),
			save: vi.fn(),
			restore: vi.fn(),
			translate: vi.fn(),
			rotate: vi.fn(),
			scale: vi.fn(),
			setTransform: vi.fn(),
		});
	});

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
		window.requestAnimationFrame = originalRequestAnimationFrame;
		window.cancelAnimationFrame = originalCancelAnimationFrame;
		vi.restoreAllMocks();
	});

	it('renders a canvas overlay with aria-hidden="true"', () => {
		const { container, unmount } = render(<Confetti />);
		const canvas = container.querySelector('canvas');

		expect(canvas).not.toBeNull();
		expect(canvas?.getAttribute('aria-hidden')).toBe('true');
		unmount();
	});

	it('immediately invokes onComplete and bypasses animation when prefers-reduced-motion is active', () => {
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query.includes('prefers-reduced-motion: reduce'),
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		const onComplete = vi.fn();
		const rafSpy = vi.fn();
		window.requestAnimationFrame = rafSpy;

		const { unmount } = render(<Confetti onComplete={onComplete} />);

		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(rafSpy).not.toHaveBeenCalled();
		unmount();
	});

	it('cancels requestAnimationFrame on unmount', () => {
		let rafId = 0;
		window.requestAnimationFrame = vi.fn().mockImplementation(() => ++rafId);
		const cancelRafSpy = vi.fn();
		window.cancelAnimationFrame = cancelRafSpy;

		const { unmount } = render(<Confetti />);
		expect(window.requestAnimationFrame).toHaveBeenCalled();

		unmount();
		expect(cancelRafSpy).toHaveBeenCalled();
	});

	it('promotes to top layer via popover API if supported', () => {
		let isPopoverOpenState = false;
		const showPopoverMock = vi.fn().mockImplementation(() => {
			isPopoverOpenState = true;
		});
		const hidePopoverMock = vi.fn().mockImplementation(() => {
			isPopoverOpenState = false;
		});

		HTMLCanvasElement.prototype.showPopover = showPopoverMock;
		HTMLCanvasElement.prototype.hidePopover = hidePopoverMock;
		HTMLCanvasElement.prototype.matches = vi.fn().mockImplementation((sel: string) => {
			return sel === ':popover-open' ? isPopoverOpenState : false;
		});

		const rafCallbacks: FrameRequestCallback[] = [];
		window.requestAnimationFrame = vi.fn().mockImplementation((cb: FrameRequestCallback) => {
			rafCallbacks.push(cb);
			return rafCallbacks.length;
		});

		const { unmount } = render(<Confetti />);
		for (const cb of rafCallbacks) {
			cb(0);
		}

		expect(showPopoverMock).toHaveBeenCalled();
		unmount();
		expect(hidePopoverMock).toHaveBeenCalled();
	});
});
