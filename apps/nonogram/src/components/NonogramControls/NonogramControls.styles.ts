import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsRoot = styled.nav`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
	max-width: 40rem;
	margin: 0.75rem auto 0;
	padding: 0.25rem 0.5rem;
	flex-wrap: wrap;
`;

export const ModeToggleGroup = styled.div`
	display: inline-flex;
	align-items: center;
	background: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-full, 9999px);
	padding: 0.25rem;
	gap: 0.25rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const ActionGroup = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
`;
