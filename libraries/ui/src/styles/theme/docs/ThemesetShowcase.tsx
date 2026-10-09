import type React from 'react';
import { Text } from '../../../components/Text';
import { Theme } from '../../../components/Theme';
import { themesetBaseProps } from '../themeset-base.css';
import { themesetBuckeyePrideProps } from '../themeset-buckeye-pride.css';
import { themesetChristmasProps } from '../themeset-christmas.css';
import { themesetClevelandGridironProps } from '../themeset-cleveland-gridiron.css';
import { themesetEasterProps } from '../themeset-easter.css';
import { themesetFastFoodFunProps } from '../themeset-fast-food-fun.css';
import { themesetGermanyProps } from '../themeset-germany.css';
import { themesetHalloweenProps } from '../themeset-halloween.css';
import { themesetJuly4thProps } from '../themeset-july4th.css';
import { themesetStPatricksProps } from '../themeset-stpatricks.css';
import * as styles from './ThemesetShowcase.css';

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
	'fast-food-fun': {
		props: themesetFastFoodFunProps,
		title: 'Fast Food Fun Themeset',
		desc: 'Golden arches yellow accents paired with restaurant brand red outlines.',
	},
	july4th: {
		props: themesetJuly4thProps,
		title: '4th of July Themeset',
		desc: 'Patriotic red, white, and blue theme representing American heritage.',
	},
	stpatricks: {
		props: themesetStPatricksProps,
		title: "St. Patrick's Day Themeset",
		desc: 'Lucky shamrock green paired with festive gold/orange outlines.',
	},
	'cleveland-gridiron': {
		props: themesetClevelandGridironProps,
		title: 'Cleveland Gridiron Themeset',
		desc: 'Classic football colors featuring bold orange and rich brown canvas tones.',
	},
	'buckeye-pride': {
		props: themesetBuckeyePrideProps,
		title: 'Buckeye Pride Themeset',
		desc: 'Buckeye team colors featuring scarlet red accents and athletics gray canvas highlights.',
	},
	germany: {
		props: themesetGermanyProps,
		title: 'Germany Themeset',
		desc: 'German national flag colors: gold, red, and deep charcoal black.',
	},
	halloween: {
		props: themesetHalloweenProps,
		title: 'Halloween Themeset',
		desc: 'Spooky pumpkin orange accents paired with witch purple and eerie dark canvas tones.',
	},
};

interface ThemesetShowcaseProps {
	themeset: keyof typeof themesetsData;
}

const THEME_NAMES = ['primary', 'secondary', 'contrast', 'accent'] as const;

const COLOR_SLOTS = [
	{ name: 'surface', variable: '--color-surface' },
	{ name: 'container-1', variable: '--color-container-1' },
	{ name: 'container-2', variable: '--color-container-2' },
	{ name: 'accent', variable: '--color-accent' },
	{ name: 'accent-contrast', variable: '--color-accent-contrast' },
	{ name: 'accent-secondary', variable: '--color-accent-secondary' },
	{
		name: 'accent-secondary-contrast',
		variable: '--color-accent-secondary-contrast',
	},
	{ name: 'text-1', variable: '--color-text-1' },
	{ name: 'text-2', variable: '--color-text-2' },
	{ name: 'text-3', variable: '--color-text-3' },
] as const;

const SCHEMES = [
	{ scheme: 'light', label: '☀️ Light Variant' },
	{ scheme: 'dark', label: '🌙 Dark Variant' },
] as const;

// Parses light-dark() CSS strings to inspect the individual values for showcase previews
function parseLightDark(value = '') {
	if (value.startsWith('light-dark(') && value.endsWith(')')) {
		const content = value.slice(11, -1);
		let parenthesisDepth = 0;
		let commaIndex = -1;

		for (let index = 0; index < content.length; index++) {
			if (content[index] === '(') {
				parenthesisDepth++;
			} else if (content[index] === ')') {
				parenthesisDepth--;
			} else if (content[index] === ',' && parenthesisDepth === 0) {
				commaIndex = index;
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
	const activeThemeset = themesetsData[themeset];
	if (!activeThemeset) {
		return <div>Themeset "{themeset}" not found.</div>;
	}

	return (
		<div className={styles.showcaseContainer} style={activeThemeset.props as React.CSSProperties}>
			<div className={styles.descriptionBlock}>
				<Text variant="base" as="div">
					<strong>{activeThemeset.title}</strong>: {activeThemeset.desc}
				</Text>
			</div>

			<div className={styles.sideBySide}>
				{SCHEMES.map(({ scheme, label }) => (
					<div key={scheme} className={styles.schemeWrapper[scheme]}>
						<div className={styles.schemeTitle}>
							<Text variant="h3" as="h3">
								{label}
							</Text>
						</div>

						{THEME_NAMES.map((themeName) => (
							<div key={`${scheme}-${themeName}`} className={styles.themeSection}>
								<div className={styles.themeTitleLabel}>
									<Text variant="small" as="h4">
										{themeName} theme
									</Text>
								</div>
								<Theme name={themeName}>
									<div className={styles.themeBlockGrid}>
										<div className={styles.demoCard}>
											<div className={styles.cardTop}>
												<span className={styles.cardBadge}>{themeName}</span>
												<div className={styles.activeStatusLabel}>
													<Text variant="small" as="span">
														Active
													</Text>
												</div>
											</div>
											<div className={styles.cardTitleWrapper}>
												<Text variant="base" as="div">
													Design Aesthetics
												</Text>
											</div>
											<div className={styles.cardBodyWrapper}>
												<Text variant="small" as="div">
													Dynamic previews built using contextual variables.
												</Text>
											</div>
											<div className={styles.cardFooter}>
												<div className={styles.footerTextWrapper}>
													<Text variant="small" as="span">
														Tier 2 Context
													</Text>
												</div>
												<div className={styles.footerActionWrapper}>
													<Text variant="small" as="span">
														Select
													</Text>
												</div>
											</div>
										</div>

										<div className={styles.swatchList}>
											{COLOR_SLOTS.map((slot) => {
												const tokenPropertyKey = `--theme-${themeName}-${slot.name}`;
												const rawValue =
													(activeThemeset.props as Record<string, string>)[
														tokenPropertyKey
													] || '';
												const parsed = parseLightDark(rawValue);
												const displayValue = scheme === 'light' ? parsed.light : parsed.dark;

												return (
													<div
														key={`${scheme}-${themeName}-${slot.name}`}
														className={styles.swatchItem}
													>
														<div
															className={styles.colorPreview}
															style={{
																backgroundColor: `var(${slot.variable})`,
															}}
														/>
														<div className={styles.tokenDetails}>
															<div className={styles.tokenLabelWrapper}>
																<Text variant="small" as="div">
																	{slot.name}
																</Text>
															</div>
															<div
																className={styles.tokenValueString}
																title={displayValue}
															>
																{displayValue}
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</Theme>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
