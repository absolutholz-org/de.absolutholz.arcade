import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../test-utils';
import { useShake } from './useShake';

function TestShakeConsumer({
	onShake,
	enabled = true,
	threshold = 15,
	cooldownMs = 500,
}: {
	onShake: () => void;
	enabled?: boolean;
	threshold?: number;
	cooldownMs?: number;
}) {
	const { isSupported, needsPermission, isPermissionGranted, requestPermission } = useShake({
		onShake,
		enabled,
		threshold,
		cooldownMs,
	});

	return (
		<div>
			<span data-testid="supported">{String(isSupported)}</span>
			<span data-testid="needs-permission">{String(needsPermission)}</span>
			<span data-testid="granted">{String(isPermissionGranted)}</span>
			<button type="button" onClick={() => void requestPermission()}>
				Request
			</button>
		</div>
	);
}

describe('useShake', () => {
	const originalVibrate = navigator.vibrate;

	beforeEach(() => {
		vi.stubGlobal('navigator', {
			...navigator,
			vibrate: vi.fn(),
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		if (originalVibrate) {
			navigator.vibrate = originalVibrate;
		}
	});

	it('detects motion capability and fires onShake with haptics on acceleration delta', () => {
		const handleShake = vi.fn();
		const { container, unmount } = render(
			<TestShakeConsumer onShake={handleShake} threshold={15} cooldownMs={200} />,
		);

		expect(container.querySelector('[data-testid="supported"]')?.textContent).toBe('true');
		expect(container.querySelector('[data-testid="granted"]')?.textContent).toBe('true');

		const fireMotion = (x: number, y: number, z: number) => {
			const event = new Event('devicemotion') as unknown as DeviceMotionEvent;
			Object.defineProperty(event, 'acceleration', {
				value: { x, y, z },
			});
			window.dispatchEvent(event);
		};

		// First baseline sample
		act(() => {
			fireMotion(0, 0, 0);
		});
		expect(handleShake).not.toHaveBeenCalled();

		// Mild movement under threshold
		act(() => {
			fireMotion(2, 3, 1);
		});
		expect(handleShake).not.toHaveBeenCalled();

		// Sharp shake movement exceeding threshold (delta: |15-2| + |12-3| + |8-1| = 13 + 9 + 7 = 29 > 15)
		act(() => {
			fireMotion(15, 12, 8);
		});

		expect(handleShake).toHaveBeenCalledTimes(1);
		expect(navigator.vibrate).toHaveBeenCalledWith([30, 20, 50]);

		// Immediate second shake within cooldown period should be ignored
		act(() => {
			fireMotion(35, 30, 25);
		});
		expect(handleShake).toHaveBeenCalledTimes(1);

		unmount();
	});

	it('cleans up event listeners when unmounted', () => {
		const handleShake = vi.fn();
		const { unmount } = render(<TestShakeConsumer onShake={handleShake} threshold={10} />);

		unmount();

		act(() => {
			window.dispatchEvent(
				new DeviceMotionEvent('devicemotion', {
					acceleration: { x: 50, y: 50, z: 50 },
				}),
			);
		});

		expect(handleShake).not.toHaveBeenCalled();
	});
});
