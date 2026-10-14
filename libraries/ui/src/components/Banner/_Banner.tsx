import { Icon } from '../Icon';
import type { IconName } from '../Icon/_Icon.types';
import * as S from './_Banner.styles';
import type { BannerVariant, IBanner } from './_Banner.types';

const VARIANT_ICONS: Record<BannerVariant, IconName> = {
	danger: 'alert-circle',
	info: 'info',
	success: 'check',
	warning: 'alert-circle',
};

/**
 * Banner component for communicating operational status, alerts, warnings, and confirmations.
 */
export function Banner({ action, message, statusLabel, variant = 'info' }: IBanner) {
	const iconName = VARIANT_ICONS[variant];

	return (
		<S.Banner_Root>
			<S.Banner_Container
				data-variant={variant}
				role={variant === 'danger' ? 'alert' : 'status'}
				aria-live={variant === 'danger' ? 'assertive' : 'polite'}
				aria-atomic="true"
			>
				<S.Banner_Content>
					<S.Banner_Status>
						<Icon name={iconName} size="sm" />
						<S.Banner_StatusLabel>{statusLabel}</S.Banner_StatusLabel>
					</S.Banner_Status>
					<S.Banner_Message>{message}</S.Banner_Message>
				</S.Banner_Content>
				{action && <S.Banner_Actions>{action}</S.Banner_Actions>}
			</S.Banner_Container>
		</S.Banner_Root>
	);
}
