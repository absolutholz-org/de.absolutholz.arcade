import type React from 'react';
import {
	type SpacingKey,
	spacingCssTokensCompact,
	spacingCssTokensExpanded,
	spacingDefinitions,
	spacingKeys,
} from '..';
import { Text } from '../../../components/Text';
import { typographyCssTokensCompact, typographyCssTokensExpanded } from '../../../components/Text/_Text.constants';
import { Theme } from '../../../components/Theme';
import { themesetBaseProps } from '../../theme/themeset-base.css';
import * as styles from './_SpacingShowcase.css';

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

const spacingScaleCompact = Object.fromEntries(
	(Object.entries(spacingDefinitions) as Array<[SpacingKey, (typeof spacingDefinitions)[SpacingKey]]>).map(
		([key, def]) => [key, def.compact],
	),
) as Record<SpacingKey, string>;

const spacingScaleExpanded = Object.fromEntries(
	(Object.entries(spacingDefinitions) as Array<[SpacingKey, (typeof spacingDefinitions)[SpacingKey]]>).map(
		([key, def]) => [key, 'expanded' in def ? def.expanded : def.compact],
	),
) as Record<SpacingKey, string>;

export function SpacingShowcase() {
	const keys = spacingKeys;

	return (
		<div className={styles.tableContainer} style={themesetBaseProps as React.CSSProperties}>
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting showcase tokens
				dangerouslySetInnerHTML={{ __html: showcaseGlobalStyles }}
			/>
			<Theme name="primary">
				<div className={styles.showcaseCard}>
					<table className={styles.spacingTable}>
						<thead>
							<tr>
								<th className={styles.tableHeadCell} style={{ width: '15%' }}>
									Token Key
								</th>
								<th className={styles.tableHeadCell} style={{ width: '25%' }}>
									CSS Variable
								</th>
								<th className={styles.tableHeadCell} style={{ width: '20%' }}>
									Compact (Mobile)
								</th>
								<th className={styles.tableHeadCell} style={{ width: '20%' }}>
									Expanded (Desktop)
								</th>
								<th className={styles.tableHeadCell} style={{ width: '20%' }}>
									Visual Scale
								</th>
							</tr>
						</thead>
						<tbody>
							{keys.map((key) => {
								const varName = `var(--space-${key})`;
								const remCompact = spacingScaleCompact[key];
								const remExpanded = spacingScaleExpanded[key];
								const pxCompact = Number.parseFloat(remCompact) * 16;
								const pxExpanded = Number.parseFloat(remExpanded) * 16;

								return (
									<tr key={key}>
										<td className={styles.tableBodyCell}>
											<code className={styles.keyBadge}>{key}</code>
										</td>
										<td className={styles.tableBodyCell}>
											<code className={styles.varName}>{varName}</code>
										</td>
										<td className={styles.tableBodyCell}>
											<span className={styles.remVal}>{remCompact}</span>{' '}
											<span className={styles.pixelVal}>({pxCompact}px)</span>
										</td>
										<td className={styles.tableBodyCell}>
											<span className={styles.remVal}>{remExpanded}</span>{' '}
											<span className={styles.pixelVal}>({pxExpanded}px)</span>
										</td>
										<td className={styles.tableBodyCell}>
											{remExpanded === '0rem' ? (
												<span style={{ opacity: 0.5 }}>
													<Text variant="small">0px</Text>
												</span>
											) : (
												<div
													className={styles.previewBar}
													style={{
														width: varName,
														minWidth: key === 'none' ? '0' : '2px',
													}}
													title={`Compact: ${pxCompact}px | Expanded: ${pxExpanded}px`}
												/>
											)}
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
