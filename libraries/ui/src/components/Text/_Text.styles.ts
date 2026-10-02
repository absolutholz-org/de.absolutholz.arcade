import { styled } from '@linaria/react';
import type { TextWrapOption } from './_Text.types';

export const Text = styled.div<{
	$fontShorthand: string;
	$wrap: TextWrapOption;
}>`
	font: ${({ $fontShorthand }: { $fontShorthand: string }) => $fontShorthand};

	${({ $wrap }: { $wrap: TextWrapOption }) => {
		if ($wrap === 'truncate') {
			return `
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			`;
		}
		return `text-wrap: ${$wrap === 'normal' ? 'wrap' : $wrap};`;
	}}
`;
