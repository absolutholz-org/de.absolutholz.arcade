import React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Theme } from '../../../components/Theme';
import { Text } from '../../../components/Text';
// eslint-disable-next-line no-restricted-imports
import {
	SEMANTIC_VARIANTS,
	typographyScale,
	fontWeights,
	typographyScaleCompact,
	typographyScaleExpanded,
	typographyCssTokensCompact,
	typographyCssTokensExpanded,
} from '../../../components/Text/_Text.constants';
import {
	spacingCssTokensCompact,
	spacingCssTokensExpanded,
} from '../../spacing';
import { themesetBaseProps } from '../themeset-base.css';

const showcaseGlobalStyles = css`
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

const TableContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
	margin-top: 24px;
	margin-bottom: 40px;
	font-family: 'Inter', system-ui, sans-serif;
`;

const ShowcaseCard = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 16px;
	padding: 24px;
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
`;

const TypographyTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	text-align: left;
`;

const Th = styled.th`
	padding: 12px 16px;
	border-bottom: 2px solid var(--color-container-2);
	color: var(--color-text-2);
	font-size: 0.85rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
`;

const Td = styled.td`
	padding: 20px 16px;
	border-bottom: 1px solid var(--color-container-2);
	vertical-align: middle;
`;

const VariantBadge = styled.code`
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	color: var(--color-accent);
	padding: 4px 8px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
`;

const SpecList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 0.8rem;
	color: var(--color-text-2);
`;

const SpecItem = styled.div`
	span {
		color: var(--color-text-3);
		font-family: monospace;
	}
`;

const PreviewWrapper = styled.div`
	color: var(--color-text-1);
	word-break: break-word;
`;

const INTENDED_USES: Record<string, string> = {
	display:
		'High-impact marketing hero headers, highlight showcase figures, and main landing page titles.',
	h1: 'Primary page-level headers (usually mapping to a single <h1> tag per page).',
	h2: 'Major section headers that group blocks of content together.',
	h3: 'Sub-section titles, dashboard module headers, and prominent card titles.',
	base: 'Default paragraph text, forms input labels/values, and principal interactive controls.',
	small:
		'Secondary captions, product metadata labels, helper text, and copyright footers.',
};

export function TypographyShowcase() {
	const variants = Object.keys(SEMANTIC_VARIANTS) as Array<
		keyof typeof SEMANTIC_VARIANTS
	>;

	return (
		<TableContainer style={themesetBaseProps as React.CSSProperties}>
			<Global styles={showcaseGlobalStyles} />
			{/* Base Theme Context Wrapper */}
			<Theme name="primary">
				<ShowcaseCard>
					<TypographyTable>
						<thead>
							<tr>
								<Th style={{ width: '15%' }}>Variant</Th>
								<Th style={{ width: '25%' }}>Tokens & Font Specs</Th>
								<Th style={{ width: '30%' }}>Intended Use</Th>
								<Th style={{ width: '30%' }}>Live Preview</Th>
							</tr>
						</thead>
						<tbody>
							{variants.map((vKey) => {
								const config = SEMANTIC_VARIANTS[vKey];
								const scaleInfo = typographyScale[config.scale];
								const weightVal = fontWeights[config.weight];
								const isHeading = ['display', 'h1', 'h2', 'h3'].includes(vKey);
								const fontFamily = isHeading ? 'Outfit' : 'System-UI';

								return (
									<tr key={vKey}>
										<Td>
											<VariantBadge>{vKey}</VariantBadge>
										</Td>
										<Td>
											<SpecList>
												<SpecItem>
													CSS Var: <span>{scaleInfo.size}</span>
												</SpecItem>
												<SpecItem>
													Compact:{' '}
													<span>
														{typographyScaleCompact[config.scale].size}
													</span>
												</SpecItem>
												<SpecItem>
													Expanded:{' '}
													<span>
														{typographyScaleExpanded[config.scale].size}
													</span>
												</SpecItem>
												<SpecItem>
													Line Height:{' '}
													<span>
														{typographyScaleCompact[config.scale].lineHeight}
													</span>
												</SpecItem>
												<SpecItem>
													Weight:{' '}
													<span>
														{weightVal} ({config.weight})
													</span>
												</SpecItem>
												<SpecItem>
													Family: <span>{fontFamily}</span>
												</SpecItem>
											</SpecList>
										</Td>
										<Td
											style={{
												fontSize: '0.85rem',
												color: 'var(--color-text-2)',
												lineHeight: 1.4,
											}}
										>
											{INTENDED_USES[vKey]}
										</Td>
										<Td>
											<PreviewWrapper>
												<Text variant={vKey} as="div">
													{isHeading
														? 'Premium Handcrafted Wood'
														: 'The design system typography strategy utilizes a locked-pair scale dictionary.'}
												</Text>
											</PreviewWrapper>
										</Td>
									</tr>
								);
							})}
						</tbody>
					</TypographyTable>
				</ShowcaseCard>
			</Theme>
		</TableContainer>
	);
}
