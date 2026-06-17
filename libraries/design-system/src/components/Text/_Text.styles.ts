import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { TextWrapOption } from './_Text.types';

export const Text = styled.div<{
	$fontShorthand: string;
	$wrap: TextWrapOption;
}>`
	font: ${({ $fontShorthand }) => $fontShorthand};

	${({ $wrap }) => {
		if ($wrap === 'truncate') {
			return css`
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			`;
		}
		return `text-wrap: ${$wrap === 'normal' ? 'wrap' : $wrap};`;
	}}
`;
