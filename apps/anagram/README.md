# Anagram Scramble (`@arcade/anagram`)

Single-player anagram puzzle game where players discover sub-words from a randomized rack of letter tiles across four difficulty tiers and two game modes.

## Difficulty Matrix

| Tier | Rack Size | Min Word Length | Target Words |
| :--- | :--- | :--- | :--- |
| `easy` | 5 | 3 | 6–12 |
| `medium` | 6 | 3 | 15–25 |
| `hard` | 7 | 3 | 30–50 |
| `expert` | 7 | 4 | 15–25 |

## Modes & Win Rules

- **Zen (`zen`):** Untimed, includes a Reveal Answers action. Clearing a round requires finding at least one full-length root word OR at least 50% of all solvable words. Finding 100% of solvable words achieves Mastery.
- **Timed Arcade (`timed`):** Starts with 150 seconds (`2:30`) and awards +5 bonus seconds per valid word found. Clearing requires finding at least one full-length word before time expires.

## Engine & Lexicon Schema

- `src/engine/lexicon.data.<lang>.json` follows `{ "words": string[] }`.
- `getAnagramData(rackLetters, difficulty, language = "en")` indexes words by sorted Unicode code-point signatures (`Array.from(word)`), supporting UTF-8 characters such as `ä`, `ö`, `ü`, and `ß`.

## Development

```bash
pnpm dev:anagram
pnpm --filter @arcade/anagram test
pnpm --filter @arcade/anagram typecheck
```
