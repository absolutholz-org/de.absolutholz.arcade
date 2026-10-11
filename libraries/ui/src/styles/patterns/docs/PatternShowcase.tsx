import type React from 'react';
import { typographyCssTokensCompact } from '../../../components/Text/_Text.constants';
import { Theme } from '../../../components/Theme';
import { themesetBaseProps } from '../../theme/themeset-base.css';
import { PATTERN_KEYS, type PatternKey, patternCssTokens, patternVars } from '../patterns.constants';
import * as styles from './PatternShowcase.css';

const showcaseGlobalTokens = `
	:root {
		${typographyCssTokensCompact}
		${patternCssTokens}
	}
`;

const SAMPLE_REGION_COLORS = [
	'light-dark(oklch(0.93 0.05 25), oklch(0.24 0.05 25))',
	'light-dark(oklch(0.93 0.05 65), oklch(0.24 0.05 65))',
	'light-dark(oklch(0.94 0.05 100), oklch(0.25 0.05 100))',
	'light-dark(oklch(0.93 0.05 140), oklch(0.24 0.05 140))',
	'light-dark(oklch(0.93 0.05 175), oklch(0.24 0.05 175))',
	'light-dark(oklch(0.93 0.05 215), oklch(0.24 0.05 215))',
	'light-dark(oklch(0.93 0.05 255), oklch(0.24 0.05 255))',
	'light-dark(oklch(0.93 0.05 295), oklch(0.24 0.05 295))',
	'light-dark(oklch(0.93 0.05 330), oklch(0.24 0.05 330))',
	'light-dark(oklch(0.93 0.04 45), oklch(0.24 0.04 45))',
	'light-dark(oklch(0.93 0.04 195), oklch(0.24 0.04 195))',
	'light-dark(oklch(0.93 0.04 280), oklch(0.24 0.04 280))',
];

export function PatternShowcase() {
	return (
		<div className={styles.showcaseContainer} style={themesetBaseProps as React.CSSProperties}>
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting showcase tokens
				dangerouslySetInnerHTML={{ __html: showcaseGlobalTokens }}
			/>
			<div className={styles.schemeGrid}>
				{(['light', 'dark'] as const).map((scheme) => (
					<div key={scheme} className={styles.schemeCard[scheme]}>
						<div className={styles.schemeHeader}>
							<h3 className={styles.schemeTitle}>
								{scheme === 'light' ? '☀️ Light Mode Swatches' : '🌙 Dark Mode Swatches'}
							</h3>
						</div>
						<Theme name="primary">
							<div className={styles.patternsGrid}>
								{PATTERN_KEYS.map((key: PatternKey, index) => {
									const varName = patternVars[key];
									const sampleBg = SAMPLE_REGION_COLORS[index % SAMPLE_REGION_COLORS.length];

									return (
										<div key={`${scheme}-${key}`} className={styles.patternCard}>
											<div
												className={styles.swatch}
												style={{
													backgroundColor: sampleBg,
													backgroundImage: varName,
												}}
												title={`${key}: ${varName}`}
											/>
											<div className={styles.tokenInfo}>
												<span className={styles.tokenKey}>{key}</span>
												<code className={styles.tokenVar}>{varName}</code>
											</div>
										</div>
									);
								})}
							</div>
						</Theme>
					</div>
				))}
			</div>
		</div>
	);
}
