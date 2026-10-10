import { styled } from '@linaria/react';
import {
	PAGE_MAX_WIDTH,
	PAGE_MAX_WIDTH_EXTRA_WIDE,
	PAGE_MAX_WIDTH_SLIM,
	PAGE_MAX_WIDTH_WIDE,
} from '../../styles/constants';
import { space } from '../../styles/spacing';

export const PageContainer = styled.div`
	--page-content-padding: ${space('xl')};

	container-type: inline-size;
	margin-inline: auto;
	padding-inline: var(--page-content-padding);
	width: 100%;

	&[data-variant='standard'] {
		max-width: ${PAGE_MAX_WIDTH};
	}

	&[data-variant='wide'] {
		max-width: ${PAGE_MAX_WIDTH_WIDE};
	}

	&[data-variant='extraWide'] {
		max-width: ${PAGE_MAX_WIDTH_EXTRA_WIDE};
	}

	&[data-variant='slim'] {
		max-width: ${PAGE_MAX_WIDTH_SLIM};
	}

	&[data-variant='full'] {
		max-width: 100%;
	}
`;
