import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { GameActionBar } from './_GameActionBar';

describe('GameActionBar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders all three actions within the action bar', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<GameActionBar
					isSavedOffline={false}
					isFavorited={false}
					onSaveOffline={vi.fn()}
					onToggleFavorite={vi.fn()}
					onShare={vi.fn()}
				/>,
			);
		});

		const actionStack = utils?.container.querySelector('[data-direction="row"]');
		const buttons = actionStack?.querySelectorAll(':scope > button');
		expect(buttons?.length).toBe(3);

		const [saveBtn, favBtn, shareBtn] = Array.from(buttons ?? []);
		expect(saveBtn?.textContent).toContain('Save Offline');
		expect(saveBtn?.getAttribute('data-size')).toBe('sm');
		expect(saveBtn?.getAttribute('data-variant')).toBe('outline');
		expect(favBtn?.textContent).toContain('Favorite');
		expect(favBtn?.getAttribute('aria-label')).toBe('Favorite game');
		expect(favBtn?.getAttribute('data-size')).toBe('sm');
		expect(favBtn?.getAttribute('data-variant')).toBe('outline');
		expect(shareBtn?.textContent).toContain('Share Game');
		expect(shareBtn?.getAttribute('data-size')).toBe('sm');
		expect(shareBtn?.getAttribute('data-variant')).toBe('outline');

		utils?.unmount();
	});

	describe('Save Offline action', () => {
		it('renders idle download state when isSavedOffline is false', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isSavedOffline={false} onSaveOffline={vi.fn()} />);
			});

			const saveBtn = utils?.container.querySelectorAll('button')[0];
			expect(saveBtn).not.toBeNull();
			expect(saveBtn?.getAttribute('aria-pressed')).toBe('false');

			utils?.unmount();
		});

		it('renders cached offline visual feedback and pressed state when isSavedOffline is true', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isSavedOffline={true} onSaveOffline={vi.fn()} />);
			});

			const saveBtn = utils?.container.querySelectorAll('button')[0];
			expect(saveBtn).not.toBeNull();
			expect(saveBtn?.getAttribute('aria-pressed')).toBe('true');

			utils?.unmount();
		});

		it('triggers onSaveOffline callback on click', async () => {
			const onSaveOffline = vi.fn();
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isSavedOffline={false} onSaveOffline={onSaveOffline} />);
			});

			const saveBtn = utils?.container.querySelectorAll('button')[0];
			await act(async () => {
				saveBtn?.click();
			});

			expect(onSaveOffline).toHaveBeenCalledTimes(1);
			utils?.unmount();
		});
	});

	describe('Favorite action', () => {
		it('renders unpressed state with aria-pressed="false", accessible label, and visible text label', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isFavorited={false} onToggleFavorite={vi.fn()} />);
			});

			const favBtn = utils?.container.querySelectorAll('button')[1];
			expect(favBtn?.getAttribute('aria-pressed')).toBe('false');
			expect(favBtn?.getAttribute('aria-label')).toBe('Favorite game');
			expect(favBtn?.textContent).toContain('Favorite');

			utils?.unmount();
		});

		it('renders pressed state with aria-pressed="true" when isFavorited is true', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isFavorited={true} onToggleFavorite={vi.fn()} />);
			});

			const favBtn = utils?.container.querySelectorAll('button')[1];
			expect(favBtn?.getAttribute('aria-pressed')).toBe('true');
			expect(favBtn?.textContent).toContain('Favorited');

			utils?.unmount();
		});

		it('triggers onToggleFavorite callback on click', async () => {
			const onToggleFavorite = vi.fn();
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar isFavorited={false} onToggleFavorite={onToggleFavorite} />);
			});

			const favBtn = utils?.container.querySelectorAll('button')[1];
			await act(async () => {
				favBtn?.click();
			});

			expect(onToggleFavorite).toHaveBeenCalledTimes(1);
			utils?.unmount();
		});
	});

	describe('Share Game action', () => {
		it('renders share button with text "Share Game"', async () => {
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar onShare={vi.fn()} />);
			});

			const shareBtn = utils?.container.querySelectorAll('button')[2];
			expect(shareBtn?.textContent).toContain('Share Game');

			utils?.unmount();
		});

		it('triggers onShare callback when clicked', async () => {
			const onShare = vi.fn();
			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar onShare={onShare} />);
			});

			const shareBtn = utils?.container.querySelectorAll('button')[2];
			await act(async () => {
				shareBtn?.click();
			});

			expect(onShare).toHaveBeenCalledTimes(1);
			utils?.unmount();
		});

		it('triggers navigator.share if available when onShare is not provided', async () => {
			const shareMock = vi.fn().mockResolvedValue(undefined);
			Object.defineProperty(navigator, 'share', {
				value: shareMock,
				configurable: true,
				writable: true,
			});

			let utils: ReturnType<typeof render>;
			await act(async () => {
				utils = render(<GameActionBar gameTitle="Sudoku" shareUrl="https://arcade.example.com/games/sudoku" />);
			});

			const shareBtn = utils?.container.querySelectorAll('button')[2];
			await act(async () => {
				shareBtn?.click();
			});

			expect(shareMock).toHaveBeenCalledWith(
				expect.objectContaining({
					url: 'https://arcade.example.com/games/sudoku',
				}),
			);

			utils?.unmount();
		});
	});
});
