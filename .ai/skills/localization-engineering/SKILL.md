---
id: localization-engineering
name: Localization Engineering
description: Guidelines for managing type-safe translation schemas, dictionaries, and consumer hooks across the monorepo under ADR 007 and ADR 012
targets: ['libraries/i18n/**', 'apps/**', 'libraries/ui/**']
---

# Localization Engineering Skill

This skill defines the mandatory workflow and architectural constraints for adding, editing, and consuming translations across the monorepo in accordance with ADR 007 (Core Localization Strategy) and ADR 012 (Storage Namespacing).

## 1. Zero Hardcoded UI Strings

Per ADR 007, zero hardcoded user-facing strings are permitted in application code (`apps/**`) or component packages (`libraries/ui/**`). All interactive UI text (buttons, labels, dialogs, status messages) must be defined in `@arcade/lib-i18n` and consumed via the `useI18n()` hook.

### Static Textual Content vs. UI Strings
Purely textual static content (game rules, legal policies, documentation, informational guides) is managed via localized Markdown content collections and rendered with `<MarkdownContent>` per [rules.md](/.ai/rules.md#3-core-architectural-principles-dry--solid). Do not convert full articles or rule documents into `@arcade/lib-i18n` translation keys.

## 2. Canonical Schema Contract First

We use an abstract, language-neutral "pseudo-language" schema rather than treating English or any human language as the primary source of truth:

1. **Schema Location:** `libraries/i18n/src/schemas/common.schema.ts` (or domain-specific schema files).
2. **Workflow:** Whenever adding or altering a translation key:
   - First, declare the key in `commonSchema` (e.g., `actions: { refresh: 'actions.refresh' }`).
   - The contract `CommonTranslationContract` and leaf union `TranslationKey` derive automatically from this schema.

## 3. Mandatory Multi-Language Completeness (No Fallbacks)

- **Zero Missing Translations:** Every supported language (`en`, `de`, `fr`, `pt`) must implement the entire contract using `as const satisfies CommonTranslationContract`.
- **Compile-Time Verification:** If a key is added to the schema, every single language file in `libraries/i18n/src/locales/*/common.ts` must be updated with its respective translation. Omitting a key in any language (including English) will cause `pnpm typecheck` (`tsc --noEmit`) to fail immediately.
- **No Fallbacks:** Silent runtime language fallbacks are explicitly disabled (`fallbackLng: false`). All keys must exist across all languages.

## 4. Consumer Hook Abstraction (`useI18n`)

Applications and UI components must never import `i18next` or `react-i18next` directly. All translation interactions must use the local library abstraction:

```tsx
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';

export const MyComponent = () => {
  const { t, language, changeLanguage, supportedLanguages } = useI18n();

  return (
    <div>
      <p>{t('app.title')}</p>
      <button onClick={() => changeLanguage('de')}>
        {t('switchers.language.ariaLabel')}
      </button>
    </div>
  );
};
```

- **Type-Safe `t()`:** The `t()` function only accepts valid `TranslationKey` paths. Any misspelled or missing key is flagged at compile time.

## 5. Native Language Detection & Deferred Storage Persistence

- **Initial Load:** Handled natively in memory via `navigator.languages || [navigator.language]` and fallback to `DEFAULT_LANGUAGE` ('en'). No data is written to `localStorage` during initial load.
- **Explicit Selection Only:** Calling `changeLanguage(code)` persists the user's choice to the namespaced key `arcade::i18n::language` (per ADR 012), ensuring persistent language sync across all games and apps on `arcade.absolutholz.de`.
