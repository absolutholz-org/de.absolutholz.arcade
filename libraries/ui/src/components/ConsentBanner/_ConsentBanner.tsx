import { loadConsentPreferences, saveConsentPreferences, subscribeToConsent } from '@arcade/lib-consent';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
import { ConsentDialog } from '../ConsentDialog';
import * as S from './_ConsentBanner.styles';
import type { ConsentBannerProps } from './_ConsentBanner.types';

export function ConsentBanner({ id = 'consent-banner', className, onOpenSettings }: ConsentBannerProps) {
	const { t } = useI18n();
	const [isVisible, setIsVisible] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		const prefs = loadConsentPreferences();
		// Show banner only if user hasn't explicitly set preferences yet
		if (prefs.updatedAt === 0) {
			setIsVisible(true);
		}

		return subscribeToConsent((detail) => {
			if (detail.preferences.updatedAt > 0) {
				setIsVisible(false);
			}
		});
	}, []);

	const handleOpenCustomize = () => {
		if (onOpenSettings) {
			onOpenSettings();
		} else {
			setIsDialogOpen(true);
		}
	};

	const handleAcceptEssential = () => {
		saveConsentPreferences({
			essentialStorage: true,
			cloudSync: false,
			publicBroadcast: false,
			analytics: false,
		});
		setIsVisible(false);
	};

	if (!isVisible) {
		return isDialogOpen ? <ConsentDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} /> : null;
	}

	return (
		<>
			<S.ConsentBannerRoot id={id} className={className} aria-label={t('consent.banner.title')}>
				<S.ConsentBannerContent>
					<S.ConsentBannerTitle>{t('consent.banner.title')}</S.ConsentBannerTitle>
					<S.ConsentBannerDescription>{t('consent.banner.description')}</S.ConsentBannerDescription>
				</S.ConsentBannerContent>
				<S.ConsentBannerActions>
					<Button variant="primary" size="sm" onClick={handleAcceptEssential}>
						{t('consent.banner.acceptEssential')}
					</Button>
					<Button variant="secondary" size="sm" onClick={handleOpenCustomize}>
						{t('consent.banner.customize')}
					</Button>
				</S.ConsentBannerActions>
			</S.ConsentBannerRoot>
			{isDialogOpen && <ConsentDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />}
		</>
	);
}
