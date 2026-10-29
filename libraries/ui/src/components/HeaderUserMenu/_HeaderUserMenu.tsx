import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { UserProfileDialog } from '../UserProfileDialog';
import { getInitials } from './_HeaderUserMenu.functions';
import { useHeaderUserMenu } from './_HeaderUserMenu.hooks';
import * as S from './_HeaderUserMenu.styles';
import type { HeaderUserMenuProps } from './_HeaderUserMenu.types';

function HeaderUserMenuContent({ className }: { className?: string }) {
	const {
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
	} = useHeaderUserMenu();

	const userName = session.user?.displayName || '';
	const initials = session.isAuthenticated && userName ? getInitials(userName) : null;
	const displayName = userName || (session.isAuthenticated ? 'User' : 'Guest');
	const triggerAriaLabel = session.isAuthenticated ? `User profile: ${userName || 'User'}` : 'User profile';

	return (
		<S.HeaderUserMenu className={className}>
			<Button
				variant="outline"
				size="md"
				onClick={handleOpenDialog}
				aria-haspopup="dialog"
				aria-expanded={isDialogOpen}
				aria-label={triggerAriaLabel}
				title={triggerAriaLabel}
				className="user-profile-button"
				leadingIcon={
					<span className="user-avatar" aria-hidden="true">
						{initials ? (
							<span className="user-avatar-initials">{initials}</span>
						) : (
							<Icon name="user" size="xs" />
						)}
					</span>
				}
			>
				<span className="user-name">{displayName}</span>
			</Button>

			<UserProfileDialog
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				session={session}
				isLoading={isLoading}
				errorMessage={errorMessage}
				onUpdateDisplayName={handleUpdateDisplayName}
				onSwitchStorageMode={handleSwitchStorageMode}
				onSignInEmail={handleSignInEmail}
				onSignUpEmail={handleSignUpEmail}
				onResetPassword={handleResetPassword}
				onSignOut={handleSignOut}
			/>
		</S.HeaderUserMenu>
	);
}

export function HeaderUserMenu({ lang, className }: HeaderUserMenuProps) {
	return (
		<I18nProvider language={lang}>
			<HeaderUserMenuContent className={className} />
		</I18nProvider>
	);
}
