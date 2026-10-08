import { DEFAULT_LANGUAGES_ARIA_LABEL, DEFAULT_REDIRECT_MESSAGE } from './_LanguageRedirectFallback.constants';
import * as S from './_LanguageRedirectFallback.styles';
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
	...rest
}: LanguageRedirectFallbackProps) {
	return (
		<S.LanguageRedirectFallback {...rest}>
			<h1>{title}</h1>
			{message && <p>{message}</p>}
			<nav aria-label={languagesAriaLabel}>
				<ul>
					{languages.map((lang) => (
						<li key={lang.code}>
							<a href={lang.href} hrefLang={lang.code}>
								{lang.flag && (
									<span data-slot="flag" aria-hidden="true">
										{lang.flag}
									</span>
								)}
								<span data-slot="label" lang={lang.code}>
									{lang.label}
								</span>
							</a>
						</li>
					))}
				</ul>
			</nav>
		</S.LanguageRedirectFallback>
	);
}
