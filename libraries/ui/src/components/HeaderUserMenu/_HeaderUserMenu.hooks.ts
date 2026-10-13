import type { IUserService, UserSession } from '@arcade/lib-user';
import { createUserService } from '@arcade/lib-user';
import { useEffect, useState } from 'react';

export function useHeaderUserMenu() {
	const [userService, setUserService] = useState<IUserService | null>(null);
	const [session, setSession] = useState<UserSession>({
		user: null,
		isAuthenticated: false,
		isCloudSynced: false,
	});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		// Client-only initialization: strictly safe from Astro SSR / static pre-rendering
		const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
		const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
		const appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;
		const firebaseConfig =
			apiKey && projectId && appId
				? {
						apiKey,
						authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
						projectId,
						storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
						messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
						appId,
					}
				: undefined;

		const service = createUserService({ firebaseConfig });
		setUserService(service);

		const unsubscribe = service.subscribe((nextSession) => {
			setSession(nextSession);
		});

		service.initialize().catch((err) => {
			console.error('[@arcade/lib-ui] Failed to initialize user service:', err);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const handleOpenDialog = () => {
		setErrorMessage(null);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setErrorMessage(null);
	};

	const handleUpdateDisplayName = async (name: string) => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.updateDisplayName(name);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSwitchStorageMode = async (mode: 'local' | 'cloud') => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.setStorageMode(mode);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignInEmail = async (email: string, pass: string) => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.signInWithEmail(email, pass);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignUpEmail = async (email: string, pass: string, name?: string) => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.signUpWithEmail(email, pass, name);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (email: string) => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.sendPasswordReset(email);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignOut = async () => {
		if (!userService) return;
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.signOut();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsLoading(false);
		}
	};

	return {
		errorMessage,
		handleCloseDialog,
		handleOpenDialog,
		handleResetPassword,
		handleSignInEmail,
		handleSignOut,
		handleSignUpEmail,
		handleSwitchStorageMode,
		handleUpdateDisplayName,
		isDialogOpen,
		isLoading,
		session,
	};
}
