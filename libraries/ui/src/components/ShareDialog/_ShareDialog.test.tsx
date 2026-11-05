import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { ShareContent, ShareDialog } from './_ShareDialog';

describe('ShareDialog', () => {
	it('renders dialog title, QR code SVG, and copy link action', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<ShareDialog
					id="test-share-dialog"
					isOpen={true}
					onClose={() => {}}
					title="Share Arcade"
					shareUrl="https://arcade.absolutholz.de/en/"
				/>
			</I18nProvider>,
		);

		expect(container.textContent).toContain('Share Arcade');
		expect(container.textContent).toContain('Scan to play on mobile');
		expect(container.textContent).toContain('Copy Link');

		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();

		unmount();
	});

	it('renders ShareContent directly and handles clipboard copy with aria status', async () => {
		const writeTextMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: writeTextMock,
			},
			writable: true,
			configurable: true,
		});

		const { container, unmount } = render(
			<I18nProvider language="en">
				<ShareContent shareUrl="https://arcade.absolutholz.de/en/games/floodit" title="Share Flood-It" />
			</I18nProvider>,
		);

		const buttons = container.querySelectorAll('button');
		const copyButton = Array.from(buttons).find((b) => b.textContent?.includes('Copy Link'));
		expect(copyButton).toBeDefined();

		await act(async () => {
			copyButton?.click();
		});

		expect(writeTextMock).toHaveBeenCalledWith('https://arcade.absolutholz.de/en/games/floodit');

		const status = container.querySelector('[role="status"]');
		expect(status).not.toBeNull();
		expect(status?.getAttribute('aria-live')).toBe('polite');
		expect(status?.textContent).toContain('Link Copied!');

		unmount();
	});
});
