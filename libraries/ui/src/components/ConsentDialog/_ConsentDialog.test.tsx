import { saveConsentPreferences } from '@arcade/lib-consent';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConsentDialog } from '.';
import { render } from '../../test-utils';

describe('ConsentDialog', () => {
	beforeEach(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.clear();
		}
		saveConsentPreferences({ cloudSync: false, publicBroadcast: false });
	});

	it('disables cloud sync and public broadcast toggles when unauthenticated and displays hints', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<ConsentDialog isOpen={true} onClose={() => {}} isAuthenticated={false} />
			</I18nProvider>,
		);

		const switches = container.querySelectorAll('input[type="checkbox"]');
		expect(switches.length).toBe(3); // cloudSync, publicBroadcast, analytics

		const cloudSyncSwitch = switches[0] as HTMLInputElement;
		const publicBroadcastSwitch = switches[1] as HTMLInputElement;

		// Both must be disabled and NOT checked (never ON when disabled)
		expect(cloudSyncSwitch.disabled).toBe(true);
		expect(cloudSyncSwitch.checked).toBe(false);
		expect(publicBroadcastSwitch.disabled).toBe(true);
		expect(publicBroadcastSwitch.checked).toBe(false);

		// Must display the clear explanatory hint text
		expect(container.textContent).toContain('Sign in to enable cloud sync.');
		expect(container.textContent).toContain('Requires cloud sync to be enabled.');

		// Tier badge must show Tier 1
		expect(container.textContent).toContain('Tier 1: Anonymous Local');

		unmount();
	});

	it('allows enabling cloud sync when authenticated and shows Tier 2 before enabling sync', () => {
		const { container, unmount } = render(
			<I18nProvider language="en">
				<ConsentDialog isOpen={true} onClose={() => {}} isAuthenticated={true} />
			</I18nProvider>,
		);

		const switches = container.querySelectorAll('input[type="checkbox"]');
		const cloudSyncSwitch = switches[0] as HTMLInputElement;
		const publicBroadcastSwitch = switches[1] as HTMLInputElement;

		// Cloud sync is enabled for interaction (can be checked)
		expect(cloudSyncSwitch.disabled).toBe(false);
		expect(cloudSyncSwitch.checked).toBe(false);

		// Public broadcast is disabled until cloud sync is checked
		expect(publicBroadcastSwitch.disabled).toBe(true);
		expect(publicBroadcastSwitch.checked).toBe(false);
		expect(container.textContent).toContain('Requires cloud sync to be enabled.');

		// Active tier is Tier 2 (Logged in, but sync off)
		expect(container.textContent).toContain('Tier 2: Local Profile');

		unmount();
	});

	it('allows public broadcast toggle when cloud sync is already active (Tier 3 -> Tier 4)', () => {
		saveConsentPreferences({ cloudSync: true, publicBroadcast: false }, true);

		const { container, unmount } = render(
			<I18nProvider language="en">
				<ConsentDialog isOpen={true} onClose={() => {}} isAuthenticated={true} />
			</I18nProvider>,
		);

		const switches = container.querySelectorAll('input[type="checkbox"]');
		const cloudSyncSwitch = switches[0] as HTMLInputElement;
		const publicBroadcastSwitch = switches[1] as HTMLInputElement;

		expect(cloudSyncSwitch.checked).toBe(true);
		expect(cloudSyncSwitch.disabled).toBe(false);

		expect(publicBroadcastSwitch.checked).toBe(false);
		expect(publicBroadcastSwitch.disabled).toBe(false);

		// Tier badge displays Tier 3
		expect(container.textContent).toContain('Tier 3: Cloud-Synced (Private)');

		unmount();
	});
});
