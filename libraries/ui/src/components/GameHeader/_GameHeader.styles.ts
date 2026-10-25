import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const GameHeader = styled.header`
	width: 100%;
	border-bottom: 1px solid var(--color-container-2);
	background-color: var(--color-surface, var(--color-bg));
	container-type: inline-size;

	.game-header-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		width: 100%;
		min-height: 3.5rem;
		padding-block: ${space('xs')};
	}

	.game-header-left {
		justify-self: start;
		display: flex;
		align-items: center;
	}

	.game-header-center {
		justify-self: center;
		min-width: 0;
		overflow: hidden;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: ${space('2xs')};
	}

	.game-header-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: ${space('xs')};
	}

	.game-header-btn {
		min-width: 2.25rem;
		min-height: 2.25rem;
	}
`;
