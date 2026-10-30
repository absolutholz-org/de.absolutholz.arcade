import type { JSX, ReactNode } from 'react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/Button';
import { PageContainer } from '../../components/PageContainer';
import { Stack } from '../../components/Stack';
import { BaseLayoutWithSiteHeaderAndSiteFooter } from '../../layouts/BaseLayoutWithSiteHeaderAndSiteFooter';
import * as S from './_GameSubpageTemplate.styles';
import type { GameSubpageActionItem, GameSubpageTemplateProps } from './_GameSubpageTemplate.types';

function isActionItem(action: unknown): action is GameSubpageActionItem {
	return typeof action === 'object' && action !== null && 'label' in action && 'href' in action;
}

function renderAction(action: GameSubpageActionItem | ReactNode, variant: 'primary' | 'secondary'): ReactNode {
	if (isActionItem(action)) {
		return (
			<Button as="a" href={action.href} variant={variant} size="lg" aria-label={action.ariaLabel}>
				{action.label}
			</Button>
		);
	}
	return action;
}

/**
 * Tier 2 structural template for rendering game subpages (e.g. /stats, /medals, /settings).
 *
 * Scaffolds an underlying Tier 1 BaseLayoutWithSiteHeaderAndSiteFooter, establishes
 * standard vertical breathing room inside a PageContainer, renders hierarchical
 * breadcrumbs, a prominent localized Hero header with <h1>, and standardized gameplay CTAs.
 */
export function GameSubpageTemplate({
	title,
	subtitle,
	breadcrumbItems,
	containerWidth = 'standard',
	primaryAction,
	secondaryAction,
	children,
	...layoutProps
}: GameSubpageTemplateProps): JSX.Element {
	const hasActions = Boolean(primaryAction || secondaryAction);

	return (
		<BaseLayoutWithSiteHeaderAndSiteFooter title={title} {...layoutProps}>
			<PageContainer variant={containerWidth}>
				<S.Container>
					{breadcrumbItems && breadcrumbItems.length > 0 ? <Breadcrumb items={breadcrumbItems} /> : null}

					<S.Hero>
						<S.Title>{title}</S.Title>
						{subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
					</S.Hero>

					{children}

					{hasActions ? (
						<S.Footer>
							<Stack align="center" direction="row" spacing="md" justify="center" wrap>
								{primaryAction ? renderAction(primaryAction, 'primary') : null}
								{secondaryAction ? renderAction(secondaryAction, 'secondary') : null}
							</Stack>
						</S.Footer>
					) : null}
				</S.Container>
			</PageContainer>
		</BaseLayoutWithSiteHeaderAndSiteFooter>
	);
}
