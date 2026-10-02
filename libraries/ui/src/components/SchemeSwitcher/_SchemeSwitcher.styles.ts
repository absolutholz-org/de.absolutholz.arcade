import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';
import type { SchemeOrientation } from './_SchemeSwitcher.types';

export const SchemeSwitcher = styled.fieldset<{
	$orientation: SchemeOrientation;
}>`
	border: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: ${({ $orientation }: { $orientation: SchemeOrientation }) =>
		$orientation === 'vertical' ? 'column' : 'row'};
	align-items: ${({ $orientation }: { $orientation: SchemeOrientation }) =>
		$orientation === 'vertical' ? 'flex-start' : 'center'};
	gap: ${({ $orientation }: { $orientation: SchemeOrientation }) =>
		$orientation === 'vertical' ? '0.5rem' : '1rem'};
	flex-wrap: wrap;
`;

export const Legend = styled.legend<{
	$visuallyHidden: boolean;
}>`
	${({ $visuallyHidden }: { $visuallyHidden: boolean }) =>
		$visuallyHidden
			? `
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	`
			: `
		margin-bottom: 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: ${themeColor('text-1')};
	`}
`;

export const Label = styled.label`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	min-height: 24px;
	min-width: 24px;
	cursor: pointer;
	color: ${themeColor('text-1')};
	font-size: 0.875rem;
	line-height: 1.25rem;
	user-select: none;

	&:hover {
		color: ${themeColor('text-2')};
	}
`;

export const Input = styled.input`
	width: 1rem;
	height: 1rem;
	min-width: 1rem;
	min-height: 1rem;
	margin: 0;
	accent-color: ${themeColor('accent')};
	cursor: pointer;

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;

export const OptionText = styled.span`
	display: inline-block;
`;
