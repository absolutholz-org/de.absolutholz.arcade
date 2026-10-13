import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import type { UserProfileDialogProps, UserProfileDialogView } from './_UserProfileDialog.types';

export interface UseUserProfileDialogProps {
	isOpen: boolean;
	session: UserProfileDialogProps['session'];
	onUpdateDisplayName: UserProfileDialogProps['onUpdateDisplayName'];
	onSwitchStorageMode: UserProfileDialogProps['onSwitchStorageMode'];
	onSignInEmail: UserProfileDialogProps['onSignInEmail'];
	onSignUpEmail: UserProfileDialogProps['onSignUpEmail'];
	onResetPassword: UserProfileDialogProps['onResetPassword'];
	onSignOut: UserProfileDialogProps['onSignOut'];
}

export function useUserProfileDialog({
	isOpen,
	session,
	onUpdateDisplayName,
	onSwitchStorageMode,
	onSignInEmail,
	onSignUpEmail,
	onResetPassword,
	onSignOut,
}: UseUserProfileDialogProps) {
	const [viewMode, setViewMode] = useState<UserProfileDialogView>('profile');
	const [displayName, setDisplayName] = useState(session.user?.displayName ?? '');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [resetSent, setResetSent] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const isPristine = displayName.trim() === (session.user?.displayName ?? '').trim();

	// Sync local displayName when session user changes
	useEffect(() => {
		if (session.user?.displayName !== undefined) {
			setDisplayName(session.user.displayName);
		}
	}, [session.user?.displayName]);

	// Reset forms and viewMode when dialog is opened
	useEffect(() => {
		if (isOpen) {
			setViewMode('profile');
			setEmail('');
			setPassword('');
			setResetSent(false);
			setIsSaved(false);
			setDisplayName(session.user?.displayName ?? '');
		}
	}, [isOpen, session.user?.displayName]);

	// Auto-clear saved state after feedback duration
	useEffect(() => {
		if (!isSaved) return;
		const timer = setTimeout(() => {
			setIsSaved(false);
		}, 2500);
		return () => clearTimeout(timer);
	}, [isSaved]);

	const handleViewChange = (newView: UserProfileDialogView) => {
		setViewMode(newView);
		setResetSent(false);
		setIsSaved(false);
		setEmail('');
		setPassword('');
	};

	const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setDisplayName(event.target.value);
		if (isSaved) {
			setIsSaved(false);
		}
	};

	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleUpdateDisplayName = async (event: FormEvent) => {
		event.preventDefault();
		const trimmed = displayName.trim();
		if (trimmed && !isPristine) {
			await onUpdateDisplayName(trimmed);
			setIsSaved(true);
		}
	};

	const handleSwitchStorageMode = async (event: ChangeEvent<HTMLInputElement>) => {
		const targetMode = event.target.checked ? 'cloud' : 'local';
		await onSwitchStorageMode(targetMode);
	};

	const handleSignIn = async (event: FormEvent) => {
		event.preventDefault();
		await onSignInEmail(email, password);
		setViewMode('profile');
	};

	const handleSignUp = async (event: FormEvent) => {
		event.preventDefault();
		await onSignUpEmail(email, password, displayName.trim() || undefined);
		setViewMode('profile');
	};

	const handleResetPassword = async (event: FormEvent) => {
		event.preventDefault();
		await onResetPassword(email);
		setResetSent(true);
	};

	const handleSignOut = async () => {
		await onSignOut();
		setViewMode('profile');
	};

	return {
		displayName,
		email,
		handleDisplayNameChange,
		handleEmailChange,
		handlePasswordChange,
		handleResetPassword,
		handleSignIn,
		handleSignOut,
		handleSignUp,
		handleSwitchStorageMode,
		handleUpdateDisplayName,
		handleViewChange,
		isPristine,
		isSaved,
		password,
		resetSent,
		viewMode,
	};
}
