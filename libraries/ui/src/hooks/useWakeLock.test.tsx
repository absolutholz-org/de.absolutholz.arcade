import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../test-utils';
import { useWakeLock } from './useWakeLock';

interface MockSentinel {
	released: boolean;
	release: ReturnType<typeof vi.fn>;
	addEventListener: ReturnType<typeof vi.fn>;
	triggerRelease: () => void;
}

function createMockSentinel(): MockSentinel {
	const listeners: Record<string, Array<() => void>> = {};
	const sentinel: MockSentinel = {
		released: false,
		release: vi.fn(async () => {
			sentinel.released = true;
			for (const cb of listeners.release ?? []) {
				cb();
			}
		}),
		addEventListener: vi.fn((event: string, cb: () => void) => {
			if (!listeners[event]) listeners[event] = [];
			listeners[event].push(cb);
		}),
		triggerRelease: () => {
			sentinel.released = true;
			for (const cb of listeners.release ?? []) {
				cb();
			}
		},
	};
	return sentinel;
}

function TestWakeLockConsumer({
	enabled = true,
	inactivityTimeoutMs,
}: {
	enabled?: boolean;
	inactivityTimeoutMs?: number;
}) {
	const { isSupported, isActive } = useWakeLock({ enabled, inactivityTimeoutMs });
	return (
		<div>
			<span data-testid="supported">{String(isSupported)}</span>
			<span data-testid="active">{String(isActive)}</span>
		</div>
	);
}

describe('useWakeLock', () => {
	let requestMock: ReturnType<typeof vi.fn>;
	let currentSentinel: MockSentinel;

	beforeEach(() => {
		vi.useFakeTimers();
		currentSentinel = createMockSentinel();
		requestMock = vi.fn(async () => currentSentinel);
		Object.defineProperty(navigator, 'wakeLock', {
			configurable: true,
			value: { request: requestMock },
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('acquires wake lock when enabled and releases on unmount', async () => {
		let result!: ReturnType<typeof render>;
		await act(async () => {
			result = render(<TestWakeLockConsumer enabled={true} />);
		});

		expect(result.container.querySelector('[data-testid="supported"]')?.textContent).toBe('true');
		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('true');
		expect(requestMock).toHaveBeenCalledWith('screen');

		await act(async () => {
			result.unmount();
		});

		expect(currentSentinel.release).toHaveBeenCalledTimes(1);
	});

	it('handles OS-initiated release and re-acquires on visibilitychange', async () => {
		let result!: ReturnType<typeof render>;
		await act(async () => {
			result = render(<TestWakeLockConsumer enabled={true} />);
		});

		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('true');

		act(() => {
			currentSentinel.triggerRelease();
		});

		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('false');

		// Prepare a new sentinel for re-acquisition
		currentSentinel = createMockSentinel();
		Object.defineProperty(document, 'visibilityState', {
			configurable: true,
			value: 'visible',
		});

		await act(async () => {
			document.dispatchEvent(new Event('visibilitychange'));
		});

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('true');
		result.unmount();
	});

	it('releases after inactivityTimeoutMs and re-acquires on pointerdown', async () => {
		let result!: ReturnType<typeof render>;
		await act(async () => {
			result = render(<TestWakeLockConsumer enabled={true} inactivityTimeoutMs={5000} />);
		});

		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('true');

		await act(async () => {
			vi.advanceTimersByTime(5000);
		});

		expect(currentSentinel.release).toHaveBeenCalledTimes(1);
		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('false');

		currentSentinel = createMockSentinel();
		Object.defineProperty(document, 'visibilityState', {
			configurable: true,
			value: 'visible',
		});

		await act(async () => {
			window.dispatchEvent(new Event('pointerdown'));
		});

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('true');
		result.unmount();
	});

	it('sets isActive to false when navigator.wakeLock.request rejects', async () => {
		requestMock.mockRejectedValueOnce(new Error('NotAllowedError'));

		let result!: ReturnType<typeof render>;
		await act(async () => {
			result = render(<TestWakeLockConsumer enabled={true} />);
		});

		expect(result.container.querySelector('[data-testid="supported"]')?.textContent).toBe('true');
		expect(result.container.querySelector('[data-testid="active"]')?.textContent).toBe('false');
		result.unmount();
	});
});
