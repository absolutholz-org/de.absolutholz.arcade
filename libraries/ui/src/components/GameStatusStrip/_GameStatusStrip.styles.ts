import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const GameStatusStrip = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: var(--space-lg, 1.5rem);
	padding-inline: 0;
	padding-block: 0.25rem;
	width: 100%;
	background-color: transparent;

	> .game-status-metric {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: ${themeColor('text-1')};

		&[data-state='warning'],
		&[data-state='danger'] {
			color: ${themeColor('status-danger')};
		}

		&[data-state='solved'] {
			color: ${themeColor('status-success')};
		}
	}
`;
