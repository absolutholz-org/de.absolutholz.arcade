import { focusVisibleRing } from '@arcade/lib-ui/styles/focus.css';
import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsContainer = styled.div`
	width: 100%;
	max-width: 34rem;
	margin-top: var(--space-md);
	margin-inline: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
`;

export const ModeRow = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	max-width: 20rem;

	> div {
		width: 100%;
	}
`;
