import { getGame, isGameId } from '@arcade/lib-games';
import { useTaxonomyLabel } from '@arcade/lib-i18n/hooks/useI18n';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { GameActionBar } from '../../components/GameActionBar';
import { Hero } from '../../components/Hero';
import { PageContainer } from '../../components/PageContainer';
import * as S from './_GameLandingTemplate.styles';
import type { GameLandingTemplateProps } from './_GameLandingTemplate.types';

export function GameLandingTemplate({
	title,
	description,
	category,
	tags,
	tagsAriaLabel,
	heroIcon,
	resumeState,
	contentWidth = 'default',
	pageFooterLinks,
	offlineGameId,
	children,
}: GameLandingTemplateProps) {
	const { getCategory, getTag, gameAttributesAriaLabel } = useTaxonomyLabel();
	const mainContainerVariant = contentWidth === 'wide' ? 'wide' : 'standard';

	const gameMetadata = offlineGameId && isGameId(offlineGameId) ? getGame(offlineGameId) : undefined;
	const resolvedCategory = category ?? (gameMetadata ? getCategory(gameMetadata.category.primary) : undefined);
	const resolvedTags =
		tags ??
		(gameMetadata
			? [
					...gameMetadata.tags.mechanics.map((tag) => getTag('mechanics', tag)),
					...gameMetadata.tags.pacing.map((tag) => getTag('pacing', tag)),
				]
			: undefined);
	const resolvedTagsAriaLabel = tagsAriaLabel ?? gameAttributesAriaLabel;

	return (
		<S.Root>
			{/* Zone 1: Header / Intro */}
			<S.HeaderZone>
				<PageContainer>
					<Hero
						eyebrow={resolvedCategory}
						title={title}
						tagline={description}
						tags={resolvedTags}
						tagsAriaLabel={resolvedTagsAriaLabel}
						logo={heroIcon}
						actions={
							offlineGameId ? (
								<GameActionBar gameId={offlineGameId} gameTitle={title} justify="start" />
							) : null
						}
					/>
				</PageContainer>
				{resumeState && (
					<PageContainer>
						<Banner
							variant="info"
							statusLabel="Resume"
							message={resumeState.message}
							action={
								<Button variant="primary" size="md" onClick={resumeState.onResume}>
									{resumeState.buttonLabel ?? 'Resume'}
								</Button>
							}
						/>
					</PageContainer>
				)}
			</S.HeaderZone>

			{/* Zone 2: Main Area */}
			<PageContainer variant={mainContainerVariant}>
				<S.MainZone>{children}</S.MainZone>
			</PageContainer>

			{/* Zone 3: Game Page Footer */}
			{pageFooterLinks && pageFooterLinks.length > 0 && (
				<PageContainer variant="standard">
					<S.FooterZone>
						<S.FooterNav aria-label="Game links">
							{pageFooterLinks.map((link) => {
								if (link.href) {
									return (
										<a key={link.label} href={link.href} onClick={link.onClick}>
											{link.label}
										</a>
									);
								}
								return (
									<button key={link.label} type="button" onClick={link.onClick}>
										{link.label}
									</button>
								);
							})}
						</S.FooterNav>
					</S.FooterZone>
				</PageContainer>
			)}
		</S.Root>
	);
}
