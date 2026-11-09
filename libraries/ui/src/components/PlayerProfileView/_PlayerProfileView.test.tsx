import { saveConsentPreferences } from '@arcade/lib-consent';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { UserSession } from '@arcade/lib-user';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProfileView } from '.';
import { render } from '../../test-utils';

describe('PlayerProfileView', () => {
	const mockSessionGuest: UserSession = {
		isAuthenticated: false,
		user: {
			id: 'guest-123',
			displayName: 'LocalPlayer',
			avatar: { type: 'emoji', value: '👾' },
			storageMode: 'local',
			createdAt: 1000,
			updatedAt: 1000,
		},
	};

	const mockSessionAuthTier2: UserSession = {
		isAuthenticated: true,
		user: {
			id: 'user-456',
			displayName: 'ArcadeHero',
			email: 'hero@arcade.de',
			avatar: { type: 'emoji', value: '🚀' },
			storageMode: 'local',
			createdAt: 1000,
			updatedAt: 1000,
		},
	};

	const mockSessionAuthCloud: UserSession = {
		isAuthenticated: true,
		user: {
			id: 'user-789',
			displayName: 'CloudChampion',
			email: 'champ@arcade.de',
			avatar: { type: 'emoji', value: '⭐' },
			storageMode: 'cloud',
			createdAt: 1000,
			updatedAt: 1000,
		},
	};

	beforeEach(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.clear();
		}
		// Polyfill Popover API for happy-dom if not present
		if (!HTMLElement.prototype.showPopover) {
			HTMLElement.prototype.showPopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
			};
		}
		if (!HTMLElement.prototype.hidePopover) {
			HTMLElement.prototype.hidePopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
			};
		}
		saveConsentPreferences({ cloudSync: false, publicBroadcast: false });
	});

	it('renders semantic landmarks with distinct h1 and h2 headings', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionGuest} />
			</I18nProvider>,
		);

		const mainLandmark = container.querySelector('main#player-profile-view');
		expect(mainLandmark).not.toBeNull();

		const h1 = container.querySelector('h1');
		expect(h1).not.toBeNull();
		expect(h1?.textContent).toBe('Player Profile');

		const h2s = Array.from(container.querySelectorAll('h2'));
		expect(h2s.length).toBe(3);
		expect(h2s[0].textContent).toBe('Player Identity');
		expect(h2s[1].textContent).toBe('Data Sovereignty & Cloud Tiers');
		expect(h2s[2].textContent).toBe('Data Sovereignty Tools & Navigation');

		unmount();
	});

	it('Section 1: displays avatar, pre-filled display name, and character counter', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionGuest} />
			</I18nProvider>,
		);

		// Avatar trigger button
		const avatarButton = container.querySelector('button[aria-haspopup="dialog"]');
		expect(avatarButton).not.toBeNull();
		expect(avatarButton?.textContent).toContain('👾');

		// Display name input
		const input = container.querySelector('#profile-display-name-input') as HTMLInputElement;
		expect(input).not.toBeNull();
		expect(input.value).toBe('LocalPlayer');
		expect(input.maxLength).toBe(24);

		// Counter: LocalPlayer is 11 chars
		const counter = container.querySelector('[data-slot="char-count"]');
		expect(counter?.textContent).toContain('11 / 24');

		// Save button is initially disabled because form is pristine
		const saveButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
		expect(saveButton.disabled).toBe(true);

		unmount();
	});

	function setInputValue(input: HTMLInputElement, value: string) {
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
		nativeInputValueSetter?.call(input, value);
		act(() => {
			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
		});
	}

	it('Section 1: enables save button on edit, enforces validation and announces via live region', async () => {
		const onSaveSuccess = vi.fn();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionGuest} onSaveSuccess={onSaveSuccess} />
			</I18nProvider>,
		);

		const input = container.querySelector('#profile-display-name-input') as HTMLInputElement;
		const saveButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
		const liveRegion = container.querySelector('[data-slot="live-region"]');

		// 1. Clear input: invalid state (empty)
		setInputValue(input, '   ');
		expect(saveButton.disabled).toBe(true);

		// 2. Set valid new name
		setInputValue(input, 'SuperGamer');
		expect(saveButton.disabled).toBe(false);

		// Counter updates
		const counter = container.querySelector('[data-slot="char-count"]');
		expect(counter?.textContent).toContain('10 / 24');

		// 3. Submit form
		await act(async () => {
			const form = saveButton.closest('form');
			if (form) {
				form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
			}
		});

		// Live region announces success
		expect(liveRegion?.textContent).toBe('Profile updated successfully');

		unmount();
	});

	it('Section 2: resolves ADR 0003 Tier 1 for unauthenticated guest player', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionGuest} />
			</I18nProvider>,
		);

		const tierCard = container.querySelector('[data-slot="tier-card"]');
		expect(tierCard?.textContent).toContain('Tier 1');
		expect(tierCard?.textContent).toContain('Local Player');
		expect(tierCard?.textContent).toContain('strictly on this device');

		// Leaderboard toggle disabled with warning
		const leaderboardSwitch = container.querySelector('#profile-leaderboard-toggle') as HTMLInputElement;
		expect(leaderboardSwitch.disabled).toBe(true);
		expect(container.textContent).toContain('Cloud synchronization must be enabled before participating');

		unmount();
	});

	it('Section 2: resolves ADR 0003 Tier 2 when authenticated but cloud sync is off', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionAuthTier2} />
			</I18nProvider>,
		);

		const tierCard = container.querySelector('[data-slot="tier-card"]');
		expect(tierCard?.textContent).toContain('Tier 2');
		expect(tierCard?.textContent).toContain('Account (Device Only)');
		expect(tierCard?.textContent).toContain('cloud sync is turned off');

		unmount();
	});

	it('Section 2: resolves Tier 3 and Tier 4 when cloud sync and public broadcast are enabled', () => {
		// Set cloud sync = true in consent preferences for authenticated user
		saveConsentPreferences({ cloudSync: true, publicBroadcast: false }, true);

		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionAuthCloud} />
			</I18nProvider>,
		);

		// Tier 3
		let tierCard = container.querySelector('[data-slot="tier-card"]');
		expect(tierCard?.textContent).toContain('Tier 3');
		expect(tierCard?.textContent).toContain('Cloud Backup (Private)');

		// Public leaderboard toggle is enabled for interaction
		const leaderboardSwitch = container.querySelector('#profile-leaderboard-toggle') as HTMLInputElement;
		expect(leaderboardSwitch.disabled).toBe(false);

		// Toggle public leaderboard on
		act(() => {
			leaderboardSwitch.click();
		});

		tierCard = container.querySelector('[data-slot="tier-card"]');
		expect(tierCard?.textContent).toContain('Tier 4');
		expect(tierCard?.textContent).toContain('Public Leaderboards');

		unmount();
	});

	it('Section 3: provides navigation links, JSON data export, and auth status', () => {
		// Mock URL.createObjectURL and URL.revokeObjectURL
		const originalCreateObjectURL = window.URL.createObjectURL;
		const originalRevokeObjectURL = window.URL.revokeObjectURL;
		window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
		window.URL.revokeObjectURL = vi.fn();

		window.localStorage.setItem('arcade::sudoku::stats', JSON.stringify({ gamesPlayed: 5 }));

		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionAuthTier2} />
			</I18nProvider>,
		);

		// Navigation links
		const medalsLink = container.querySelector('a[href="/en/medals"]');
		const statsLink = container.querySelector('a[href="/en/stats"]');
		expect(medalsLink).not.toBeNull();
		expect(statsLink).not.toBeNull();

		// Export data button
		const exportButton = container.querySelector('[data-slot="tool-card"] button') as HTMLButtonElement;
		expect(exportButton).not.toBeNull();
		expect(exportButton.textContent).toContain('Export My Data');

		act(() => {
			exportButton.click();
		});

		expect(window.URL.createObjectURL).toHaveBeenCalled();
		const liveRegion = container.querySelector('[data-slot="live-region"]');
		expect(liveRegion?.textContent).toBe('Data exported successfully');

		// Account status displays authenticated email
		expect(container.textContent).toContain('hero@arcade.de');
		const signOutButton = container.querySelector('[data-slot="account-card"] button');
		expect(signOutButton?.textContent).toBe('Sign Out');

		// Restore
		window.URL.createObjectURL = originalCreateObjectURL;
		window.URL.revokeObjectURL = originalRevokeObjectURL;
		unmount();
	});

	it('Section 3: opens AuthDialog when guest clicks Sign In button', async () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<PlayerProfileView session={mockSessionGuest} />
			</I18nProvider>,
		);

		const signInButton = Array.from(container.querySelectorAll('[data-slot="auth-actions"] button')).find(
			(b) => b.textContent?.trim() === 'Sign In',
		) as HTMLButtonElement;
		expect(signInButton).toBeDefined();

		act(() => {
			signInButton.click();
		});

		const authDialog = container.querySelector('#auth-dialog');
		expect(authDialog).not.toBeNull();
		expect(authDialog?.querySelector('h2')?.textContent).toBe('Sign In');

		unmount();
	});
});
