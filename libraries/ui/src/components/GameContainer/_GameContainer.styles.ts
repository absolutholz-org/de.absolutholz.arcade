import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';
import { GAME_CONTAINER_HEADER_Z_INDEX } from './_GameContainer.constants';

export const GameContainerRoot = styled.main`
	position: relative;
	width: 100%;
	width: 100vw;
	height: 100vh;
	height: 100dvh;
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	overflow: hidden;
`;

export const HeaderZone = styled.div`
	position: relative;
	z-index: ${GAME_CONTAINER_HEADER_Z_INDEX};
	width: 100%;
	flex-shrink: 0;
`;

export const PlayArea = styled.div`
	position: relative;
	width: 100%;
	flex: 1 1 0%;
	min-height: 0;
	min-width: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;
