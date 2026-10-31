import { Button } from '../Button';
import { Hero } from '../Hero';
import { PageContainer } from '../PageContainer';
import { Stack } from '../Stack';
import type { NotFoundScreenProps } from './_NotFoundScreen.types';

export function NotFoundScreen({
	title = 'Page Not Found',
	message = "The page or puzzle you're looking for doesn't exist or has moved.",
	homeHref = '/',
	homeLabel = 'Back to Arcade',
	action,
}: NotFoundScreenProps) {
	return (
		<PageContainer variant="slim">
			<Hero title={title} tagline={message} />
			<nav aria-label="Navigation options">
				{/* biome-ignore lint/a11y/useSemanticElements: Preserve VoiceOver list semantics lost via list-style: none in Safari */}
				<Stack as="ul" role="list" direction="row" wrap spacing="md">
					<li>
						<Button as="a" href={homeHref} variant="primary" size="md">
							{homeLabel}
						</Button>
					</li>
					{action && <li>{action}</li>}
				</Stack>
			</nav>
		</PageContainer>
	);
}
