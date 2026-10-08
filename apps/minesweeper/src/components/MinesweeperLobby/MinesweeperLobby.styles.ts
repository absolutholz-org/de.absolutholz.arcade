import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const LobbyContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	width: 100%;
	max-width: 54rem;
	margin: 0 auto;
`;

export const HeroSection = styled.div`
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		color: ${themeColor('text-1')};
		margin: 0;
	}

	p {
		font-size: 1.125rem;
		color: ${themeColor('text-2')};
		margin: 0;
	}
`;

export const ResumeCard = styled.div`
	background: ${themeColor('container-2')};
	border: 2px solid ${themeColor('accent')};
	border-radius: var(--radius-lg, 0.75rem);
	padding: 1.5rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;

	.resume-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		.resume-title {
			font-size: 1.125rem;
			font-weight: 700;
			color: ${themeColor('text-1')};
		}

		.resume-meta {
			font-size: 0.875rem;
			color: ${themeColor('text-2')};
		}
	}
`;

export const ConfigForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 2rem;
`;

export const Fieldset = styled.fieldset`
	border: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	legend {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin-bottom: 0.5rem;
	}
`;

export const OptionsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
	gap: 1rem;
`;

export const OptionCard = styled.label`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 1.25rem 0.75rem;
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-md, 0.5rem);
	cursor: pointer;
	user-select: none;
	transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

	&:hover {
		border-color: ${themeColor('accent')};
		transform: translateY(-2px);
	}

	&.selected {
		border-color: ${themeColor('accent')};
		background: ${themeColor('container-2')};
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	input[type='radio'] {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 1px;
		height: 1px;
	}

	.option-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.25rem;

		.option-title {
			font-size: 1rem;
			font-weight: 700;
			color: ${themeColor('text-1')};
		}

		.option-desc {
			font-size: 0.75rem;
			color: ${themeColor('text-2')};
		}
	}

	.check-icon {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: ${themeColor('accent')};
		color: ${themeColor('surface')};
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 0.875rem;
			height: 0.875rem;
		}
	}
`;

export const PlaySection = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 1rem;
`;

export const QuickLinks = styled.div`
	display: flex;
	justify-content: center;
	gap: 2rem;
	border-top: 1px solid ${themeColor('container-2')};
	padding-top: 2rem;

	a {
		color: ${themeColor('accent')};
		font-weight: 600;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
`;
