import styled from '@emotion/styled';

export const Text = styled.span<{ $fontShorthand: string }>`
	font: ${(props) => props.$fontShorthand};
`;
