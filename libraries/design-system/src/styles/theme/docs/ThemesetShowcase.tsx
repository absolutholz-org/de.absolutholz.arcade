import React from 'react';
import styled from '@emotion/styled';
import { Theme } from '../../../components/Theme';
import { themesetBaseProps } from '../themeset-base.css';
import { themesetChristmasProps } from '../themeset-christmas.css';
import { themesetEasterProps } from '../themeset-easter.css';
import { themesetClient2Props } from '../themeset-client2.css';

const themesetsData = {
	base: {
		props: themesetBaseProps,
		title: 'Base Themeset',
		desc: 'The baseline workspace layout, featuring clean tones and balanced accents.',
	},
	christmas: {
		props: themesetChristmasProps,
		title: 'Christmas Themeset',
		desc: 'Festive red accents with cool green panels and royal blue outlines.',
	},
	easter: {
		props: themesetEasterProps,
		title: 'Easter Themeset',
		desc: 'Soft pastel greens and pinks contrasted with deep rebeccapurple canvases.',
	},
	client2: {
		props: themesetClient2Props,
		title: 'Client 2 Themeset',
		desc: 'Professional forestry green surfaces with high-energy bronze highlights.',
	},
};

interface ThemesetShowcaseProps {
	themeset: keyof typeof themesetsData;
}

const ShowcaseContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
	font-family: 'Inter', system-ui, sans-serif;
	margin-top: 24px;
	margin-bottom: 40px;
`;

const DescriptionBlock = styled.div`
	padding: 16px 20px;
	border-radius: 12px;
	background: linear-gradient(
		135deg,
		oklch(0.97 0.01 250),
		oklch(0.95 0.02 250)
	);
	border-left: 5px solid oklch(0.6 0.18 250);
	color: oklch(0.3 0.02 250);
	font-size: 0.95rem;
	line-height: 1.5;

	/* Respect parent color-scheme if custom container */
	@media (prefers-color-scheme: dark) {
		background: linear-gradient(
			135deg,
			oklch(0.18 0.01 250),
			oklch(0.15 0.01 250)
		);
		border-left-color: oklch(0.7 0.16 250);
		color: oklch(0.9 0.01 250);
	}
`;

const SideBySide = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 32px;
	align-items: start;

	@media (min-width: 1200px) {
		grid-template-columns: 1fr 1fr;
	}
`;

const SchemeWrapper = styled.div<{ scheme: 'light' | 'dark' }>`
	color-scheme: ${(props) => props.scheme};
	background-color: var(--color-surface);
	color: var(--color-text-1);
	padding: 28px;
	border-radius: 16px;
	border: 1px solid var(--color-container-2);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
	display: flex;
	flex-direction: column;
	gap: 28px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&:hover {
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
	}
`;

const SchemeTitle = styled.h3`
	margin: 0;
	font-size: 1.3rem;
	font-weight: 700;
	letter-spacing: -0.02em;
	border-bottom: 2px solid var(--color-container-2);
	padding-bottom: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const ThemeSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const ThemeTitleLabel = styled.h4`
	margin: 0;
	font-size: 0.9rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--color-text-2);
	font-weight: 700;
`;

const ThemeBlockGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;

	@media (min-width: 640px) {
		grid-template-columns: 1fr 1.2fr;
	}
`;

// Beautiful Card Mockup using active CSS variables
const DemoCard = styled.div`
	background-color: var(--color-surface);
	color: var(--color-text-1);
	border: 1px solid var(--color-container-2);
	border-radius: 14px;
	padding: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
	display: flex;
	flex-direction: column;
	gap: 12px;
	justify-content: space-between;
	min-height: 170px;
	transition: all 0.2s ease-in-out;

	&:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
	}
`;

const CardTop = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CardBadge = styled.span`
	background-color: var(--color-accent);
	color: var(--color-surface);
	font-size: 0.7rem;
	font-weight: 700;
	padding: 4px 8px;
	border-radius: 6px;
	text-transform: uppercase;
	letter-spacing: 0.06em;
`;

const CardTitleText = styled.div`
	font-weight: 600;
	font-size: 1.05rem;
`;

const CardBodyText = styled.div`
	font-size: 0.85rem;
	color: var(--color-text-2);
	line-height: 1.4;
`;

const CardFooter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid var(--color-container-2);
	padding-top: 10px;
	margin-top: 4px;
`;

const FooterText = styled.span`
	font-size: 0.75rem;
	color: var(--color-text-3);
`;

const FooterAction = styled.span`
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--color-accent);
	cursor: pointer;
`;

// Swatch Table
const SwatchList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const SwatchItem = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 10px;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	border-radius: 8px;
	font-size: 0.78rem;
`;

const ColorPreview = styled.div<{ bgVar: string }>`
	width: 24px;
	height: 24px;
	border-radius: 6px;
	border: 1px solid var(--color-container-2);
	background-color: ${(props) => props.bgVar};
	flex-shrink: 0;
`;

const TokenDetails = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex-grow: 1;
`;

const TokenLabel = styled.div`
	font-weight: 600;
	color: var(--color-text-1);
	font-size: 0.75rem;
`;

const TokenValueString = styled.div`
	color: var(--color-text-3);
	font-size: 0.7rem;
	font-family: monospace;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`;

// Simple parser for light-dark() CSS strings to show exact values
function parseLightDark(value: string = '') {
	if (value.startsWith('light-dark(') && value.endsWith(')')) {
		const content = value.slice(11, -1);
		let depth = 0;
		let commaIndex = -1;
		for (let i = 0; i < content.length; i++) {
			if (content[i] === '(') depth++;
			else if (content[i] === ')') depth--;
			else if (content[i] === ',' && depth === 0) {
				commaIndex = i;
				break;
			}
		}
		if (commaIndex !== -1) {
			return {
				light: content.slice(0, commaIndex).trim(),
				dark: content.slice(commaIndex + 1).trim(),
			};
		}
	}
	return { light: value, dark: value };
}

export function ThemesetShowcase({ themeset }: ThemesetShowcaseProps) {
	const data = themesetsData[themeset];
	if (!data) return <div>Themeset "{themeset}" not found.</div>;

	const themes = ['primary', 'secondary', 'contrast', 'accent'] as const;
	const slots = [
		{ name: 'surface', variable: '--color-surface' },
		{ name: 'container-1', variable: '--color-container-1' },
		{ name: 'container-2', variable: '--color-container-2' },
		{ name: 'accent', variable: '--color-accent' },
		{ name: 'text-1', variable: '--color-text-1' },
		{ name: 'text-2', variable: '--color-text-2' },
		{ name: 'text-3', variable: '--color-text-3' },
	] as const;

	return (
		<ShowcaseContainer style={data.props as React.CSSProperties}>
			<DescriptionBlock>
				<strong>{data.title}</strong>: {data.desc}
			</DescriptionBlock>

			<SideBySide>
				{/* LIGHT SCHEME DISPLAY */}
				<SchemeWrapper scheme="light">
					<SchemeTitle>☀️ Light Variant</SchemeTitle>

					{themes.map((themeName) => {
						return (
							<ThemeSection key={`light-${themeName}`}>
								<ThemeTitleLabel>{themeName} theme</ThemeTitleLabel>
								<Theme name={themeName}>
									<ThemeBlockGrid>
										<DemoCard>
											<CardTop>
												<CardBadge>{themeName}</CardBadge>
												<FooterText>Active</FooterText>
											</CardTop>
											<CardTitleText>Design Aesthetics</CardTitleText>
											<CardBodyText>
												Dynamic previews built using contextual variables.
											</CardBodyText>
											<CardFooter>
												<FooterText>Tier 2 Context</FooterText>
												<FooterAction>Select</FooterAction>
											</CardFooter>
										</DemoCard>

										<SwatchList>
											{slots.map((slot) => {
												const key = `--theme-${themeName}-${slot.name}`;
												const rawValue =
													(data.props as Record<string, string>)[key] || '';
												const parsed = parseLightDark(rawValue);
												return (
													<SwatchItem key={`light-${themeName}-${slot.name}`}>
														<ColorPreview bgVar={`var(${slot.variable})`} />
														<TokenDetails>
															<TokenLabel>{slot.name}</TokenLabel>
															<TokenValueString title={parsed.light}>
																{parsed.light}
															</TokenValueString>
														</TokenDetails>
													</SwatchItem>
												);
											})}
										</SwatchList>
									</ThemeBlockGrid>
								</Theme>
							</ThemeSection>
						);
					})}
				</SchemeWrapper>

				{/* DARK SCHEME DISPLAY */}
				<SchemeWrapper scheme="dark">
					<SchemeTitle>🌙 Dark Variant</SchemeTitle>

					{themes.map((themeName) => {
						return (
							<ThemeSection key={`dark-${themeName}`}>
								<ThemeTitleLabel>{themeName} theme</ThemeTitleLabel>
								<Theme name={themeName}>
									<ThemeBlockGrid>
										<DemoCard>
											<CardTop>
												<CardBadge>{themeName}</CardBadge>
												<FooterText>Active</FooterText>
											</CardTop>
											<CardTitleText>Design Aesthetics</CardTitleText>
											<CardBodyText>
												Dynamic previews built using contextual variables.
											</CardBodyText>
											<CardFooter>
												<FooterText>Tier 2 Context</FooterText>
												<FooterAction>Select</FooterAction>
											</CardFooter>
										</DemoCard>

										<SwatchList>
											{slots.map((slot) => {
												const key = `--theme-${themeName}-${slot.name}`;
												const rawValue =
													(data.props as Record<string, string>)[key] || '';
												const parsed = parseLightDark(rawValue);
												return (
													<SwatchItem key={`dark-${themeName}-${slot.name}`}>
														<ColorPreview bgVar={`var(${slot.variable})`} />
														<TokenDetails>
															<TokenLabel>{slot.name}</TokenLabel>
															<TokenValueString title={parsed.dark}>
																{parsed.dark}
															</TokenValueString>
														</TokenDetails>
													</SwatchItem>
												);
											})}
										</SwatchList>
									</ThemeBlockGrid>
								</Theme>
							</ThemeSection>
						);
					})}
				</SchemeWrapper>
			</SideBySide>
		</ShowcaseContainer>
	);
}
