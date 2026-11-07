import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GameRulesDialog } from '.';
import { render } from '../../test-utils';

describe('GameRulesDialog', () => {
	it('renders dialog with two-line header hierarchy (Rules + gameTitle)', () => {
		const handleClose = vi.fn();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<GameRulesDialog isOpen={true} onClose={handleClose} gameTitle="Dice Bingo">
					<p>Test rules content</p>
				</GameRulesDialog>
			</I18nProvider>,
		);

		expect(container.textContent).toContain('Rules');
		expect(container.textContent).toContain('Dice Bingo');
		expect(container.textContent).toContain('Test rules content');

		const closeButton = container.querySelector('button[aria-label="Close"]');
		expect(closeButton).not.toBeNull();

		act(() => {
			(closeButton as HTMLButtonElement).click();
		});
		expect(handleClose).toHaveBeenCalledTimes(1);

		unmount();
	});

	it('renders localized rules title for non-English locales', () => {
		const { container, unmount } = render(
			<I18nProvider language="de">
				<GameRulesDialog isOpen={true} onClose={() => {}} gameTitle="Sudoku">
					<p>Regeln Inhalt</p>
				</GameRulesDialog>
			</I18nProvider>,
		);

		expect(container.textContent).toContain('Regeln');
		expect(container.textContent).toContain('Sudoku');

		unmount();
	});
});
