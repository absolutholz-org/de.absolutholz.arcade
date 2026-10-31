import { Button } from '../Button';
import { Hero } from '../Hero';
import { PageContainer } from '../PageContainer';
import { Stack } from '../Stack';
import type { ErrorScreenProps } from './_ErrorScreen.types';

export function ErrorScreen({
	title = 'Something went wrong',
	message = 'An unexpected error occurred while loading this screen.',
	onRetry,
	retryLabel = 'Try Again',
	homeHref = '/',
	homeLabel = 'Return Home',
	action,
}: ErrorScreenProps) {
	return (
		<PageContainer variant="slim">
			<Hero title={title} tagline={message} />
			<nav aria-label="Error recovery options">
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
