import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Hero } from '../../components/Hero';
import { PageContainer } from '../../components/PageContainer';
import * as S from './_GameLandingTemplate.styles';
import type { GameLandingTemplateProps } from './_GameLandingTemplate.types';

export function GameLandingTemplate({
	title,
	description,
	heroIcon,
	resumeState,
	contentWidth = 'default',
	pageFooterLinks,
	children,
}: GameLandingTemplateProps) {
	const mainContainerVariant = contentWidth === 'wide' ? 'wide' : 'standard';

	return (
		<S.Root>
			{/* Zone 1: Header / Intro */}
			<S.HeaderZone>
				<PageContainer>
					<Hero title={title} tagline={description} logo={heroIcon} align="left" />
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
