import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import { Text } from '../Text';

export const Hero_Visual = styled.div`
	display: inline-flex;
	flex-shrink: 0;
`;

export const Hero_Eyebrow = styled(Text)`
	color: ${themeColor('text-2')};
	font-weight: 700;
	letter-spacing: 0.08em;
	margin-bottom: ${space('2xs')};
	text-transform: uppercase;
`;

export const Hero_Tagline = styled(Text)`
	color: ${themeColor('text-2')};
	margin-top: ${space('2xs')};
`;

export const Hero_TagsList = styled.ul`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${space('xs')};
	list-style: none;
	margin: ${space('sm')} 0 0 0;
	padding: 0;
`;

export const Hero_TagItem = styled.li`
	display: inline-flex;
`;

export const Hero_Body = styled.div`
	flex-basis: 20rem;
	flex-grow: 1;
	min-width: 0;
`;

export const Hero = styled.header`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${space('md')} ${space('lg')};
	padding-block: ${space('4xl')} ${space('2xl')};
	text-align: left;
	width: 100%;
`;
