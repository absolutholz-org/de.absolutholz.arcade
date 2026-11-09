import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { IUserService, PlayerProfile } from '@arcade/lib-user';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { AuthDialog } from './_AuthDialog';

describe('AuthDialog', () => {
	beforeEach(() => {
		// Polyfill HTMLDialogElement modal methods if missing in happy-dom
		if (!HTMLDialogElement.prototype.showModal) {
			HTMLDialogElement.prototype.showModal = function () {
				this.open = true;
			};
		}
		if (!HTMLDialogElement.prototype.close) {
			HTMLDialogElement.prototype.close = function () {
				this.open = false;
			};
		}
	});

	function createMockUserService(): IUserService {
		const mockProfile = { id: 'user-1', displayName: 'Player' } as unknown as PlayerProfile;
		return {
			getSession: vi.fn(),
			subscribe: vi.fn(() => () => {}),
			initialize: vi.fn(),
			signInAnonymously: vi.fn(),
			signInWithGoogle: vi.fn().mockResolvedValue(mockProfile),
			signUpWithEmail: vi.fn(),
			signUpWithEmailPassword: vi.fn().mockResolvedValue(mockProfile),
			signInWithEmail: vi.fn(),
			signInWithEmailPassword: vi.fn().mockResolvedValue(mockProfile),
			sendPasswordReset: vi.fn(),
			sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
			signOut: vi.fn(),
			updateProfile: vi.fn(),
			updateDisplayName: vi.fn(),
			updateAvatar: vi.fn(),
			setStorageMode: vi.fn(),
		};
	}

	function setInputValue(input: HTMLInputElement, value: string) {
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
		nativeInputValueSetter?.call(input, value);
		act(() => {
			input.dispatchEvent(new Event('input', { bubbles: true }));
			input.dispatchEvent(new Event('change', { bubbles: true }));
		});
	}

	it('renders in signIn mode by default with email, password, Google button and toggle links', () => {
		const onClose = vi.fn();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} />
			</I18nProvider>,
		);

		const title = container.querySelector('h2');
		expect(title?.textContent).toBe('Sign In');

		const emailInput = container.querySelector('#auth-email-input') as HTMLInputElement;
		const passwordInput = container.querySelector('#auth-password-input') as HTMLInputElement;
		expect(emailInput).not.toBeNull();
		expect(passwordInput).not.toBeNull();

		const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
		expect(submitButton.textContent).toBe('Sign In');
		expect(submitButton.disabled).toBe(true);

		const googleButton = container.querySelector('button[type="button"]') as HTMLButtonElement;
		expect(container.textContent).toContain('Sign In with Google');

		expect(container.textContent).toContain("Don't have an account? Sign up");
		expect(container.textContent).toContain('Forgot password?');

		unmount();
	});

	it('switches between signIn, signUp, and forgotPassword modes', () => {
		const onClose = vi.fn();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} />
			</I18nProvider>,
		);

		// Switch to signUp
		const signUpLink = Array.from(container.querySelectorAll('[data-slot="toggle-links"] button')).find((b) =>
			b.textContent?.includes('Sign up'),
		) as HTMLButtonElement;
		expect(signUpLink).toBeDefined();

		act(() => {
			signUpLink.click();
		});

		expect(container.querySelector('h2')?.textContent).toBe('Create Account');
		expect(container.querySelector('button[type="submit"]')?.textContent).toBe('Create Account');

		// Switch back to signIn
		const signInLink = Array.from(container.querySelectorAll('[data-slot="toggle-links"] button')).find((b) =>
			b.textContent?.includes('Sign in'),
		) as HTMLButtonElement;
		expect(signInLink).toBeDefined();

		act(() => {
			signInLink.click();
		});

		expect(container.querySelector('h2')?.textContent).toBe('Sign In');

		// Switch to forgotPassword
		const forgotLink = Array.from(container.querySelectorAll('[data-slot="toggle-links"] button')).find((b) =>
			b.textContent?.includes('Forgot password?'),
		) as HTMLButtonElement;
		expect(forgotLink).toBeDefined();

		act(() => {
			forgotLink.click();
		});

		expect(container.querySelector('h2')?.textContent).toBe('Reset Password');
		// Password field is omitted in forgot password mode
		expect(container.querySelector('#auth-password-input')).toBeNull();
		expect(container.querySelector('button[type="submit"]')?.textContent).toBe('Send Reset Link');

		unmount();
	});

	it('submits signIn and calls userService.signInWithEmailPassword', async () => {
		const onClose = vi.fn();
		const mockUserService = createMockUserService();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} userService={mockUserService} />
			</I18nProvider>,
		);

		const emailInput = container.querySelector('#auth-email-input') as HTMLInputElement;
		const passwordInput = container.querySelector('#auth-password-input') as HTMLInputElement;
		const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

		setInputValue(emailInput, 'player@arcade.de');
		setInputValue(passwordInput, 'secretPass123');
		expect(submitButton.disabled).toBe(false);

		await act(async () => {
			const form = submitButton.closest('form');
			form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});

		expect(mockUserService.signInWithEmailPassword).toHaveBeenCalledWith('player@arcade.de', 'secretPass123');
		expect(onClose).toHaveBeenCalled();

		unmount();
	});

	it('submits signUp and calls userService.signUpWithEmailPassword', async () => {
		const onClose = vi.fn();
		const mockUserService = createMockUserService();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} initialMode="signUp" userService={mockUserService} />
			</I18nProvider>,
		);

		const emailInput = container.querySelector('#auth-email-input') as HTMLInputElement;
		const passwordInput = container.querySelector('#auth-password-input') as HTMLInputElement;
		const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

		setInputValue(emailInput, 'newplayer@arcade.de');
		setInputValue(passwordInput, 'securePassword1');
		expect(submitButton.disabled).toBe(false);

		await act(async () => {
			const form = submitButton.closest('form');
			form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});

		expect(mockUserService.signUpWithEmailPassword).toHaveBeenCalledWith('newplayer@arcade.de', 'securePassword1');
		expect(onClose).toHaveBeenCalled();

		unmount();
	});

	it('submits forgotPassword and renders success banner on completion', async () => {
		const onClose = vi.fn();
		const mockUserService = createMockUserService();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog
					isOpen={true}
					onClose={onClose}
					initialMode="forgotPassword"
					userService={mockUserService}
				/>
			</I18nProvider>,
		);

		const emailInput = container.querySelector('#auth-email-input') as HTMLInputElement;
		const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

		setInputValue(emailInput, 'forgot@arcade.de');
		expect(submitButton.disabled).toBe(false);

		await act(async () => {
			const form = submitButton.closest('form');
			form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});

		expect(mockUserService.sendPasswordResetEmail).toHaveBeenCalledWith('forgot@arcade.de');
		const successBanner = container.querySelector('[data-slot="success-banner"]');
		expect(successBanner?.textContent).toBe('Password reset link sent to your email.');

		unmount();
	});

	it('triggers Google sign-in and closes dialog on success', async () => {
		const onClose = vi.fn();
		const mockUserService = createMockUserService();
		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} userService={mockUserService} />
			</I18nProvider>,
		);

		const googleButton = Array.from(container.querySelectorAll('button')).find((b) =>
			b.textContent?.includes('Sign In with Google'),
		) as HTMLButtonElement;
		expect(googleButton).toBeDefined();

		await act(async () => {
			googleButton.click();
		});

		expect(mockUserService.signInWithGoogle).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalled();

		unmount();
	});

	it('displays accessible error alert on rejection', async () => {
		const onClose = vi.fn();
		const mockUserService = createMockUserService();
		vi.mocked(mockUserService.signInWithEmailPassword).mockRejectedValue(new Error('Invalid password or email'));

		const { container, unmount } = render(
			<I18nProvider language="en">
				<AuthDialog isOpen={true} onClose={onClose} userService={mockUserService} />
			</I18nProvider>,
		);

		const emailInput = container.querySelector('#auth-email-input') as HTMLInputElement;
		const passwordInput = container.querySelector('#auth-password-input') as HTMLInputElement;
		const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

		setInputValue(emailInput, 'player@arcade.de');
		setInputValue(passwordInput, 'wrongpass');

		await act(async () => {
			const form = submitButton.closest('form');
			form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});

		const errorAlert = container.querySelector('[data-slot="error-banner"]');
		expect(errorAlert).not.toBeNull();
		expect(errorAlert?.getAttribute('role')).toBe('alert');
		expect(errorAlert?.textContent).toBe('Invalid password or email');

		unmount();
	});
});
