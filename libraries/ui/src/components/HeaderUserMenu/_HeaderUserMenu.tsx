import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { AuthDialog } from '../AuthDialog';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { EmojiAvatar } from '../EmojiAvatar';
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { useHeaderUserMenu } from './_HeaderUserMenu.hooks';
import * as S from './_HeaderUserMenu.styles';
import type { HeaderUserMenuProps } from './_HeaderUserMenu.types';

function HeaderUserMenuContent({
	align = 'bottom',
	className,
	id,
	session,
}: {
	align?: HeaderUserMenuProps['align'];
	className?: string;
	id?: string;
	session?: HeaderUserMenuProps['session'];
}) {
	const { t, language } = useI18n();
	const {
		avatar,
		currentTier,
		displayName,
		errorMessage,
		handleAuthSuccess,
		handleCloseAuthDialog,
		handleOpenChange,
		handleSignOut,
		handleTriggerClick,
		isAuthenticated,
		isAuthDialogOpen,
		isLoading,
		isMenuOpen,
		user,
		userService,
	} = useHeaderUserMenu({ session });

	const tierMetadata = {
		1: {
			title: t('profile.tier1Title'),
			badgeVariant: 'neutral' as const,
		},
		2: {
			title: t('profile.tier2Title'),
			badgeVariant: 'accent' as const,
		},
		3: {
			title: t('profile.tier3Title'),
			badgeVariant: 'accent' as const,
		},
		4: {
			title: t('profile.tier4Title'),
			badgeVariant: 'success' as const,
		},
	};

	const tierInfo = tierMetadata[currentTier];
	const tierBadgeLabel = t('profile.tierBadge', {
		tier: currentTier,
		title: tierInfo.title,
	});

	const triggerAriaLabel = t('auth.playerMenuAriaLabel', { displayName });
	const authStatusLabel = isAuthenticated ? user?.email || t('auth.authenticatedAs') : t('auth.guestPlayer');

	const triggerButton = (
		<Button
			variant="outline"
			size="md"
			className="user-profile-button"
			aria-haspopup={isAuthenticated ? 'menu' : 'dialog'}
			aria-expanded={isAuthenticated ? isMenuOpen : isAuthDialogOpen}
			aria-label={triggerAriaLabel}
			title={triggerAriaLabel}
			onClick={!isAuthenticated ? handleTriggerClick : undefined}
			leadingIcon={<EmojiAvatar value={avatar} size="sm" aria-hidden />}
		>
			<span className="user-name">{displayName}</span>
		</Button>
	);

	if (!isAuthenticated) {
		return (
			<S.HeaderUserMenu id={id} className={className}>
				{triggerButton}
				<AuthDialog
					isOpen={isAuthDialogOpen}
					onClose={handleCloseAuthDialog}
					onSuccess={handleAuthSuccess}
					userService={userService}
				/>
			</S.HeaderUserMenu>
		);
	}

	return (
		<S.HeaderUserMenu id={id} className={className}>
			<Popover align={align} onOpenChange={handleOpenChange}>
				{triggerButton}

				<S.MenuContainer role="menu" aria-label={triggerAriaLabel}>
					{errorMessage && (
						<div className="menu-error-banner" role="alert">
							{errorMessage}
						</div>
					)}

					{/* Section 1: User Summary Card (Top) */}
					<S.SummaryCard>
						<div className="summary-header">
							<EmojiAvatar value={avatar} size="md" aria-hidden />
							<div className="summary-details">
								<span className="summary-name">{displayName}</span>
								<span className="summary-status">{authStatusLabel}</span>
							</div>
						</div>
						<Badge variant={tierInfo.badgeVariant} size="sm" className="summary-tier">
							{tierBadgeLabel}
						</Badge>
					</S.SummaryCard>

					<Divider />

					{/* Section 2: Navigation Items (List) */}
					<nav className="menu-nav-list" aria-label={triggerAriaLabel}>
						<Button
							as="a"
							href={`/${language}/profile`}
							variant="ghost"
							size="sm"
							className="menu-nav-button"
							leadingIcon={<Icon name="user" size="sm" />}
						>
							{t('navigation.manageProfile')}
						</Button>
						<Button
							as="a"
							href={`/${language}/medals`}
							variant="ghost"
							size="sm"
							className="menu-nav-button"
							leadingIcon={<Icon name="trophy" size="sm" />}
						>
							{t('navigation.medals')}
						</Button>
						<Button
							as="a"
							href={`/${language}/stats`}
							variant="ghost"
							size="sm"
							className="menu-nav-button"
							leadingIcon={<Icon emoji="📊" size="sm" />}
						>
							{t('navigation.stats')}
						</Button>
					</nav>

					<Divider />

					{/* Section 3: Divider & Account Action (Bottom) */}
					<div className="menu-account-action">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleSignOut}
							disabled={isLoading}
							className="menu-nav-button"
							leadingIcon={<Icon name="close" size="sm" />}
						>
							{t('auth.signOut')}
						</Button>
					</div>
				</S.MenuContainer>
			</Popover>
		</S.HeaderUserMenu>
	);
}

export function HeaderUserMenu({ align = 'bottom', className, id, lang, session }: HeaderUserMenuProps) {
	return (
		<I18nProvider language={lang}>
			<HeaderUserMenuContent align={align} className={className} id={id} session={session} />
		</I18nProvider>
	);
}
