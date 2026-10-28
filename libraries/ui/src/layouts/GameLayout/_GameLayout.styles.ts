import { styled } from '@linaria/react';
import {
	PAGE_MAX_WIDTH,
	PAGE_MAX_WIDTH_EXTRA_WIDE,
	PAGE_MAX_WIDTH_SLIM,
	PAGE_MAX_WIDTH_WIDE,
} from '../../styles/constants';

export const Shell = styled.div`
	width: 100%;
	min-height: 100dvh;
	--game-container-max-width: ${PAGE_MAX_WIDTH_WIDE};

	&[data-container-width='standard'] {
		--game-container-max-width: ${PAGE_MAX_WIDTH_WIDE};
	}

	&[data-container-width='wide'] {
		--game-container-max-width: ${PAGE_MAX_WIDTH};
	}

	&[data-container-width='extraWide'] {
		--game-container-max-width: ${PAGE_MAX_WIDTH_EXTRA_WIDE};
	}

	&[data-container-width='slim'] {
		--game-container-max-width: ${PAGE_MAX_WIDTH_SLIM};
	}

	&[data-container-width='full'] {
		--game-container-max-width: none;
	}
`;

export const HeaderZone = styled.div`
	width: 100%;
`;

export const StatusZone = styled.div`
	width: 100%;
	margin-bottom: var(--space-xs);
`;

export const Main = styled.main`
	width: 100%;
	margin-inline: auto;
	padding-top: var(--space-xs);
	padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`;

export const ToolbarZone = styled.div`
	width: 100%;
	margin-top: var(--space-md);
	margin-inline: auto;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const FooterZone = styled.div`
	width: 100%;
	max-width: var(--game-container-max-width, none);
	margin-inline: auto;
	margin-top: var(--space-md);
`;
