import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const HeaderRoot = styled.header`
	position: sticky;
	top: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 0.5rem 1rem;
	background: ${themeColor('surface')};
	border-bottom: 1px solid ${themeColor('container-2')};
	gap: 0.5rem;
`;

export const CenterSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

export const MetaBadge = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.25rem 0.625rem;
	font-size: 0.8125rem;
	font-weight: 600;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-full, 9999px);
	color: ${themeColor('text-1')};

	@media (max-width: 480px) {
		display: none;
	}
`;

export const MoveCounter = styled.div`
	font-size: 0.8125rem;
	font-weight: 600;
	font-variant-numeric: tabular-nums;
	color: ${themeColor('text-2')};
	padding: 0.25rem 0.5rem;
`;
