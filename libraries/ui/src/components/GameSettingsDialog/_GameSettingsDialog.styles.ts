import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const DialogBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
	padding: 0.25rem 0;
	box-sizing: border-box;
	color: ${themeColor('text-1')};
`;

export const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 100%;

	&:empty {
		display: none;
	}

	& + & {
		padding-top: 1.25rem;
		border-top: 1px solid ${themeColor('container-2')};
	}
`;

export const SectionHeader = styled.header`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	width: 100%;
`;

export const SectionTitle = styled.h3`
	margin: 0;
	font-size: 0.8125rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${themeColor('text-3')};
	line-height: 1.2;
`;

export const SectionContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;

	&:empty {
		display: none;
	}
`;

export const SettingRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 0.5rem 0;
	border-bottom: 1px solid ${themeColor('container-1')};

	&:last-child {
		border-bottom: none;
	}

	@media (max-width: 480px) {
		&[data-wrap='responsive'] {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
	}
`;

export const SettingInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	flex: 1;
	min-width: 0;
`;

export const SettingLabel = styled.span`
	font-size: 0.9375rem;
	font-weight: 600;
	color: ${themeColor('text-1')};
	line-height: 1.3;
`;

export const SettingDescription = styled.p`
	margin: 0;
	font-size: 0.8125rem;
	color: ${themeColor('text-2')};
	line-height: 1.4;
`;

export const SettingControl = styled.div`
	display: flex;
	align-items: center;
	flex-shrink: 0;

	@media (max-width: 480px) {
		&[data-full-width='mobile'] {
			width: 100%;
			justify-content: flex-start;
		}
	}
`;

export const HeaderGroup = styled.span`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
	text-align: left;
`;

export const PrimaryTitle = styled.span`
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.25;
	color: ${themeColor('text-1')};
`;

export const Subtitle = styled.span`
	font-size: 0.8125rem;
	font-weight: 500;
	line-height: 1.2;
	color: ${themeColor('text-2')};
`;

export const Select = styled.select`
	appearance: none;
	background-color: ${themeColor('container-1')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.md};
	padding: 0.375rem 2rem 0.375rem 0.75rem;
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 1.4;
	cursor: pointer;
	min-height: 2.25rem;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 0.5rem center;
	background-size: 1rem;

	&:hover:not(:disabled) {
		border-color: ${themeColor('text-3')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;
