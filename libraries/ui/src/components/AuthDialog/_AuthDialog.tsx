import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Icon } from '../Icon';
import { TextField } from '../TextField';
import { useAuthDialog } from './_AuthDialog.hooks';
import * as S from './_AuthDialog.styles';
import type { AuthDialogProps } from './_AuthDialog.types';

export function AuthDialog({
	className,
	id = 'auth-dialog',
	initialMode = 'signIn',
	isOpen,
	onClose,
	onSuccess,
	userService,
}: AuthDialogProps) {
	const { t } = useI18n();
	const {
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
	} = useAuthDialog({
		isOpen,
		onClose,
		initialMode,
		userService,
		onSuccess,
	});

	const titles = {
		signIn: t('auth.signInTitle'),
		signUp: t('auth.signUpTitle'),
		forgotPassword: t('auth.forgotPasswordTitle'),
	};

	if (!isOpen) {
		return null;
	}

	return (
		<Dialog id={id} isOpen={isOpen} onCancel={onClose} onBack={handleBack} title={titles[mode]}>
			<S.AuthDialogContainer className={className}>
				{errorMessage && (
					<div data-slot="error-banner" role="alert">
						{errorMessage}
					</div>
				)}

				{mode === 'forgotPassword' && resetSent ? (
					<div data-slot="success-state">
						<output data-slot="success-banner">{t('auth.resetSentSuccess')}</output>
						<Button variant="primary" type="button" size="md" onClick={() => switchMode('signIn')}>
							{t('auth.submitSignIn')}
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<TextField
							id="auth-email-input"
							type="email"
							label={t('auth.emailLabel')}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							fullWidth
							autoComplete="email"
							disabled={isLoading}
						/>

						{mode !== 'forgotPassword' && (
							<TextField
								id="auth-password-input"
								type="password"
								label={t('auth.passwordLabel')}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								fullWidth
								autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
								disabled={isLoading}
							/>
						)}

						<Button
							variant="primary"
							type="submit"
							size="md"
							disabled={isLoading || !email.trim() || (mode !== 'forgotPassword' && !password)}
						>
							{mode === 'signIn' && t('auth.submitSignIn')}
							{mode === 'signUp' && t('auth.submitSignUp')}
							{mode === 'forgotPassword' && t('auth.sendResetLink')}
						</Button>

						{mode !== 'forgotPassword' && (
							<>
								<div data-slot="or-divider">
									<span>{t('auth.orDivider')}</span>
								</div>

								<Button
									variant="outline"
									type="button"
									size="md"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
									leadingIcon={<Icon name="google" size="sm" />}
								>
									{t('auth.signInWithGoogle')}
								</Button>
							</>
						)}

						<div data-slot="toggle-links">
							{mode === 'signIn' && (
								<>
									<button
										type="button"
										onClick={() => switchMode('forgotPassword')}
										disabled={isLoading}
									>
										{t('auth.forgotPassword')}
									</button>
									<button type="button" onClick={() => switchMode('signUp')} disabled={isLoading}>
										{t('auth.needAccount')}
									</button>
								</>
							)}

							{mode === 'signUp' && (
								<button type="button" onClick={() => switchMode('signIn')} disabled={isLoading}>
									{t('auth.haveAccount')}
								</button>
							)}

							{mode === 'forgotPassword' && (
								<button type="button" onClick={() => switchMode('signIn')} disabled={isLoading}>
									{t('auth.haveAccount')}
								</button>
							)}
						</div>
					</form>
				)}
			</S.AuthDialogContainer>
		</Dialog>
	);
}
