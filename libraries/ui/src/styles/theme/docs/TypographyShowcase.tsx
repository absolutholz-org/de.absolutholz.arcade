import type React from 'react';
import { Text } from '../../../components/Text';
import {
	SEMANTIC_VARIANTS,
	fontWeights,
	typographyCssTokensCompact,
	typographyCssTokensExpanded,
	typographyScale,
	typographyScaleCompact,
	typographyScaleExpanded,
} from '../../../components/Text/_Text.constants';
import { Theme } from '../../../components/Theme';
import { spacingCssTokensCompact, spacingCssTokensExpanded } from '../../spacing';
import { themesetBaseProps } from '../themeset-base.css';
import * as styles from './TypographyShowcase.css';

const showcaseGlobalStyles = `
	:root {
		${typographyCssTokensCompact}
		${spacingCssTokensCompact}
	}

	@media (min-width: 1024px) and (min-height: 800px) {
		:root {
			${typographyCssTokensExpanded}
			${spacingCssTokensExpanded}
		}
	}
`;

type VariantKey = keyof typeof SEMANTIC_VARIANTS;

const INTENDED_USES: Record<VariantKey, string> = {
	display: 'High-impact marketing hero headers, highlight showcase figures, and main landing page titles.',
	h1: 'Primary page-level headers (usually mapping to a single <h1> tag per page).',
	h2: 'Major section headers that group blocks of content together.',
	h3: 'Sub-section titles, dashboard module headers, and prominent card titles.',
	base: 'Default paragraph text, forms input labels/values, and principal interactive controls.',
	small: 'Secondary captions, product metadata labels, helper text, and copyright footers.',
};

export function TypographyShowcase() {
	const variants = Object.keys(SEMANTIC_VARIANTS) as VariantKey[];

	return (
		<div className={styles.tableContainer} style={themesetBaseProps as React.CSSProperties}>
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting showcase tokens
				dangerouslySetInnerHTML={{ __html: showcaseGlobalStyles }}
			/>
			<Theme name="primary">
				<div className={styles.showcaseCard}>
					<table className={styles.typographyTable}>
						<thead>
							<tr>
								<th className={styles.tableHeadCell} style={{ width: '15%' }}>
									Variant
								</th>
								<th className={styles.tableHeadCell} style={{ width: '25%' }}>
									Tokens & Font Specs
								</th>
								<th className={styles.tableHeadCell} style={{ width: '30%' }}>
									Intended Use
								</th>
								<th className={styles.tableHeadCell} style={{ width: '30%' }}>
									Live Preview
								</th>
							</tr>
						</thead>
						<tbody>
							{variants.map((vKey) => {
								const config = SEMANTIC_VARIANTS[vKey];
								const scaleInfo = typographyScale[config.scale];
								const weightVal = fontWeights[config.weight];
								const isHeading = ['display', 'h1', 'h2', 'h3'].includes(String(vKey));
								const fontFamily = isHeading ? 'Outfit' : 'System-UI';

								return (
									<tr key={String(vKey)}>
										<td className={styles.tableBodyCell}>
											<code className={styles.variantBadge}>{vKey}</code>
										</td>
										<td className={styles.tableBodyCell}>
											<div className={styles.specList}>
												<div className={styles.specItem}>
													CSS Var: <span>{scaleInfo.size}</span>
												</div>
												<div className={styles.specItem}>
													Compact: <span>{typographyScaleCompact[config.scale].size}</span>
												</div>
												<div className={styles.specItem}>
													Expanded: <span>{typographyScaleExpanded[config.scale].size}</span>
												</div>
												<div className={styles.specItem}>
													Line Height:{' '}
													<span>{typographyScaleCompact[config.scale].lineHeight}</span>
												</div>
												<div className={styles.specItem}>
													Weight:{' '}
													<span>
														{weightVal} ({config.weight})
													</span>
												</div>
												<div className={styles.specItem}>
													Family: <span>{fontFamily}</span>
												</div>
											</div>
										</td>
										<td
											className={styles.tableBodyCell}
											style={{
												fontSize: '0.85rem',
												color: 'var(--color-text-2)',
												lineHeight: 1.4,
											}}
										>
											{INTENDED_USES[vKey]}
										</td>
										<td className={styles.tableBodyCell}>
											<div className={styles.previewWrapper}>
												<Text variant={vKey} as="div">
													{isHeading
														? 'Premium Handcrafted Wood'
														: 'The design system typography strategy utilizes a locked-pair scale dictionary.'}
												</Text>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Theme>
		</div>
	);
}
