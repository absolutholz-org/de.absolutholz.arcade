import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useState } from 'react';
import { Button } from '../Button';
import { ConsentDialog } from '../ConsentDialog';
import { Dialog } from '../Dialog';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { Stack } from '../Stack';
import { Switch } from '../Switch';
import { Text } from '../Text';
import { TextField } from '../TextField';
import { useUserProfileDialog } from './_UserProfileDialog.hooks';
import * as S from './_UserProfileDialog.styles';
import type { UserProfileDialogProps } from './_UserProfileDialog.types';

export function UserProfileDialog({
	className,
	errorMessage,
	id,
	isLoading = false,
	isOpen,
	onClose,
	onResetPassword,
	onSignInEmail,
	onSignOut,
	onSignUpEmail,
	onSwitchStorageMode,
	onUpdateDisplayName,
	session,
}: UserProfileDialogProps) {
	const { t, language } = useI18n();
	const [isConsentOpen, setIsConsentOpen] = useState(false);
	const {
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
	} = useUserProfileDialog({
		isOpen,
		onResetPassword,
		onSignInEmail,
		onSignOut,
		onSignUpEmail,
		onSwitchStorageMode,
		onUpdateDisplayName,
		session,
	});

	const titles = {
		forgotPassword: t('auth.resetPasswordTitle'),
		profile: t('auth.profileTitle'),
		signIn: t('auth.signInTitle'),
		signUp: t('auth.signUpTitle'),
	};

	const handleBack =
		viewMode !== 'profile'
			? () => handleViewChange(viewMode === 'forgotPassword' ? 'signIn' : 'profile')
			: undefined;

	return (
		<Dialog id={id} isOpen={isOpen} onCancel={onClose} onBack={handleBack} title={titles[viewMode]}>
			<S.UserProfileDialog className={className}>
				{errorMessage && (
					<div data-slot="error-banner" role="alert">
						{errorMessage}
					</div>
				)}

				{viewMode === 'profile' && (
					<>
						<div data-slot="session-info">
							{session.isAuthenticated ? (
								<>
									<div data-slot="session-header">
										<span data-slot="session-badge">{t('auth.authenticatedAs')}</span>
										<span data-slot="sync-indicator">
											<Icon
												name={session.user?.storageMode === 'cloud' ? 'cloud' : 'hard-drive'}
												size="xs"
											/>
											{session.user?.storageMode === 'cloud' ? t('auth.cloudSyncLabel') : 'Local'}
										</span>
									</div>
									<span data-slot="session-detail">
										{session.user?.email ?? session.user?.displayName}
									</span>
								</>
							) : (
								<span data-slot="session-detail">{t('auth.guestNotice')}</span>
							)}
						</div>

						<div data-slot="medals-link">
							<Button
								variant="outline"
								size="sm"
								as="a"
								href={`/${language}/medals`}
								leadingIcon={<Icon name="trophy" size="sm" />}
							>
								{t('auth.viewMedals')}
							</Button>
						</div>

						<form onSubmit={handleUpdateDisplayName} data-slot="display-name-form">
							<TextField
								label={t('auth.displayNameLabel')}
								value={displayName}
								onChange={handleDisplayNameChange}
								fullWidth
								disabled={isLoading}
							/>
							<Button
								variant={isSaved ? 'outline' : 'secondary'}
								type="submit"
								disabled={isLoading || !displayName.trim() || (isPristine && !isSaved)}
								leadingIcon={isSaved ? <Icon name="check" size="sm" /> : undefined}
							>
								{isSaved ? t('actions.saved') : t('actions.save')}
							</Button>
						</form>

						<Divider />

						{session.isAuthenticated ? (
							<>
								<div data-slot="cloud-sync-card">
									<Stack spacing="xs">
										<Switch
											label={t('auth.cloudSyncLabel')}
											checked={session.user?.storageMode === 'cloud'}
											onChange={handleSwitchStorageMode}
											disabled={isLoading}
										/>
										<Text variant="small" as="p">
											{t('auth.cloudSyncDescription')}
										</Text>
									</Stack>
								</div>

								<Button
									variant="outline"
									size="sm"
									type="button"
									onClick={() => setIsConsentOpen(true)}
									leadingIcon={<Icon name="settings" size="sm" />}
								>
									{t('consent.modal.title')}
								</Button>

								<Divider />

								<div data-slot="actions">
									<Button variant="secondary" onClick={handleSignOut} disabled={isLoading}>
										{t('auth.signOut')}
									</Button>
								</div>
							</>
						) : (
							<div data-slot="guest-sync-card">
								<div data-slot="card-header">
									<Icon name="hard-drive" size="sm" />
									<span>{t('auth.cloudSyncLabel')}</span>
								</div>
								<Text variant="small" as="p">
									{t('auth.guestSyncNotice')}
								</Text>
								<Button
									variant="primary"
									type="button"
									onClick={() => handleViewChange('signIn')}
									disabled={isLoading}
								>
									{t('auth.enableCloudSync')}
								</Button>
								<Button
									variant="outline"
									size="sm"
									type="button"
									onClick={() => setIsConsentOpen(true)}
									leadingIcon={<Icon name="settings" size="sm" />}
								>
									{t('consent.modal.title')}
								</Button>
								<div data-slot="secondary-actions">
									<button
										type="button"
										data-slot="link-button"
										onClick={() => handleViewChange('signUp')}
										disabled={isLoading}
									>
										{t('auth.needAccount')}
									</button>
								</div>
							</div>
						)}
					</>
				)}

				{viewMode === 'signIn' && (
					<form onSubmit={handleSignIn}>
						<TextField
							type="email"
							label={t('auth.emailLabel')}
							value={email}
							onChange={handleEmailChange}
							required
							fullWidth
							autoComplete="email"
							disabled={isLoading}
						/>
						<TextField
							type="password"
							label={t('auth.passwordLabel')}
							value={password}
							onChange={handlePasswordChange}
							required
							fullWidth
							autoComplete="current-password"
							disabled={isLoading}
						/>
						<Button variant="primary" type="submit" size="md" disabled={isLoading || !email || !password}>
							{t('auth.signIn')}
						</Button>
						<div data-slot="secondary-actions">
							<button
								type="button"
								data-slot="link-button"
								onClick={() => handleViewChange('forgotPassword')}
								disabled={isLoading}
							>
								{t('auth.forgotPassword')}
							</button>
							<button
								type="button"
								data-slot="link-button"
								onClick={() => handleViewChange('signUp')}
								disabled={isLoading}
							>
								{t('auth.needAccount')}
							</button>
						</div>
					</form>
				)}

				{viewMode === 'signUp' && (
					<form onSubmit={handleSignUp}>
						<TextField
							type="text"
							label={t('auth.displayNameLabel')}
							value={displayName}
							onChange={handleDisplayNameChange}
							fullWidth
							autoComplete="nickname"
							disabled={isLoading}
						/>
						<TextField
							type="email"
							label={t('auth.emailLabel')}
							value={email}
							onChange={handleEmailChange}
							required
							fullWidth
							autoComplete="email"
							disabled={isLoading}
						/>
						<TextField
							type="password"
							label={t('auth.passwordLabel')}
							value={password}
							onChange={handlePasswordChange}
							required
							fullWidth
							autoComplete="new-password"
							disabled={isLoading}
						/>
						<Button variant="primary" type="submit" size="md" disabled={isLoading || !email || !password}>
							{t('auth.signUp')}
						</Button>
						<div data-slot="secondary-actions">
							<button
								type="button"
								data-slot="link-button"
								onClick={() => handleViewChange('signIn')}
								disabled={isLoading}
							>
								{t('auth.haveAccount')}
							</button>
						</div>
					</form>
				)}

				{viewMode === 'forgotPassword' &&
					(resetSent ? (
						<Stack spacing="md">
							<output data-slot="success-banner">{t('auth.resetSentSuccess')}</output>
							<Button
								variant="primary"
								type="button"
								size="md"
								onClick={() => handleViewChange('signIn')}
								disabled={isLoading}
							>
								{t('auth.signIn')}
							</Button>
						</Stack>
					) : (
						<form onSubmit={handleResetPassword}>
							<TextField
								type="email"
								label={t('auth.emailLabel')}
								value={email}
								onChange={handleEmailChange}
								required
								fullWidth
								autoComplete="email"
								disabled={isLoading}
							/>
							<Button variant="primary" type="submit" size="md" disabled={isLoading || !email}>
								{t('auth.sendResetLink')}
							</Button>
							<div data-slot="secondary-actions">
								<button
									type="button"
									data-slot="link-button"
									onClick={() => handleViewChange('signIn')}
									disabled={isLoading}
								>
									{t('auth.haveAccount')}
								</button>
							</div>
						</form>
					))}
			</S.UserProfileDialog>
			<ConsentDialog
				isOpen={isConsentOpen}
				onClose={() => setIsConsentOpen(false)}
				isAuthenticated={session.isAuthenticated}
			/>
		</Dialog>
	);
}
