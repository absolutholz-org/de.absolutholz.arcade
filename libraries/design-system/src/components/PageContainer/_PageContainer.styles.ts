import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';
import { PAGE_MAX_WIDTH } from '../../styles/constants';

export const PageContainer = styled.div<{ $maxWidth?: string }>`
	margin-inline: auto;
	width: 100%;
	max-width: ${(props) => props.$maxWidth || PAGE_MAX_WIDTH};
	padding-inline: ${space('xl')};
`;
