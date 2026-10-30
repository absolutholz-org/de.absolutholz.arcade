import { useState } from 'react';
import { useUserSession } from '../../hooks/useUserSession';

export function useHeaderUserMenu() {
	const { session, userService, isLoading: isSessionLoading } = useUserSession();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = isSessionLoading || isActionLoading;

	const handleOpenDialog = () => {
		setErrorMessage(null);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setErrorMessage(null);
	};

	const handleUpdateDisplayName = async (name: string) => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.updateDisplayName(name);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	};

	const handleSwitchStorageMode = async (mode: 'local' | 'cloud') => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.setStorageMode(mode);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	};

	const handleSignInEmail = async (email: string, pass: string) => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.signInWithEmail(email, pass);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	};

	const handleSignUpEmail = async (email: string, pass: string, name?: string) => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.signUpWithEmail(email, pass, name);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	};

	const handleResetPassword = async (email: string) => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.sendPasswordReset(email);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
		}
	};

	const handleSignOut = async () => {
		setIsActionLoading(true);
		setErrorMessage(null);
		try {
			await userService.signOut();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error));
		} finally {
			setIsActionLoading(false);
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
