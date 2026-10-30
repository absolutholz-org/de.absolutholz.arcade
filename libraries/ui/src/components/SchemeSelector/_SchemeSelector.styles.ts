import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('sm')};
	width: 100%;
`;

export const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('3xs')};
`;

export const Title = styled.h2`
	color: ${themeColor('text-1')};
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.3;
	margin: 0;
`;

export const Description = styled.p`
	color: ${themeColor('text-2')};
	font-size: 0.9375rem;
	margin: 0;
`;

export const Grid = styled.div`
	display: grid;
	gap: ${space('sm')};
	grid-template-columns: repeat(auto-fill, minmax(min(100%, 9rem), 1fr));
	width: 100%;
`;

export const Card = styled.button`
	background-color: ${themeColor('container-1')};
	border: 1px solid var(--color-container-2);
	border-radius: ${radiusScale.md};
	color: ${themeColor('text-1')};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${space('sm')};
	min-height: 44px;
	outline: none;
	padding: ${space('md')};
	position: relative;
	text-align: left;
	transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
	width: 100%;

	&:hover {
		border-color: ${themeColor('accent')};
		transform: translateY(-1px);
	}

	&:focus-visible {
		border-color: ${themeColor('accent')};
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&[data-selected='true'] {
		border-color: ${themeColor('accent')};
		box-shadow: 0 0 0 1px ${themeColor('accent')};
	}
`;

export const CardHeader = styled.div`
	align-items: center;
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const SchemeLabelGroup = styled.div`
	align-items: center;
	display: flex;
	gap: ${space('2xs')};
`;

export const SchemeName = styled.span`
	color: ${themeColor('text-1')};
	font-size: 0.9375rem;
	font-weight: 600;
	line-height: 1.3;
`;

export const CheckIndicator = styled.span`
	align-items: center;
	color: ${themeColor('accent')};
	display: inline-flex;
	justify-content: center;
	opacity: 0;
	transform: scale(0.8);
	transition: opacity 150ms ease, transform 150ms ease;

	&[data-active='true'] {
		opacity: 1;
		transform: scale(1);
	}
`;
