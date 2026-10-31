import { Button } from '../Button';
import { Hero } from '../Hero';
import { PageContainer } from '../PageContainer';
import { Stack } from '../Stack';
import { DEFAULT_LANGUAGES_ARIA_LABEL, DEFAULT_REDIRECT_MESSAGE } from './_LanguageRedirectFallback.constants';
import type { LanguageRedirectFallbackProps } from './_LanguageRedirectFallback.types';

/**
 * Reusable full-page template providing an accessible fallback screen during language redirection.
 * Rendered when client-side routing is evaluating preferred languages or when JavaScript is disabled.
 */
export function LanguageRedirectFallback({
	title,
	message = DEFAULT_REDIRECT_MESSAGE,
	languagesAriaLabel = DEFAULT_LANGUAGES_ARIA_LABEL,
	languages,
}: LanguageRedirectFallbackProps) {
	return (
		<PageContainer variant="slim">
			<Hero title={title} tagline={message} />
			<nav aria-label={languagesAriaLabel}>
				<Stack as="ul" direction="row" wrap spacing="md">
					{languages.map((lang) => (
						<li key={lang.code}>
							<Button
								as="a"
								href={lang.href}
								hrefLang={lang.code}
								variant="secondary"
								size="md"
								leadingIcon={lang.flag ? <span aria-hidden="true">{lang.flag}</span> : undefined}
							>
								<span lang={lang.code}>{lang.label}</span>
							</Button>
						</li>
					))}
				</Stack>
			</nav>
		</PageContainer>
	);
}
