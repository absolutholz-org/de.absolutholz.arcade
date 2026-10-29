import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { HeaderActions } from '.';
import { render } from '../../test-utils';
import { getFocusableItems } from '../Toolbar/_Toolbar.functions';

describe('HeaderActions', () => {
	it('renders a role="toolbar" container encompassing all 4 controls', () => {
		const { container, unmount } = render(<HeaderActions lang="en" />);

		const toolbar = container.querySelector('[role="toolbar"]') as HTMLElement;
		expect(toolbar).not.toBeNull();

		// Check the 4 controls: Language, Scheme, Settings, User Profile
		const items = getFocusableItems(toolbar);
		expect(items.length).toBe(4);

		// First: Language switcher button
		expect(items[0].getAttribute('aria-haspopup')).toBe('listbox');

		// Third: Settings link
		expect(items[2].getAttribute('href')).toBe('/en/settings');

		// Fourth: User profile button with explicit accessible name
		const userButton = items[3];
		expect(userButton.getAttribute('aria-label')).toBe('User profile');
		expect(userButton.getAttribute('aria-haspopup')).toBe('dialog');

		// Cloud sync icon is removed completely
		expect(toolbar.querySelector('.sync-badge')).toBeNull();

		unmount();
	});

	it('supports roving tabindex across all 4 controls using ArrowRight and ArrowLeft', () => {
		const { container, unmount } = render(<HeaderActions lang="en" />);

		const toolbar = container.querySelector('[role="toolbar"]') as HTMLElement;
		const items = getFocusableItems(toolbar);
		expect(items.length).toBe(4);

		// Initial state: first item has tabindex 0, others -1
		expect(items[0].getAttribute('tabindex')).toBe('0');
		expect(items[1].getAttribute('tabindex')).toBe('-1');
		expect(items[2].getAttribute('tabindex')).toBe('-1');
		expect(items[3].getAttribute('tabindex')).toBe('-1');

		// Focus on item 0
		act(() => {
			items[0].focus();
			toolbar.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		});

		// Navigate right from item 0 -> moves to item 1 (Theme)
		act(() => {
			items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(items[1].getAttribute('tabindex')).toBe('0');
		expect(items[0].getAttribute('tabindex')).toBe('-1');

		// Navigate right from item 1 -> moves to item 2 (Settings)
		act(() => {
			items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(items[2].getAttribute('tabindex')).toBe('0');
		expect(items[1].getAttribute('tabindex')).toBe('-1');

		// Navigate right from item 2 -> moves to item 3 (User Profile)
		act(() => {
			items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(items[3].getAttribute('tabindex')).toBe('0');
		expect(items[2].getAttribute('tabindex')).toBe('-1');

		// Navigate right from item 3 loops back to item 0
		act(() => {
			items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(items[0].getAttribute('tabindex')).toBe('0');
		expect(items[3].getAttribute('tabindex')).toBe('-1');

		// Navigate left from item 0 loops to item 3 (User Profile)
		act(() => {
			items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		});
		expect(items[3].getAttribute('tabindex')).toBe('0');

		unmount();
	});
});
