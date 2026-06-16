import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';
import { PAGE_CONTAINER_VARIANTS } from './_PageContainer.constants';
import type { PageContainerVariant } from './_PageContainer.types';

export const PageContainer = styled.div<{ $variant: PageContainerVariant }>`
	margin-inline: auto;
	width: 100%;
	max-width: ${({ $variant }) => PAGE_CONTAINER_VARIANTS[$variant]};
	padding-inline: ${space('xl')};
`;
