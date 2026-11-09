import { MAX_DISPLAY_NAME_LENGTH } from '@arcade/lib-user';
import React from 'react';
import { AuthDialog } from '../AuthDialog';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { EmojiAvatarPicker } from '../EmojiAvatarPicker';
import { Icon } from '../Icon';
import { Switch } from '../Switch';
import { TextField } from '../TextField';
import { usePlayerProfileView } from './_PlayerProfileView.hooks';
import * as S from './_PlayerProfileView.styles';
import type { PlayerProfileViewProps } from './_PlayerProfileView.types';

export function PlayerProfileView({
	className,
	id = 'player-profile-view',
	session: externalSession,
	onSaveSuccess,
}: PlayerProfileViewProps) {
	const {
		t,
		language,
		session,
		displayName,
		avatar,
		preferences,
		currentTier,
		isAuthenticated,
		isCloudSyncActive,
		isPublicConsentActive,
		isSubmitting,
		isPristine,
		isValid,
		isSaved,
		statusAnnouncement,
		errorMessage,
		handleDisplayNameChange,
		handleAvatarChange,
		handleSaveProfile,
		handleCloudSyncToggle,
		handlePublicConsentToggle,
		handleExportData,
		handleSignInGoogle,
		handleSignOut,
		isAuthOpen,
		setIsAuthOpen,
		authMode,
		setAuthMode,
	} = usePlayerProfileView({ session: externalSession, onSaveSuccess });

	const tierMetadata = {
		1: {
			title: t('profile.tier1Title'),
			description: t('profile.tier1Description'),
			badgeVariant: 'neutral' as const,
		},
		2: {
			title: t('profile.tier2Title'),
			description: t('profile.tier2Description'),
			badgeVariant: 'accent' as const,
		},
		3: {
			title: t('profile.tier3Title'),
			description: t('profile.tier3Description'),
			badgeVariant: 'accent' as const,
		},
		4: {
			title: t('profile.tier4Title'),
			description: t('profile.tier4Description'),
			badgeVariant: 'success' as const,
		},
	};

	const activeTierInfo = tierMetadata[currentTier];

	return (
		<S.ProfileRoot id={id} className={className}>
			<header data-slot="page-header">
				<h1>{t('profile.title')}</h1>
				<p>{t('profile.description')}</p>
			</header>

			{/* Accessible Live Region */}
			<output data-slot="live-region" aria-live="polite" aria-atomic="true">
				{statusAnnouncement}
			</output>

			{errorMessage && (
				<div data-slot="error-banner" role="alert">
					{errorMessage}
				</div>
			)}

			{isSaved && <output data-slot="status-banner">{t('profile.profileUpdatedSuccess')}</output>}

			{/* Section 1: Player Identity */}
			<S.ProfileSection aria-labelledby="section-identity-heading">
				<div data-slot="section-header">
					<h2 id="section-identity-heading">{t('profile.identitySectionTitle')}</h2>
				</div>

				<form onSubmit={handleSaveProfile} noValidate>
					<div data-slot="identity-row">
						<div data-slot="avatar-picker-wrapper">
							<span data-slot="avatar-label">{t('profile.avatarLabel')}</span>
							<EmojiAvatarPicker
								value={avatar}
								onChange={handleAvatarChange}
								disabled={isSubmitting}
								ariaLabel={t('profile.avatarPickerAriaLabel')}
							/>
						</div>

						<div data-slot="name-fields">
							<TextField
								id="profile-display-name-input"
								label={t('auth.displayNameLabel')}
								value={displayName}
								onChange={handleDisplayNameChange}
								maxLength={MAX_DISPLAY_NAME_LENGTH}
								disabled={isSubmitting}
								fullWidth
								required
								aria-describedby="profile-display-name-counter profile-display-name-error"
							/>
							<div data-slot="counter-row" id="profile-display-name-counter">
								{errorMessage ? (
									<span data-slot="error-text" id="profile-display-name-error" role="alert">
										{errorMessage}
									</span>
								) : (
									<span />
								)}
								<span data-slot="char-count">
									{displayName.length} / {MAX_DISPLAY_NAME_LENGTH}
								</span>
							</div>
						</div>
					</div>

					<div data-slot="form-actions">
						<Button
							variant={isSaved ? 'outline' : 'primary'}
							type="submit"
							disabled={isSubmitting || !isValid || (isPristine && !isSaved)}
							leadingIcon={isSaved ? <Icon name="check" size="sm" /> : undefined}
						>
							{isSaved ? t('actions.saved') : t('actions.save')}
						</Button>
					</div>
				</form>
			</S.ProfileSection>

			{/* Section 2: Data Sovereignty & Cloud Tiers (ADR 0003) */}
			<S.ProfileSection aria-labelledby="section-sovereignty-heading">
				<div data-slot="section-header">
					<h2 id="section-sovereignty-heading">{t('profile.sovereigntySectionTitle')}</h2>
				</div>

				<section data-slot="tier-card" aria-label={t('profile.activeTierLabel')}>
					<div data-slot="tier-header">
						<span data-slot="tier-title">{activeTierInfo.title}</span>
						<Badge variant={activeTierInfo.badgeVariant} size="md">
							{t('profile.activeTierLabel')}: Tier {currentTier}
						</Badge>
					</div>
					<p data-slot="tier-desc">{activeTierInfo.description}</p>
				</section>

				<div data-slot="control-group">
					<div data-slot="control-item">
						<Switch
							id="profile-cloud-sync-toggle"
							label={t('profile.cloudSyncToggle')}
							checked={isCloudSyncActive}
							onChange={handleCloudSyncToggle}
							disabled={isSubmitting}
						/>
						<span data-slot="control-hint">{t('profile.cloudSyncToggleDescription')}</span>
					</div>

					<div data-slot="control-item">
						<Switch
							id="profile-leaderboard-toggle"
							label={t('profile.leaderboardToggle')}
							checked={isPublicConsentActive}
							onChange={handlePublicConsentToggle}
							disabled={isSubmitting || !isCloudSyncActive}
						/>
						<span data-slot="control-hint">{t('profile.leaderboardToggleDescription')}</span>
						{!isCloudSyncActive && (
							<span data-slot="control-disabled-warning" role="note">
								{t('profile.leaderboardDisabledHint')}
							</span>
						)}
					</div>
				</div>
			</S.ProfileSection>

			{/* Section 3: Data Sovereignty Tools & Navigation Links */}
			<S.ProfileSection aria-labelledby="section-tools-heading">
				<div data-slot="section-header">
					<h2 id="section-tools-heading">{t('profile.toolsSectionTitle')}</h2>
				</div>

				<div data-slot="tools-nav-group">
					<Button
						variant="outline"
						size="md"
						as="a"
						href={`/${language}/medals`}
						leadingIcon={<Icon emoji="🏅" size="sm" />}
					>
						{t('navigation.medals')}
					</Button>

					<Button
						variant="outline"
						size="md"
						as="a"
						href={`/${language}/stats`}
						leadingIcon={<Icon emoji="📊" size="sm" />}
					>
						{t('navigation.stats')}
					</Button>
				</div>

				<Divider />

				<div data-slot="tool-card">
					<strong>{t('profile.exportDataTitle')}</strong>
					<p data-slot="tool-desc">{t('profile.exportDataDescription')}</p>
					<div>
						<Button
							variant="secondary"
							size="md"
							type="button"
							onClick={handleExportData}
							leadingIcon={<Icon name="download" size="sm" />}
						>
							{t('profile.exportDataButton')}
						</Button>
					</div>
				</div>

				<Divider />

				<div data-slot="account-card">
					<strong>{t('profile.accountSectionTitle')}</strong>
					{isAuthenticated ? (
						<>
							<div data-slot="auth-status">
								<Icon name="user" size="xs" />
								<span>
									{t('auth.authenticatedAs')}: {session.user?.email || session.user?.displayName}
								</span>
							</div>
							<div data-slot="auth-actions">
								<Button
									variant="outline"
									size="md"
									type="button"
									onClick={handleSignOut}
									disabled={isSubmitting}
								>
									{t('profile.signOutButton')}
								</Button>
							</div>
						</>
					) : (
						<>
							<p data-slot="auth-notice">{t('profile.signInCallout')}</p>
							<div data-slot="auth-actions">
								<Button
									variant="primary"
									size="md"
									type="button"
									onClick={() => {
										setAuthMode('signIn');
										setIsAuthOpen(true);
									}}
									disabled={isSubmitting}
									leadingIcon={<Icon name="log-in" size="sm" />}
								>
									{t('auth.signIn')}
								</Button>
								<Button
									variant="outline"
									size="md"
									type="button"
									onClick={handleSignInGoogle}
									disabled={isSubmitting}
									leadingIcon={<Icon name="google" size="sm" />}
								>
									{t('auth.signInWithGoogle')}
								</Button>
							</div>
						</>
					)}
				</div>
			</S.ProfileSection>

			<AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
		</S.ProfileRoot>
	);
}
