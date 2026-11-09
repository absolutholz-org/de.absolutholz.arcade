import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { FavoriteButton } from '.';
import { render } from '../../test-utils';

describe('FavoriteButton', () => {
	it('renders Button component with properly interpolated game title in aria-label and title', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(<FavoriteButton gameId="minesweeper" gameTitle="Minesweeper" size="md" />);
		});

		const button = utils?.container.querySelector('button');
		expect(button).not.toBeNull();
		expect(button?.getAttribute('aria-label')).toBe('Add Minesweeper to favorites');
		expect(button?.getAttribute('title')).toBe('Add Minesweeper to favorites');
		expect(button?.getAttribute('aria-pressed')).toBe('false');

		// Confirm it consumes the shared Button primitive with ghost variant and round shape
		expect(button?.getAttribute('data-variant')).toBe('ghost');
		expect(button?.getAttribute('data-round')).toBe('true');
		expect(button?.getAttribute('data-icon-only')).toBe('true');

		// Confirm standard data-slot="icon" is used rather than custom wrapper
		expect(button?.querySelector('span.favorite-icon')).toBeNull();
		expect(button?.querySelector('span[data-slot="icon"]')).not.toBeNull();

		// Confirm heart SVG icon is rendered inside
		const svg = button?.querySelector('svg');
		expect(svg).not.toBeNull();

		utils?.unmount();
	});
});
