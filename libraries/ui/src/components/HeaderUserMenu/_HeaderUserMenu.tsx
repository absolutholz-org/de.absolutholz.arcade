import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { UserProfileDialog } from '../UserProfileDialog';
import { useHeaderUserMenu } from './_HeaderUserMenu.hooks';
import * as S from './_HeaderUserMenu.styles';
import type { HeaderUserMenuProps } from './_HeaderUserMenu.types';

function HeaderUserMenuContent({ className }: { className?: string }) {
	const { t } = useI18n('common');
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

	const isCloud = session.user?.storageMode === 'cloud';
	const displayName = session.user?.displayName || (session.isAuthenticated ? 'User' : 'Guest');
	const triggerAriaLabel = `${displayName} - ${isCloud ? t('auth.cloudSyncLabel') : 'Local'}`;

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
				leadingIcon={<Icon name="user" size="sm" />}
			>
				<span className="user-trigger-content">
					<span className="user-name">{displayName}</span>
					<span className="sync-badge" aria-hidden="true">
						<Icon name={isCloud ? 'cloud' : 'hard-drive'} size="xs" />
					</span>
				</span>
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
