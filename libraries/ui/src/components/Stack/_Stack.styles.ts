import { styled } from '@linaria/react';
import type { SpacingKey } from '../../styles/spacing';
import { STACK_ALIGN_MAP, STACK_JUSTIFY_MAP } from './_Stack.constants';
import type { StackAlign, StackDirection, StackJustify } from './_Stack.types';

const getGapValue = (spacing?: SpacingKey): string => {
	if (spacing === 'none') return '0';
	return `var(--space-${spacing || 'md'})`;
};

export const Stack = styled.div<{
	$align: StackAlign;
	$crossSpacing?: SpacingKey;
	$direction: StackDirection;
	$fullWidth: boolean;
	$inline: boolean;
	$justify: StackJustify;
	$spacing: SpacingKey;
	$wrap: boolean;
}>`
	align-items: ${({ $align }) => STACK_ALIGN_MAP[$align] || $align};
	display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};
	flex-direction: ${({ $direction }) => $direction};
	flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
	gap: ${({ $crossSpacing, $direction, $spacing }) => {
		const mainGap = getGapValue($spacing);
		if (!$crossSpacing || $crossSpacing === $spacing) {
			return mainGap;
		}
		const crossGap = getGapValue($crossSpacing);
		return $direction === 'row' || $direction === 'row-reverse'
			? `${crossGap} ${mainGap}`
			: `${mainGap} ${crossGap}`;
	}};
	justify-content: ${({ $justify }) => STACK_JUSTIFY_MAP[$justify] || $justify};
	width: ${({ $fullWidth, $inline }) => ($fullWidth && !$inline ? '100%' : 'auto')};
`;
