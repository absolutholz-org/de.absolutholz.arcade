import { type IUserService, getSharedUserService } from '@arcade/lib-user';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import type { AuthDialogMode, AuthDialogProps } from './_AuthDialog.types';

export interface UseAuthDialogProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: AuthDialogMode;
	userService?: IUserService;
	onSuccess?: () => void;
}

export function useAuthDialog({
	isOpen,
	onClose,
	initialMode = 'signIn',
	userService: customUserService,
	onSuccess,
}: UseAuthDialogProps) {
	const [userService] = useState<IUserService>(() => customUserService || getSharedUserService());
	const [mode, setMode] = useState<AuthDialogMode>(initialMode);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [resetSent, setResetSent] = useState(false);

	// Synchronize mode with initialMode and reset fields whenever dialog opens
	useEffect(() => {
		if (isOpen) {
			setMode(initialMode);
			setEmail('');
			setPassword('');
			setIsLoading(false);
			setErrorMessage(null);
			setResetSent(false);
		}
	}, [isOpen, initialMode]);

	const switchMode = useCallback((newMode: AuthDialogMode) => {
		setMode(newMode);
		setErrorMessage(null);
		setResetSent(false);
	}, []);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			setIsLoading(true);
			setErrorMessage(null);

			try {
				if (mode === 'signIn') {
					await userService.signInWithEmailPassword(email, password);
					onSuccess?.();
					onClose();
				} else if (mode === 'signUp') {
					await userService.signUpWithEmailPassword(email, password);
					onSuccess?.();
					onClose();
				} else if (mode === 'forgotPassword') {
					await userService.sendPasswordResetEmail(email);
					setResetSent(true);
				}
			} catch (err) {
				setErrorMessage(err instanceof Error ? err.message : String(err));
			} finally {
				setIsLoading(false);
			}
		},
		[mode, email, password, userService, onClose, onSuccess],
	);

	const handleGoogleSignIn = useCallback(async () => {
		setIsLoading(true);
		setErrorMessage(null);
		try {
			await userService.signInWithGoogle();
			onSuccess?.();
			onClose();
		} catch (err) {
			setErrorMessage(err instanceof Error ? err.message : String(err));
		} finally {
			setIsLoading(false);
		}
	}, [userService, onClose, onSuccess]);

	const handleBack = mode !== 'signIn' ? () => switchMode('signIn') : undefined;

	return {
		mode,
		email,
		password,
		isLoading,
		errorMessage,
		resetSent,
		setEmail,
		setPassword,
		switchMode,
		handleSubmit,
		handleGoogleSignIn,
		handleBack,
	};
}
