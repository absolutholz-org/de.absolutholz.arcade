import React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { Theme } from '../../../components/Theme';
// eslint-disable-next-line no-restricted-imports
import {
	typographyCssTokensCompact,
	typographyCssTokensExpanded,
} from '../../../components/Text/_Text.constants';
import {
	radiusScale,
	radiusScaleValues,
	radiusCssTokens,
} from '../../radius/radius.constants';
import { themesetBaseProps } from '../themeset-base.css';

const showcaseGlobalStyles = css`
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

const RadiusTable = styled.table`
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

const ValueVal = styled.span`
	font-family: monospace;
	font-weight: 600;
	color: var(--color-text-1);
`;

const PreviewBox = styled.div<{ radiusVal: string }>`
	width: 48px;
	height: 48px;
	background-color: var(--color-accent);
	border: 1px solid var(--color-container-2);
	border-radius: ${({ radiusVal }) => radiusVal};
`;

export function RadiusShowcase() {
	const keys = Object.keys(radiusScale) as Array<keyof typeof radiusScale>;

	return (
		<TableContainer style={themesetBaseProps as React.CSSProperties}>
			<Global styles={showcaseGlobalStyles} />
			<Theme name="primary">
				<ShowcaseCard>
					<RadiusTable>
						<thead>
							<tr>
								<Th style={{ width: '20%' }}>Token Key</Th>
								<Th style={{ width: '35%' }}>CSS Variable</Th>
								<Th style={{ width: '25%' }}>Value</Th>
								<Th style={{ width: '20%' }}>Visual Preview</Th>
							</tr>
						</thead>
						<tbody>
							{keys.map((key) => {
								const varName = radiusScale[key];
								const val = radiusScaleValues[key];

								return (
									<tr key={key}>
										<Td>
											<KeyBadge>{key}</KeyBadge>
										</Td>
										<Td>
											<VarName>{varName}</VarName>
										</Td>
										<Td>
											<ValueVal>{val}</ValueVal>
										</Td>
										<Td>
											<PreviewBox
												radiusVal={varName}
												title={`${key}: ${val}`}
											/>
										</Td>
									</tr>
								);
							})}
						</tbody>
					</RadiusTable>
				</ShowcaseCard>
			</Theme>
		</TableContainer>
	);
}
