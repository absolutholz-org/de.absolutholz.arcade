import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const EmojiAvatar = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: ${radiusScale.pill};
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	line-height: 1;
	user-select: none;
	flex-shrink: 0;

	&[data-size='sm'] {
		width: 1.75rem;
		height: 1.75rem;
		font-size: 1rem;
	}

	&[data-size='md'] {
		width: 2.25rem;
		height: 2.25rem;
		font-size: 1.25rem;
	}

	&[data-size='lg'] {
		width: 3rem;
		height: 3rem;
		font-size: 1.75rem;
	}

	&[data-size='xl'] {
		width: 4rem;
		height: 4rem;
		font-size: 2.375rem;
	}
`;
