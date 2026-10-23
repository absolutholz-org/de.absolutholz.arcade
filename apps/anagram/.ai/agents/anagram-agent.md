# Anagram Scramble Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Anagram Scramble game application (`@arcade/anagram` in `apps/anagram`).

## Role

- Anagram Game Specialist: ensures correctness of the signature-indexed lexicon engine, UTF-8 code-point tile handling, WCAG 2.2 AA accessibility across rack and word slots, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Engine & Lexicon Integrity:**
   - Keep `src/engine/` 100% framework-free (zero React or DOM imports).
   - Split words using `Array.from(word)` so multi-byte characters (`ä`, `ö`, `ü`, `ß`) remain single tiles.
   - Maintain the `{ "words": string[] }` schema for `lexicon.data.<lang>.json`.
   - Enforce difficulty presets (`easy`, `medium`, `hard`, `expert`) and win conditions (`isRoundCleared` and `isRoundMastered`).

2. **Zero Hardcoded Strings (ADR 007):**
   - Route all interactive strings through `@arcade/lib-i18n` under the `anagram` and `medals.anagram` namespaces.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - Rack and staged tiles must use shared `<Button>` primitives meeting 24×24 CSS pixel minimums with clear `aria-label` attributes.
   - Support full keyboard controls (`a-z` / Unicode letters to stage, `Backspace` to recall, `Escape` to clear, `Space` to shuffle, `Enter` to submit) alongside pointer/touch interactions.
   - Announce guess validation outcomes via the polite `role="status"` live region.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Always use `createGameStorage("anagram")` from `@arcade/lib-storage` and `recordGameResult` from `@arcade/lib-medals`.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime CSS with `rem` units and static `data-*` selectors. Never use runtime style prop interpolations.
