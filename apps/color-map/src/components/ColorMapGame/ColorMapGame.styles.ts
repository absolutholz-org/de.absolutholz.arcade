import { styled } from '@linaria/react';

export const PlayfieldStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
	min-height: 0;
	flex: 1 1 auto;

	@media (min-width: 640px) {
		gap: 1rem;
	}
`;

export const PaletteWrapper = styled.div`
	width: 100%;
	max-width: 34rem;
	margin-inline: auto;
	flex-shrink: 0;
`;

export const LiveRegion = styled.output`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip-path: inset(50%);
	white-space: nowrap;
	border: 0;
`;
