import { Button } from '../Button';
import { Hero } from '../Hero';
import { PageContainer } from '../PageContainer';
import { Stack } from '../Stack';
import type { OfflineScreenProps } from './_OfflineScreen.types';

export function OfflineScreen({
	title = "You're Offline",
	message = "This content hasn't been cached for offline play yet. Check your connection to load it.",
	onRetry,
	retryLabel = 'Retry Connection',
	homeHref = '/',
	homeLabel = 'Play Cached Games',
	action,
}: OfflineScreenProps) {
	return (
		<PageContainer variant="slim">
			<Hero title={title} tagline={message} />
			<nav aria-label="Offline navigation options">
				{/* biome-ignore lint/a11y/useSemanticElements: Preserve VoiceOver list semantics lost via list-style: none in Safari */}
				<Stack as="ul" role="list" direction="row" wrap spacing="md">
					{onRetry && (
						<li>
							<Button type="button" variant="primary" size="md" onClick={onRetry}>
								{retryLabel}
							</Button>
						</li>
					)}
					<li>
						<Button as="a" href={homeHref} variant={onRetry ? 'outline' : 'primary'} size="md">
							{homeLabel}
						</Button>
					</li>
					{action && <li>{action}</li>}
				</Stack>
			</nav>
		</PageContainer>
	);
}
