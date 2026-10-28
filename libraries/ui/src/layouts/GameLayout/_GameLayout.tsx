import { PageContainer } from '../../components/PageContainer';
import * as S from './_GameLayout.styles';
import type { GameLayoutProps } from './_GameLayout.types';

/**
 * Tier 1 Document Layout for active puzzle sessions.
 * Provides a mobile-first, zero-scroll flex shell with dedicated slots
 * for persistent header, status strip, main canvas, toolbar, and footer.
 */
export function GameLayout({
	header,
	status,
	children,
	toolbar,
	footer,
	containerWidth = 'standard',
}: GameLayoutProps) {
	return (
		<S.Shell data-container-width={containerWidth}>
			{header && <S.HeaderZone>{header}</S.HeaderZone>}
			<S.Main id="main-content">
				<PageContainer variant={containerWidth ?? 'standard'}>
					{status && <S.StatusZone>{status}</S.StatusZone>}
					{children}
					{toolbar && <S.ToolbarZone>{toolbar}</S.ToolbarZone>}
				</PageContainer>
			</S.Main>
			{footer && <S.FooterZone>{footer}</S.FooterZone>}
		</S.Shell>
	);
}
