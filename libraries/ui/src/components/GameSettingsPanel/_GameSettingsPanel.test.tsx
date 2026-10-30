import type { GameSettingsConfig } from '@arcade/lib-games';
import * as libStorage from '@arcade/lib-storage';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { GameSettingsPanel } from './_GameSettingsPanel';

type TestSettings = {
	highlightErrors: boolean;
	allowNotes: boolean;
	inputMode: 'digit-first' | 'cell-first';
	themeVariant: 'default' | 'pastel';
};

const TEST_CONFIG: GameSettingsConfig<TestSettings> = {
	gameId: 'sudoku',
	defaults: {
		highlightErrors: true,
		allowNotes: true,
		inputMode: 'digit-first',
		themeVariant: 'default',
	},
	fields: [
		{
			key: 'highlightErrors',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'Highlight duplicate errors',
				descriptionKey: 'Flags conflicting numbers in the same row or column.',
			},
		},
		{
			key: 'allowNotes',
			control: 'boolean',
			defaultValue: true,
			availableInGame: false,
			i18n: {
				labelKey: 'Allow pencil notes',
				descriptionKey: 'Enables note-taking mode for candidate numbers.',
			},
		},
		{
			key: 'inputMode',
			control: 'segmented',
			defaultValue: 'digit-first',
			availableInGame: true,
			i18n: {
				labelKey: 'Input Mode',
				descriptionKey: 'Choose whether you select the number or the cell first.',
			},
			options: [
				{ value: 'digit-first', labelKey: 'Digit First' },
				{ value: 'cell-first', labelKey: 'Cell First' },
			],
		},
		{
			key: 'themeVariant',
			control: 'select',
			defaultValue: 'default',
			availableInGame: false,
			i18n: {
				labelKey: 'Board Theme',
				descriptionKey: 'Visual style for the game board.',
			},
			options: [
				{ value: 'default', labelKey: 'Classic' },
				{ value: 'pastel', labelKey: 'Pastel' },
			],
		},
	],
};

describe('GameSettingsPanel', () => {
	beforeEach(() => {
		vi.spyOn(libStorage, 'getGameSettings').mockImplementation(async (_gameId, defaults) => defaults);
		vi.spyOn(libStorage, 'saveGameSettings').mockImplementation(async () => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('in compact mode renders only availableInGame fields', async () => {
		let view: ReturnType<typeof render> | undefined;
		await act(async () => {
			view = render(<GameSettingsPanel config={TEST_CONFIG} lang="en" mode="compact" />);
		});

		if (!view) throw new Error('render failed');
		const container = view.container;
		// highlightErrors and inputMode have availableInGame = true
		expect(container.textContent).toContain('Highlight duplicate errors');
		expect(container.textContent).toContain('Input Mode');

		// allowNotes and themeVariant have availableInGame = false
		expect(container.textContent).not.toContain('Allow pencil notes');
		expect(container.textContent).not.toContain('Board Theme');

		// Compact mode does not render the appearance or data sections
		expect(container.textContent).not.toContain('Appearance');
		expect(container.textContent).not.toContain('Reset Progress & Stats');

		view.unmount();
	});

	it('in detailed mode renders all fields with labels and descriptions', async () => {
		let view: ReturnType<typeof render> | undefined;
		await act(async () => {
			view = render(<GameSettingsPanel config={TEST_CONFIG} lang="en" mode="detailed" />);
		});

		if (!view) throw new Error('render failed');
		const container = view.container;
		// All fields present
		expect(container.textContent).toContain('Highlight duplicate errors');
		expect(container.textContent).toContain('Flags conflicting numbers in the same row or column.');
		expect(container.textContent).toContain('Allow pencil notes');
		expect(container.textContent).toContain('Enables note-taking mode for candidate numbers.');
		expect(container.textContent).toContain('Input Mode');
		expect(container.textContent).toContain('Board Theme');

		// Detailed mode sections present
		expect(container.textContent).toContain('Appearance');
		expect(container.textContent).toContain('Data Management');
		expect(container.textContent).toContain('Reset Progress & Stats');

		view.unmount();
	});

	it('handles boolean setting change and dispatches onSettingsChange and saveGameSettings', async () => {
		const onSettingsChange = vi.fn();
		let view: ReturnType<typeof render> | undefined;

		await act(async () => {
			view = render(
				<GameSettingsPanel config={TEST_CONFIG} lang="en" mode="compact" onSettingsChange={onSettingsChange} />,
			);
		});

		if (!view) throw new Error('render failed');
		const container = view.container;
		const switchInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
		expect(switchInput).not.toBeNull();
		expect(switchInput?.checked).toBe(true);

		await act(async () => {
			switchInput?.click();
		});

		expect(libStorage.saveGameSettings).toHaveBeenCalled();
		expect(onSettingsChange).toHaveBeenCalledWith(
			expect.objectContaining({
				highlightErrors: false,
			}),
		);

		view.unmount();
	});

	it('prompts confirmation when clicking Reset Progress in detailed mode', async () => {
		const onResetProgress = vi.fn();
		let view: ReturnType<typeof render> | undefined;

		await act(async () => {
			view = render(
				<GameSettingsPanel config={TEST_CONFIG} lang="en" mode="detailed" onResetProgress={onResetProgress} />,
			);
		});

		if (!view) throw new Error('render failed');
		const container = view.container;
		const buttons = Array.from(container.querySelectorAll('button'));
		const resetButton = buttons.find((btn) => btn.textContent?.includes('Reset Progress & Stats'));
		expect(resetButton).toBeDefined();

		// Click reset button to open confirmation dialog
		await act(async () => {
			resetButton?.click();
		});

		// Dialog should now be open
		const dialog = container.querySelector('dialog');
		expect(dialog).not.toBeNull();
		expect(dialog?.textContent).toContain('Reset Progress & Stats?');

		// Find confirm button inside dialog
		const dialogButtons = Array.from(dialog?.querySelectorAll('button') ?? []);
		const confirmButton = dialogButtons.find((btn) => btn.textContent?.includes('Yes, Reset Progress'));
		expect(confirmButton).toBeDefined();

		await act(async () => {
			confirmButton?.click();
		});

		expect(onResetProgress).toHaveBeenCalledTimes(1);

		view.unmount();
	});
});
