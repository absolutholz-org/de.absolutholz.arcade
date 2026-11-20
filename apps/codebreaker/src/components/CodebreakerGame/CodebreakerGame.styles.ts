import { styled } from '@linaria/react';

export const PlayfieldStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	padding: 0.25rem 0;
`;

export const HintBannerWrapper = styled.div`
	width: 100%;
	max-width: 28rem;
`;

export const LiveRegion = styled.output`
	position: absolute;
	width: 0.0625rem;
	height: 0.0625rem;
	padding: 0;
	margin: -0.0625rem;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`;
