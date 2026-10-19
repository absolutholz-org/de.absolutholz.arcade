import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Card = styled.article`
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	padding: 1.25rem;
	border-radius: ${radiusScale.md};
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('surface')};
	position: relative;
	transition: border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;

	&[data-status='locked'] {
		opacity: 0.7;

		&:hover {
			opacity: 0.9;
			transform: translateY(-2px);
		}
	}

	&[data-status='unlocked'] {
		opacity: 1;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		&:hover {
			transform: translateY(-2px);
		}

		&[data-tier='gold'] {
			border-color: #f59e0b;
			background: color-mix(in srgb, #f59e0b 6%, ${themeColor('surface')});
		}

		&[data-tier='silver'] {
			border-color: #94a3b8;
			background: color-mix(in srgb, #94a3b8 6%, ${themeColor('surface')});
		}

		&[data-tier='bronze'] {
			border-color: #cd7f32;
			background: color-mix(in srgb, #cd7f32 6%, ${themeColor('surface')});
		}
	}
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

export const BadgeSlot = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	min-width: 3rem;
	min-height: 3rem;
`;

export const Meta = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
	gap: 0.125rem;
`;

export const TagRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	flex-wrap: wrap;
`;

export const GameBadge = styled.span`
	font-size: 0.6875rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${themeColor('accent')};
`;

export const TierBadge = styled.span`
	font-size: 0.6875rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${themeColor('text-2')};

	&[data-tier='gold'] {
		color: #d97706;
	}

	&[data-tier='silver'] {
		color: #64748b;
	}

	&[data-tier='bronze'] {
		color: #b45309;
	}
`;

export const Title = styled.h3`
	font-size: 1.0625rem;
	font-weight: 700;
	line-height: 1.3;
	margin: 0;
	color: ${themeColor('text-1')};
`;

export const Description = styled.p`
	font-size: 0.875rem;
	line-height: 1.45;
	color: ${themeColor('text-2')};
	margin: 0;
	flex-grow: 1;
`;

export const Footer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	padding-top: 0.75rem;
	border-top: 1px solid ${themeColor('container-2')};
	margin-top: auto;
`;

export const UnlockedDate = styled.span`
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-success, #16a34a);
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
`;

export const ProgressContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	width: 100%;
`;

export const ProgressBarTrack = styled.div`
	width: 100%;
	height: 0.5rem;
	border-radius: 9999px;
	background: ${themeColor('container-2')};
	overflow: hidden;
`;

export const ProgressBarFill = styled.div`
	height: 100%;
	border-radius: 9999px;
	background: ${themeColor('accent')};
	transition: width 300ms ease;
`;

export const MultiStepTrack = styled.div`
	display: flex;
	gap: 0.375rem;
	width: 100%;
`;

export const StepSegment = styled.div`
	flex: 1;
	height: 0.5rem;
	border-radius: 9999px;
	background: ${themeColor('container-2')};
	overflow: hidden;
	position: relative;
`;

export const StepSegmentFill = styled.div`
	height: 100%;
	border-radius: 9999px;
	transition: width 300ms ease;

	&[data-tier='bronze'] {
		background: #cd7f32;
	}

	&[data-tier='silver'] {
		background: #94a3b8;
	}

	&[data-tier='gold'] {
		background: #f59e0b;
	}
`;

export const ProgressLabel = styled.span`
	font-size: 0.75rem;
	font-weight: 500;
	color: ${themeColor('text-2')};
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
