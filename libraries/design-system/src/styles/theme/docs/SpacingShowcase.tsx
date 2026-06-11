import React from 'react';
import styled from '@emotion/styled';
import { Text } from '../../../components/Text';
import { Theme } from '../../../components/Theme';
import { spacingScale } from '../../spacing/spacing.constants';
import { themesetBaseProps } from '../themeset-base.css';

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

const PixelVal = styled.span`
	font-size: 0.85rem;
	color: var(--color-text-2);
	font-family: monospace;
`;

const PreviewBar = styled.div<{ widthVal: string }>`
	height: 16px;
	width: ${(props) => props.widthVal};
	background-color: var(--color-accent);
	border-radius: 4px;
	min-width: ${(props) => (props.widthVal === '0rem' ? '0' : '2px')};
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
			<Theme name="primary">
				<ShowcaseCard>
					<SpacingTable>
						<thead>
							<tr>
								<Th style={{ width: '20%' }}>Token Key</Th>
								<Th style={{ width: '20%' }}>REM Value</Th>
								<Th style={{ width: '20%' }}>Pixel Equiv.</Th>
								<Th style={{ width: '40%' }}>Visual Scale Width</Th>
							</tr>
						</thead>
						<tbody>
							{keys.map((key) => {
								const remVal = spacingScale[key];
								const pxVal = parseFloat(remVal) * 16;
								return (
									<tr key={key}>
										<Td>
											<KeyBadge>{key}</KeyBadge>
										</Td>
										<Td>
											<RemVal>{remVal}</RemVal>
										</Td>
										<Td>
											<PixelVal>{pxVal}px</PixelVal>
										</Td>
										<Td>
											{remVal === '0rem' ? (
												<span style={{ opacity: 0.5 }}>
													<Text variant="small">0px (none)</Text>
												</span>
											) : (
												<PreviewBar widthVal={remVal} title={`${pxVal}px`} />
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
