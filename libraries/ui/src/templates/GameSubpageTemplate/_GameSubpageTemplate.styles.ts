import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('xl')};
	padding-block: ${space('xl')} ${space('3xl')};
`;

export const Hero = styled.header`
	display: flex;
	flex-direction: column;
	gap: ${space('xs')};
`;

export const Title = styled.h1`
	color: var(--color-text-primary);
	font-size: 2.25rem;
	font-weight: 800;
	line-height: 1.2;
	margin: 0;
`;

export const Subtitle = styled.p`
	color: var(--color-text-secondary);
	font-size: 1.125rem;
	line-height: 1.5;
	margin: 0;
`;

export const ActionArea = styled.div`
	align-items: center;
	border-top: 1px solid var(--color-container-2);
	display: flex;
	flex-wrap: wrap;
	gap: ${space('md')};
	justify-content: center;
	margin-top: ${space('2xl')};
	padding-top: ${space('2xl')};
`;
