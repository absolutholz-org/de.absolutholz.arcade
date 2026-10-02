import type React from 'react';
import { typographyCssTokensCompact, typographyCssTokensExpanded } from '../../../components/Text/_Text.constants';
import { Theme } from '../../../components/Theme';
import { radiusCssTokens, radiusScale, radiusScaleValues } from '../../radius/radius.constants';
import { themesetBaseProps } from '../themeset-base.css';
import * as styles from './RadiusShowcase.css';

const showcaseGlobalStyles = `
	:root {
		${typographyCssTokensCompact}
		${radiusCssTokens}
	}

	@media (min-width: 1024px) and (min-height: 800px) {
		:root {
			${typographyCssTokensExpanded}
		}
	}
`;

type RadiusKey = keyof typeof radiusScale;

export function RadiusShowcase() {
	const keys = Object.keys(radiusScale) as RadiusKey[];

	return (
		<div className={styles.tableContainer} style={themesetBaseProps as React.CSSProperties}>
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: injecting showcase tokens
				dangerouslySetInnerHTML={{ __html: showcaseGlobalStyles }}
			/>
			<Theme name="primary">
				<div className={styles.showcaseCard}>
					<table className={styles.radiusTable}>
						<thead>
							<tr>
								<th className={styles.tableHeadCell} style={{ width: '20%' }}>
									Token Key
								</th>
								<th className={styles.tableHeadCell} style={{ width: '35%' }}>
									CSS Variable
								</th>
								<th className={styles.tableHeadCell} style={{ width: '25%' }}>
									Value
								</th>
								<th className={styles.tableHeadCell} style={{ width: '20%' }}>
									Visual Preview
								</th>
							</tr>
						</thead>
						<tbody>
							{keys.map((key) => {
								const varName = radiusScale[key];
								const val = radiusScaleValues[key];

								return (
									<tr key={String(key)}>
										<td className={styles.tableBodyCell}>
											<code className={styles.keyBadge}>{String(key)}</code>
										</td>
										<td className={styles.tableBodyCell}>
											<code className={styles.varName}>{varName}</code>
										</td>
										<td className={styles.tableBodyCell}>
											<span className={styles.valueVal}>{val}</span>
										</td>
										<td className={styles.tableBodyCell}>
											<div
												className={styles.previewBox}
												style={{ borderRadius: varName }}
												title={`${String(key)}: ${val}`}
											/>
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
