import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { ConsentBanner } from '../../components/ConsentBanner';
import { SkipLink } from '../../components/SkipLink';
import { Toast } from '../../components/Toast';
import * as S from './_BaseLayout.styles';
import type { BaseLayoutProps } from './_BaseLayout.types';

/**
 * Foundational Tier 1 root layout shell component.
 * Provides skip navigation targeting the main content area,
 * toast notifications, and consent banner alongside an unconstrained content slot.
 */
export function BaseLayout({ children }: BaseLayoutProps) {
	const { t } = useI18n('common');

	return (
		<S.Root>
			<SkipLink href="#main-content">{t('navigation.skipToContent')}</SkipLink>
			{children}
			<Toast />
			<ConsentBanner />
		</S.Root>
	);
}
