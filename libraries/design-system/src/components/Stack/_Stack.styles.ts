import styled from '@emotion/styled';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import type { StackAlign, StackDirection, StackJustify } from './_Stack.types';

const getGap = (spacing?: SpacingKey) => {
	if (spacing === 'none') return '0';
	return `var(--space-${spacing || 'md'})`;
};

const getAlign = (align?: StackAlign) => {
	switch (align) {
		case 'start':
			return 'flex-start';
		case 'end':
			return 'flex-end';
		default:
			return align || 'stretch';
	}
};

const getJustify = (justify?: StackJustify) => {
	switch (justify) {
		case 'start':
			return 'flex-start';
		case 'end':
			return 'flex-end';
		case 'between':
			return 'space-between';
		case 'around':
			return 'space-around';
		case 'evenly':
			return 'space-evenly';
		default:
			return justify || 'flex-start';
	}
};

export const StyledStack = styled.div<{
	$direction: StackDirection;
	$spacing: SpacingKey;
	$crossSpacing?: SpacingKey;
	$align: StackAlign;
	$justify: StackJustify;
	$wrap: boolean;
}>`
	align-items: ${({ $align }) => getAlign($align)};
	display: flex;
	flex-direction: ${({ $direction }) => $direction};
	flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
	gap: ${({ $direction, $spacing, $crossSpacing }) =>
		$direction === 'row' || $direction === 'row-reverse'
			? `${getGap($crossSpacing || $spacing)} ${getGap($spacing)}`
			: `${getGap($spacing)} ${getGap($crossSpacing || $spacing)}`};
	justify-content: ${({ $justify }) => getJustify($justify)};
	width: 100%;
`;
