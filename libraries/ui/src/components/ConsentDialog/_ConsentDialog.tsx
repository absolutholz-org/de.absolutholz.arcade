import {
	type ConsentPreferences,
	type TransitionWarning,
	evaluateTransitionWarning,
	loadConsentPreferences,
	resolveUserDataTier,
	saveConsentPreferences,
} from '@arcade/lib-consent';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Divider } from '../Divider';
import { Switch } from '../Switch';
import { Text } from '../Text';
import * as S from './_ConsentDialog.styles';
import type { ConsentDialogProps } from './_ConsentDialog.types';

export function ConsentDialog({ id = 'consent-dialog', isOpen, onClose, isAuthenticated = false }: ConsentDialogProps) {
	const { t } = useI18n();
	const [prefs, setPrefs] = useState<ConsentPreferences>(loadConsentPreferences);
	const [pendingUpdates, setPendingUpdates] = useState<Partial<ConsentPreferences>>({});
	const [activeWarning, setActiveWarning] = useState<TransitionWarning | null>(null);

	useEffect(() => {
		if (isOpen) {
			const loaded = loadConsentPreferences();
			setPrefs(loaded);
			setPendingUpdates(loaded);
			setActiveWarning(null);
		}
	}, [isOpen]);

	const currentTier = resolveUserDataTier(isAuthenticated, prefs);
	const targetCloudSync = pendingUpdates.cloudSync ?? prefs.cloudSync;
	const targetPublicBroadcast = targetCloudSync ? (pendingUpdates.publicBroadcast ?? prefs.publicBroadcast) : false;

	const simulatedTier = resolveUserDataTier(isAuthenticated, {
		...prefs,
		cloudSync: targetCloudSync,
		publicBroadcast: targetPublicBroadcast,
	});

	const tierLabels: Record<number, string> = {
		1: t('consent.tiers.tier1'),
		2: t('consent.tiers.tier2'),
		3: t('consent.tiers.tier3'),
		4: t('consent.tiers.tier4'),
	};

	const handleCloudSyncToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextSync = e.target.checked;
		const nextPublic = nextSync ? (pendingUpdates.publicBroadcast ?? prefs.publicBroadcast) : false;

		const nextTier = resolveUserDataTier(isAuthenticated, {
			...prefs,
			cloudSync: nextSync,
			publicBroadcast: nextPublic,
		});

		const warning = evaluateTransitionWarning(currentTier, nextTier);
		if (warning.requiresConfirmation) {
			setActiveWarning(warning);
		} else {
			setActiveWarning(null);
		}

		setPendingUpdates((prev) => ({
			...prev,
			cloudSync: nextSync,
			publicBroadcast: nextPublic,
		}));
	};

	const handlePublicBroadcastToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nextTier = resolveUserDataTier(isAuthenticated, {
			...prefs,
			cloudSync: targetCloudSync,
			publicBroadcast: e.target.checked,
		});

		const warning = evaluateTransitionWarning(currentTier, nextTier);
		if (warning.requiresConfirmation) {
			setActiveWarning(warning);
		} else {
			setActiveWarning(null);
		}

		setPendingUpdates((prev) => ({
			...prev,
			publicBroadcast: e.target.checked,
		}));
	};

	const handleAnalyticsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPendingUpdates((prev) => ({
			...prev,
			analytics: e.target.checked,
		}));
	};

	const handleSave = () => {
		const updated = saveConsentPreferences(pendingUpdates, isAuthenticated);
		setPrefs(updated);
		onClose();
	};

	const handleCancelWarning = () => {
		setActiveWarning(null);
		setPendingUpdates(prefs);
	};

	return (
		<Dialog id={id} isOpen={isOpen} onCancel={onClose} title={t('consent.modal.title')}>
			<S.DialogBody>
				<Text variant="small" as="p">
					{t('consent.modal.description')}
				</Text>

				<S.TierBadgeContainer>
					<span>{t('consent.modal.currentTierLabel')}</span>
					<S.TierBadge>{tierLabels[simulatedTier] ?? tierLabels[currentTier]}</S.TierBadge>
				</S.TierBadgeContainer>

				{activeWarning && (
					<S.WarningBox role="alert">
						<strong>{t('consent.warnings.title')}</strong>
						<span>
							{activeWarning.action === 'retain_cloud_stop_broadcast'
								? t('consent.warnings.stopPublicBroadcast')
								: t('consent.warnings.deleteCloudRetainLocal')}
						</span>
						<S.WarningActions>
							<Button variant="secondary" size="sm" onClick={handleCancelWarning}>
								{t('consent.warnings.cancelButton')}
							</Button>
							<Button variant="primary" size="sm" onClick={handleSave}>
								{t('consent.warnings.confirmButton')}
							</Button>
						</S.WarningActions>
					</S.WarningBox>
				)}

				<S.PreferenceCard>
					<S.CardHeader>
						<S.CardTitle>{t('consent.modal.essentialTitle')}</S.CardTitle>
						<S.CardBadge>{t('consent.modal.essentialBadge')}</S.CardBadge>
					</S.CardHeader>
					<S.CardDescription>{t('consent.modal.essentialDescription')}</S.CardDescription>
				</S.PreferenceCard>

				<S.PreferenceCard>
					<S.CardHeader>
						<S.CardTitle>{t('consent.modal.cloudSyncTitle')}</S.CardTitle>
						<Switch
							checked={targetCloudSync}
							onChange={handleCloudSyncToggle}
							disabled={!isAuthenticated}
							aria-label={t('consent.modal.cloudSyncTitle')}
						/>
					</S.CardHeader>
					<S.CardDescription>{t('consent.modal.cloudSyncDescription')}</S.CardDescription>
				</S.PreferenceCard>

				<S.PreferenceCard>
					<S.CardHeader>
						<S.CardTitle>{t('consent.modal.publicBroadcastTitle')}</S.CardTitle>
						<Switch
							checked={targetPublicBroadcast}
							onChange={handlePublicBroadcastToggle}
							disabled={!targetCloudSync}
							aria-label={t('consent.modal.publicBroadcastTitle')}
						/>
					</S.CardHeader>
					<S.CardDescription>{t('consent.modal.publicBroadcastDescription')}</S.CardDescription>
				</S.PreferenceCard>

				<S.PreferenceCard>
					<S.CardHeader>
						<S.CardTitle>{t('consent.modal.analyticsTitle')}</S.CardTitle>
						<Switch
							checked={pendingUpdates.analytics ?? prefs.analytics}
							onChange={handleAnalyticsToggle}
							aria-label={t('consent.modal.analyticsTitle')}
						/>
					</S.CardHeader>
					<S.CardDescription>{t('consent.modal.analyticsDescription')}</S.CardDescription>
				</S.PreferenceCard>

				<Divider />

				{!activeWarning && (
					<Button variant="primary" size="md" onClick={handleSave}>
						{t('consent.modal.savePreferences')}
					</Button>
				)}
			</S.DialogBody>
		</Dialog>
	);
}
