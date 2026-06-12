import React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Text } from '../../../components/Text';
import { Theme } from '../../../components/Theme';
import {
	spacingScale,
	spacingScaleCompact,
	spacingScaleExpanded,
	spacingCssTokensCompact,
	spacingCssTokensExpanded,
} from '../../spacing/spacing.constants';
import {
	typographyCssTokensCompact,
	typographyCssTokensExpanded,
} from '../../../components/Text/_Text.constants';
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

const SpacingTable = styled.table`
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

const KeyBadge = styled.code`
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	color: var(--color-accent);
	padding: 4px 8px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
`;

const VarName = styled.code`
	color: var(--color-text-2);
	font-size: 0.8rem;
`;

const PixelVal = styled.span`
	font-size: 0.85rem;
	color: var(--color-text-2);
	font-family: monospace;
`;

const PreviewBar = styled.div<{ widthVal: string; spacingKey: string }>`
	height: 16px;
	width: ${(props) => props.widthVal};
	background-color: var(--color-accent);
	border-radius: 4px;
	min-width: ${(props) => (props.spacingKey === 'none' ? '0' : '2px')};
`;

const RemVal = styled.span`
	font-family: monospace;
	font-weight: 600;
	color: var(--color-text-1);
`;

export function SpacingShowcase() {
	const keys = Object.keys(spacingScale) as Array<keyof typeof spacingScale>;

	return (
		<TableContainer style={themesetBaseProps as React.CSSProperties}>
			<Global styles={showcaseGlobalStyles} />
			<Theme name="primary">
				<ShowcaseCard>
					<SpacingTable>
						<thead>
							<tr>
								<Th style={{ width: '15%' }}>Token Key</Th>
								<Th style={{ width: '25%' }}>CSS Variable</Th>
								<Th style={{ width: '20%' }}>Compact (Mobile)</Th>
								<Th style={{ width: '20%' }}>Expanded (Desktop)</Th>
								<Th style={{ width: '20%' }}>Visual Scale</Th>
							</tr>
						</thead>
						<tbody>
							{keys.map((key) => {
								const varName = spacingScale[key];
								const remCompact = spacingScaleCompact[key];
								const remExpanded = spacingScaleExpanded[key];
								const pxCompact = parseFloat(remCompact) * 16;
								const pxExpanded = parseFloat(remExpanded) * 16;

								return (
									<tr key={key}>
										<Td>
											<KeyBadge>{key}</KeyBadge>
										</Td>
										<Td>
											<VarName>{varName}</VarName>
										</Td>
										<Td>
											<RemVal>{remCompact}</RemVal>{' '}
											<PixelVal>({pxCompact}px)</PixelVal>
										</Td>
										<Td>
											<RemVal>{remExpanded}</RemVal>{' '}
											<PixelVal>({pxExpanded}px)</PixelVal>
										</Td>
										<Td>
											{remExpanded === '0rem' ? (
												<span style={{ opacity: 0.5 }}>
													<Text variant="small">0px</Text>
												</span>
											) : (
												<PreviewBar
													widthVal={varName}
													spacingKey={key}
													title={`Compact: ${pxCompact}px | Expanded: ${pxExpanded}px`}
												/>
											)}
										</Td>
									</tr>
								);
							})}
						</tbody>
					</SpacingTable>
				</ShowcaseCard>
			</Theme>
		</TableContainer>
	);
}
