import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { GameControlStrip, GameControls } from './_GameControlStrip';

describe('GameControlStrip / GameControls', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders constructive controls (Undo, Redo), vertical hairline divider, and destructive controls (Restart, New Game) using canonical common i18n labels', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<GameControls
					onUndo={vi.fn()}
					canUndo={true}
					onRedo={vi.fn()}
					canRedo={false}
					onRestart={vi.fn()}
					canRestart={true}
					onNewGame={vi.fn()}
					canNewGame={true}
				/>,
			);
		});

		const toolbar = utils?.container.querySelector('[role="toolbar"]');
		expect(toolbar).not.toBeNull();
		expect(toolbar?.getAttribute('aria-label')).toBe('Game controls');
		expect(toolbar?.getAttribute('data-align')).toBe('center');

		const divider = toolbar?.querySelector('hr[aria-hidden="true"]');
		expect(divider).not.toBeNull();

		const buttons = toolbar?.querySelectorAll('button');
		expect(buttons?.length).toBe(4);

		const [undoBtn, redoBtn, restartBtn, newGameBtn] = Array.from(buttons ?? []);
		expect(undoBtn?.textContent).toContain('Undo');
		expect(undoBtn?.getAttribute('disabled')).toBeNull();
		expect(undoBtn?.getAttribute('data-action-style')).toBe('constructive');

		expect(redoBtn?.textContent).toContain('Redo');
		expect(redoBtn?.hasAttribute('disabled')).toBe(true);
		expect(redoBtn?.getAttribute('data-action-style')).toBe('constructive');

		expect(restartBtn?.textContent).toContain('Restart');
		expect(restartBtn?.getAttribute('data-action-style')).toBe('destructive');

		expect(newGameBtn?.textContent).toContain('New Game');
		expect(newGameBtn?.getAttribute('data-action-style')).toBe('destructive');

		utils?.unmount();
	});

	it('omits divider when only destructive controls are present (e.g. Dice Bingo)', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<GameControls onRestart={vi.fn()} canRestart={true} onNewGame={vi.fn()} canNewGame={true} />,
			);
		});

		const toolbar = utils?.container.querySelector('[role="toolbar"]');
		expect(toolbar?.querySelector('hr')).toBeNull();
		expect(toolbar?.querySelectorAll('button').length).toBe(2);

		utils?.unmount();
	});

	it('supports legacy prop names (onReset, resetLabel, onNewPuzzle, newPuzzleLabel)', async () => {
		const onReset = vi.fn();
		const onNewPuzzle = vi.fn();

		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<GameControlStrip
					onReset={onReset}
					resetLabel="Reset"
					onNewPuzzle={onNewPuzzle}
					newPuzzleLabel="New Puzzle"
					hasActiveProgress={false}
				/>,
			);
		});

		const toolbar = utils?.container.querySelector('[role="toolbar"]');
		const buttons = toolbar?.querySelectorAll('button');
		expect(buttons?.length).toBe(2);
		expect(buttons?.[0]?.textContent).toContain('Reset');
		expect(buttons?.[1]?.textContent).toContain('New Puzzle');

		await act(async () => {
			buttons?.[0]?.click();
		});
		expect(onReset).toHaveBeenCalledTimes(1);

		await act(async () => {
			buttons?.[1]?.click();
		});
		expect(onNewPuzzle).toHaveBeenCalledTimes(1);

		utils?.unmount();
	});

	describe('Roving Tabindex and Keyboard Navigation', () => {
		it('enforces a single tab stop and navigates across enabled buttons with ArrowLeft, ArrowRight, Home, and End', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(
					<GameControls
						onUndo={vi.fn()}
						canUndo={true}
						onRedo={vi.fn()}
						canRedo={false}
						onRestart={vi.fn()}
						canRestart={true}
						onNewGame={vi.fn()}
						canNewGame={true}
					/>,
				);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]') as HTMLElement;
			const buttons = Array.from(toolbar.querySelectorAll('button'));
			const [undoBtn, , restartBtn, newGameBtn] = buttons;

			expect(undoBtn.getAttribute('tabindex')).toBe('0');
			expect(restartBtn.getAttribute('tabindex')).toBe('-1');
			expect(newGameBtn.getAttribute('tabindex')).toBe('-1');

			// Focus Undo and press ArrowRight -> skips disabled Redo and moves to Restart
			await act(async () => {
				undoBtn.focus();
				undoBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			});
			expect(document.activeElement).toBe(restartBtn);
			expect(restartBtn.getAttribute('tabindex')).toBe('0');
			expect(undoBtn.getAttribute('tabindex')).toBe('-1');

			// Press ArrowRight -> New Game
			await act(async () => {
				restartBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			});
			expect(document.activeElement).toBe(newGameBtn);
			expect(newGameBtn.getAttribute('tabindex')).toBe('0');

			// Press ArrowLeft -> Restart
			await act(async () => {
				newGameBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			});
			expect(document.activeElement).toBe(restartBtn);

			// Press Home -> Undo, End -> New Game
			await act(async () => {
				restartBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
			});
			expect(document.activeElement).toBe(undoBtn);

			await act(async () => {
				undoBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
			});
			expect(document.activeElement).toBe(newGameBtn);

			utils?.unmount();
		});
	});

	describe('Modal Dialog Confirmation Guard for Destructive Actions', () => {
		it('executes both Restart and New Game immediately when hasActiveProgress is false', async () => {
			const onRestart = vi.fn();
			const onNewGame = vi.fn();

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameControls onRestart={onRestart} onNewGame={onNewGame} hasActiveProgress={false} />);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const [restartBtn, newGameBtn] = Array.from(toolbar?.querySelectorAll('button') ?? []);

			await act(async () => {
				restartBtn?.click();
			});
			expect(onRestart).toHaveBeenCalledTimes(1);

			await act(async () => {
				newGameBtn?.click();
			});
			expect(onNewGame).toHaveBeenCalledTimes(1);

			utils?.unmount();
		});

		it('executes New Game immediately when puzzle is already completed even if hasActiveProgress is true', async () => {
			const onRestart = vi.fn();
			const onNewGame = vi.fn();

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(
					<GameControls
						onRestart={onRestart}
						onNewGame={onNewGame}
						hasActiveProgress={true}
						isComplete={true}
					/>,
				);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const [, newGameBtn] = Array.from(toolbar?.querySelectorAll('button') ?? []);

			await act(async () => {
				newGameBtn?.click();
			});
			expect(onNewGame).toHaveBeenCalledTimes(1);
			expect(utils?.container.querySelector('dialog')?.hasAttribute('open')).toBe(false);

			utils?.unmount();
		});

		it('opens Restart confirmation Dialog when hasActiveProgress is true, keeps toolbar buttons intact, and confirms on click', async () => {
			const onRestart = vi.fn();

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameControls onRestart={onRestart} onNewGame={vi.fn()} hasActiveProgress={true} />);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const restartBtn = toolbar?.querySelectorAll('button')[0];

			await act(async () => {
				restartBtn?.click();
			});

			expect(onRestart).not.toHaveBeenCalled();

			// Toolbar buttons remain unchanged
			expect(toolbar?.querySelectorAll('button').length).toBe(2);
			expect(toolbar?.querySelectorAll('button')[0]?.textContent).toContain('Restart');

			const dialog = utils?.container.querySelector('dialog');
			expect(dialog).not.toBeNull();
			expect(dialog?.textContent).toContain('Restart Game?');
			expect(dialog?.textContent).toContain('Your current progress will be lost.');

			const dialogButtons = Array.from(dialog?.querySelectorAll('button') ?? []);
			const confirmBtn = dialogButtons.find((btn) => btn.textContent?.includes('Restart'));
			expect(confirmBtn).not.toBeUndefined();

			await act(async () => {
				confirmBtn?.click();
			});

			expect(onRestart).toHaveBeenCalledTimes(1);

			utils?.unmount();
		});

		it('opens New Game confirmation Dialog when hasActiveProgress is true and confirms on click', async () => {
			const onNewGame = vi.fn();

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameControls onRestart={vi.fn()} onNewGame={onNewGame} hasActiveProgress={true} />);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const newGameBtn = toolbar?.querySelectorAll('button')[1];

			await act(async () => {
				newGameBtn?.click();
			});

			expect(onNewGame).not.toHaveBeenCalled();

			const dialog = utils?.container.querySelector('dialog');
			expect(dialog).not.toBeNull();
			expect(dialog?.textContent).toContain('Start New Game?');
			expect(dialog?.textContent).toContain('Your current puzzle and progress will be lost.');

			const dialogButtons = Array.from(dialog?.querySelectorAll('button') ?? []);
			const confirmBtn = dialogButtons.find((btn) => btn.textContent?.includes('New Game'));
			expect(confirmBtn).not.toBeUndefined();

			await act(async () => {
				confirmBtn?.click();
			});

			expect(onNewGame).toHaveBeenCalledTimes(1);

			utils?.unmount();
		});

		it('cancels confirmation via Cancel button and restores focus to triggering button', async () => {
			const onRestart = vi.fn();

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameControls onRestart={onRestart} onNewGame={vi.fn()} hasActiveProgress={true} />);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const restartBtn = toolbar?.querySelectorAll('button')[0] as HTMLButtonElement;

			await act(async () => {
				restartBtn.focus();
				restartBtn.click();
			});

			const dialog = utils?.container.querySelector('dialog');
			const cancelBtn = Array.from(dialog?.querySelectorAll('button') ?? []).find((btn) =>
				btn.textContent?.includes('Cancel'),
			);
			expect(cancelBtn).not.toBeUndefined();

			await act(async () => {
				cancelBtn?.click();
			});

			expect(onRestart).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(restartBtn);

			utils?.unmount();
		});

		it('cancels confirmation on Escape without propagating to global game pause shortcuts and restores focus', async () => {
			const onNewGame = vi.fn();
			const globalEscapeSpy = vi.fn();
			window.addEventListener('keydown', globalEscapeSpy);

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameControls onRestart={vi.fn()} onNewGame={onNewGame} hasActiveProgress={true} />);
			});

			const toolbar = utils?.container.querySelector('[role="toolbar"]');
			const newGameBtn = toolbar?.querySelectorAll('button')[1] as HTMLButtonElement;

			await act(async () => {
				newGameBtn.focus();
				newGameBtn.click();
			});

			await act(async () => {
				window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
			});

			expect(onNewGame).not.toHaveBeenCalled();
			expect(globalEscapeSpy).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(newGameBtn);

			window.removeEventListener('keydown', globalEscapeSpy);
			utils?.unmount();
		});
	});
});
