import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';

export const PageContainer = styled.div<{ $maxWidth?: string }>`
	margin-inline: auto;
	width: 100%;
	max-width: ${(props) => props.$maxWidth || '80rem'};
	padding-inline: ${space('xl')};
`;
