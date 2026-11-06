import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Fieldset = styled.fieldset`
	border: 0;
	display: flex;
	flex-direction: column;
	gap: ${space('sm')};
	hyphens: auto;
	margin: 0;
	min-width: 0;
	padding: 0;
	width: 100%;
`;

export const Legend = styled.legend`
	color: ${themeColor('text-1')};
	float: left;
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.3;
	padding: 0;
	width: 100%;

	&[data-visually-hidden='true'] {
		border: 0;
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	& + * {
		clear: both;
	}
`;

export const Description = styled.p`
	color: ${themeColor('text-2')};
	font-size: 0.9375rem;
	margin: 0;
`;

export const Options = styled.div`
	gap: ${space('xs')};
	width: 100%;

	&[data-layout='row'] {
		display: flex;
		flex-wrap: wrap;
	}

	&[data-layout='swatch'] {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 8.125rem), 1fr));
	}
`;

export const Radio = styled.input`
	border: 0;
	clip-path: inset(50%);
	height: 1px;
	margin: 0;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;

export const CheckIndicator = styled.span`
	align-items: center;
	color: ${themeColor('accent')};
	display: inline-flex;
	flex-shrink: 0;
	justify-content: center;
	opacity: 0;
	transform: scale(0.8);
	transition: opacity 150ms ease, transform 150ms ease;
`;

export const Content = styled.span`
	align-items: center;
	display: flex;
	flex: 1 1 auto;
	font-size: 0.9375rem;
	font-weight: 600;
	gap: ${space('2xs')};
	line-height: 1.3;
	overflow-wrap: anywhere;
`;

export const Header = styled.span`
	align-items: center;
	display: flex;
	gap: ${space('xs')};
	justify-content: space-between;
	width: 100%;
`;

export const Card = styled.label`
	background-color: ${themeColor('container-1')};
	border: 1px solid var(--color-container-2);
	border-radius: ${radiusScale.md};
	color: ${themeColor('text-1')};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${space('xs')};
	min-height: 44px;
	padding: ${space('xs')} ${space('sm')};
	position: relative;
	transition: border-color 150ms ease, box-shadow 150ms ease;

	[data-layout='row'] > & {
		flex: 1 1 auto;
		min-width: max-content;
	}

	[data-layout='swatch'] > & {
		padding: ${space('sm')};
	}

	&:hover {
		border-color: ${themeColor('accent')};
	}

	${focusVisibleRing}

	&:has(input:focus-visible) {
		outline-color: ${themeColor('accent')};
	}

	&:has(input:checked) {
		border-color: ${themeColor('accent')};
		box-shadow: 0 0 0 1px ${themeColor('accent')};
	}

	&:has(input:checked) ${CheckIndicator} {
		opacity: 1;
		transform: scale(1);
	}
`;
