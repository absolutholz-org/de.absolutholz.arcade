import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { TurnDialog } from './_TurnDialog';

describe('TurnDialog', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders confirmation button in pass-and-play mode and triggers onConfirm', async () => {
		const onConfirm = vi.fn();
		let utils: ReturnType<typeof render>;

		await act(async () => {
			utils = render(
				<TurnDialog
					isOpen={true}
					playerName="Alice"
					playerMark="X"
					onConfirm={onConfirm}
					confirmText="Ready"
				/>,
			);
		});

		const button = utils?.container.querySelector('button');
		expect(button).not.toBeNull();
		expect(button?.textContent).toBe('Ready');

		await act(async () => {
			button?.click();
		});

		expect(onConfirm).toHaveBeenCalledTimes(1);
		utils?.unmount();
	});

	it('renders in waiting mode without confirmation button', async () => {
		let utils: ReturnType<typeof render>;

		await act(async () => {
			utils = render(
				<TurnDialog
					isOpen={true}
					isWaiting={true}
					title="Waiting for Opponent"
					message="Waiting for remote move..."
				/>,
			);
		});

		expect(utils?.container.textContent).toContain('Waiting for Opponent');
		expect(utils?.container.textContent).toContain('Waiting for remote move...');

		const button = utils?.container.querySelector('button');
		expect(button).toBeNull();

		utils?.unmount();
	});
});
