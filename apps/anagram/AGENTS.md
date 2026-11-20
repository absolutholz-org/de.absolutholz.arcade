# @arcade/anagram — Local Agent Invariants

- **Engine & Lexicon (`src/engine/`):** 100% framework-free (zero React/DOM imports). Split words via `Array.from(word)` so multi-byte Unicode characters (`ä`, `ö`, `ü`, `ß`) remain single tiles. Maintain `{ "words": string[] }` schema for `lexicon.data.<lang>.json`, difficulty presets (`easy`, `medium`, `hard`, `expert`), and `isRoundCleared` / `isRoundMastered`.
- **Accessibility & Controls:** Rack and staged tiles must use `<Button>` primitives (`>= 24×24px` touch target) with clear `aria-label`s. Support keyboard controls (`a–z`/Unicode letters to stage, `Backspace` recall, `Escape` clear, `Space` shuffle, `Enter` submit) and announce validation outcomes via `role="status"`.
- **Namespaces:** i18n `anagram` / `medals.anagram`; storage `createGameStorage('anagram')`.
