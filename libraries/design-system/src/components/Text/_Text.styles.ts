import styled from '@emotion/styled';
import type { TextWrapOption } from './_Text.types';

export const Text = styled.div<{
	$fontShorthand: string;
	$wrap: TextWrapOption;
}>`
	font: ${(props) => props.$fontShorthand};

	${(props) => {
		if (props.$wrap === 'truncate') {
			return `
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			`;
		}
		return `text-wrap: ${props.$wrap === 'normal' ? 'wrap' : props.$wrap};`;
	}}
`;
