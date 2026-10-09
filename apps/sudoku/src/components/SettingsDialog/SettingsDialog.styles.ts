import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const SettingsContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 0.5rem 0;
	min-width: min(calc(100vw - 4rem), 22rem);
`;

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	> h3 {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05ch;
		color: ${themeColor('text-2')};
		border-bottom: 1px solid ${themeColor('container-2')};
		padding-bottom: 0.375rem;
	}
`;

export const SettingItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	> p {
		font-size: 0.8125rem;
		color: ${themeColor('text-3')};
		line-height: 1.35;
		padding-left: 0.25rem;
	}
`;

export const SiteControlsRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.25rem 0;

	> span {
		font-size: 0.9375rem;
		font-weight: 600;
		color: ${themeColor('text-1')};
	}
`;
