import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
`;

export const TrophyBar = styled.section`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const TrophyCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	border-radius: ${radiusScale.md};
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('surface')};
	text-align: center;
	gap: 0.25rem;

	&[data-tier='gold'] {
		border-color: oklch(0.795 0.184 86.047);
		background: color-mix(in oklch, oklch(0.795 0.184 86.047) 8%, ${themeColor('surface')});
	}

	&[data-tier='silver'] {
		border-color: oklch(0.704 0.04 256.788);
		background: color-mix(in oklch, oklch(0.704 0.04 256.788) 8%, ${themeColor('surface')});
	}

	&[data-tier='bronze'] {
		border-color: oklch(0.555 0.163 48.998);
		background: color-mix(in oklch, oklch(0.555 0.163 48.998) 8%, ${themeColor('surface')});
	}

	[data-slot='count'] {
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.2;
		color: ${themeColor('text-1')};
	}

	[data-slot='label'] {
		font-size: 0.8125rem;
		font-weight: 500;
		color: ${themeColor('text-2')};
		text-transform: capitalize;
	}
`;

export const MedalsList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export const MedalItem = styled.li`
	display: flex;
	min-width: 0;

	> * {
		width: 100%;
	}
`;

export const Actions = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 1.5rem;
`;
