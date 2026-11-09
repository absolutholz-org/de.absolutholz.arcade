import { saveConsentPreferences } from '@arcade/lib-consent';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { getSharedUserService, resetSharedUserService } from '@arcade/lib-user';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderUserMenu } from '.';
import { render } from '../../test-utils';

describe('HeaderUserMenu', () => {
	beforeEach(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.clear();
		}
		resetSharedUserService();

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

	function openPopover(container: HTMLElement) {
		const popover = container.querySelector('[popover]') as HTMLElement;
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});
		return popover;
	}

	function closePopover(container: HTMLElement) {
		const popover = container.querySelector('[popover]') as HTMLElement;
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
		});
		return popover;
	}

	it('renders trigger button with player avatar and accessible label (guest dialog role)', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" />
			</I18nProvider>,
		);

		const trigger = container.querySelector('button.user-profile-button') as HTMLButtonElement;
		expect(trigger).not.toBeNull();
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('aria-label')).toBe('Player menu for Player');
		expect(trigger.textContent).toContain('👾');
		expect(trigger.textContent).toContain('Player');

		unmount();
	});

	it('opens AuthDialog when guest clicks trigger button', async () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" />
			</I18nProvider>,
		);

		const trigger = container.querySelector('button.user-profile-button') as HTMLButtonElement;
		expect(trigger).not.toBeNull();

		await act(async () => {
			trigger.click();
		});

		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		const authDialog = container.querySelector('#auth-dialog');
		expect(authDialog).not.toBeNull();
		expect(authDialog?.querySelector('h2')?.textContent).toBe('Sign In');

		unmount();
	});

	it('renders localized trigger label for German language', () => {
		const { container, unmount } = render(
			<I18nProvider language="de">
				<HeaderUserMenu lang="de" />
			</I18nProvider>,
		);

		const trigger = container.querySelector('button.user-profile-button');
		expect(trigger?.getAttribute('aria-label')).toBe('Spielermenü für Player');

		unmount();
	});

	it('renders authenticated trigger with menu role and opens popover with profile items', async () => {
		const authSession = {
			isAuthenticated: true,
			isCloudSynced: false,
			user: {
				id: 'user-auth-1',
				displayName: 'ArcadeChamp',
				avatar: { type: 'emoji' as const, value: '🏆' },
				email: 'champ@arcade.de',
				storageMode: 'local' as const,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			},
		};

		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" session={authSession} />
			</I18nProvider>,
		);

		const trigger = container.querySelector('button.user-profile-button') as HTMLButtonElement;
		expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');

		openPopover(container);

		expect(trigger.getAttribute('aria-expanded')).toBe('true');

		// Summary card
		const summaryName = container.querySelector('.summary-name');
		expect(summaryName?.textContent).toBe('ArcadeChamp');

		const summaryStatus = container.querySelector('.summary-status');
		expect(summaryStatus?.textContent).toBe('champ@arcade.de');

		// Tier badge
		const tierBadge = container.querySelector('.summary-tier');
		expect(tierBadge?.textContent).toBe('Tier 2: Account (Device Only)');

		// Navigation links
		const profileLink = container.querySelector('a[href="/en/profile"]');
		expect(profileLink).not.toBeNull();
		expect(profileLink?.textContent).toContain('Manage Profile & Data Settings');

		const medalsLink = container.querySelector('a[href="/en/medals"]');
		expect(medalsLink).not.toBeNull();
		expect(medalsLink?.textContent).toContain('Medal Showcase');

		const statsLink = container.querySelector('a[href="/en/stats"]');
		expect(statsLink).not.toBeNull();
		expect(statsLink?.textContent).toContain('Statistics');

		// Account action is Sign Out
		const signOutButton = container.querySelector('.menu-account-action button');
		expect(signOutButton?.textContent).toContain('Sign Out');

		unmount();
	});

	it('renders authenticated summary and triggers sign out when clicked', async () => {
		const userService = getSharedUserService();
		const signOutSpy = vi.spyOn(userService, 'signOut').mockResolvedValue(undefined);

		const authSession = {
			isAuthenticated: true,
			isCloudSynced: false,
			user: {
				id: 'user-auth-1',
				displayName: 'ArcadeChamp',
				avatar: { type: 'emoji' as const, value: '🏆' },
				email: 'champ@arcade.de',
				storageMode: 'local' as const,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			},
		};

		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" session={authSession} />
			</I18nProvider>,
		);

		// Wait for background session initialization to complete
		await act(async () => {
			await Promise.resolve();
		});

		openPopover(container);

		const summaryName = container.querySelector('.summary-name');
		expect(summaryName?.textContent).toBe('ArcadeChamp');

		const summaryStatus = container.querySelector('.summary-status');
		expect(summaryStatus?.textContent).toBe('champ@arcade.de');

		// Sign out button
		const signOutButton = container.querySelector('.menu-account-action button') as HTMLButtonElement;
		expect(signOutButton).not.toBeNull();
		expect(signOutButton?.disabled).toBe(false);
		expect(signOutButton?.textContent).toContain('Sign Out');

		await act(async () => {
			signOutButton.click();
		});

		expect(signOutSpy).toHaveBeenCalled();

		unmount();
	});

	it('reacts dynamically to user service profile updates without page refresh', async () => {
		const userService = getSharedUserService();

		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" />
			</I18nProvider>,
		);

		const trigger = container.querySelector('button.user-profile-button');
		expect(trigger?.textContent).toContain('Player');
		expect(trigger?.textContent).toContain('👾');

		// Simulate profile update from /[lang]/profile
		await act(async () => {
			await userService.updateProfile({
				displayName: 'StarPlayer',
				avatar: { type: 'emoji', value: '⭐' },
			});
		});

		expect(trigger?.textContent).toContain('StarPlayer');
		expect(trigger?.textContent).toContain('⭐');
		expect(trigger?.getAttribute('aria-label')).toBe('Player menu for StarPlayer');

		unmount();
	});

	it('closes popover on outside dismissal or close event', () => {
		const authSession = {
			isAuthenticated: true,
			isCloudSynced: false,
			user: {
				id: 'user-auth-1',
				displayName: 'ArcadeChamp',
				avatar: { type: 'emoji' as const, value: '🏆' },
				storageMode: 'local' as const,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			},
		};

		const { container, unmount } = render(
			<I18nProvider language="en">
				<HeaderUserMenu lang="en" session={authSession} />
			</I18nProvider>,
		);

		openPopover(container);
		const trigger = container.querySelector('button.user-profile-button');
		expect(trigger?.getAttribute('aria-expanded')).toBe('true');

		closePopover(container);
		expect(trigger?.getAttribute('aria-expanded')).toBe('false');

		unmount();
	});
});
