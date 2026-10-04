import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { PAGE_CONTAINER_VARIANTS } from './_PageContainer.constants';
import type { PageContainerVariant } from './_PageContainer.types';

export const PageContainer = styled.div<{ $variant: PageContainerVariant }>`
	--page-content-max-width: ${({ $variant }) => PAGE_CONTAINER_VARIANTS[$variant]};
	--page-content-padding: ${space('xl')};

	container-type: inline-size;
	margin-inline: auto;
	max-width: var(--page-content-max-width);
	padding-inline: var(--page-content-padding);
	width: 100%;
`;
