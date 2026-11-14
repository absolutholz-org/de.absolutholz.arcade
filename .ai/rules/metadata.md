# Page Metadata & Title Conventions

When generating or editing page routes, layouts, and `<head>` metadata, construct titles using structural hierarchy rather than hardcoded route enums.

## 1. Hierarchy Formula

Titles follow an inverted specificity hierarchy:
`[Subject / Feature] [– Action / Variant] [– Enclosing Scope] | [Brand]`

- **Primary separator (`|`):** Separates major hierarchical boundaries (Scope vs. Brand).
- **Secondary separator (`–`):** Binds sub-features or actions to their parent subject.
- **Brand default:** `absolutholz Arcade`.

### Structural Logic

1. **Hub / Root:** `${Brand} – Logic & Puzzle Games`
2. **Global View / Tool:** `${Subject} | ${Brand}` (e.g. `Settings | absolutholz Arcade`, `Medals | absolutholz Arcade`, `Imprint | absolutholz Arcade`)
3. **Game Root:** `${Game} | ${Brand}` (e.g. `Sudoku | absolutholz Arcade`)
4. **Active Play Session:** `Play ${Game} | ${Brand}` (or `${Variant} – Play ${Game} | ${Brand}`)
5. **Game-Scoped View:** `${Subject} – ${Game} | ${Brand}` (e.g. `Medals – Sudoku | absolutholz Arcade`, `Settings – Sudoku | absolutholz Arcade`)

## 2. Implementation Rules

- **No Manual String Assembly:** Never write `${title} | ${description}` or manual template literal concatenations.
- **Use `titleOptions` via `@arcade/lib-ui`:**
  Pass `{ subject?, action?, scope?, isPlaySession?, brand? }` to `BaseLayout` or wrapper templates.
- **Subpage Templates:**
  `GameSubpageTemplate` automatically forwards `scope={game.title}` and sets `subject` from the page's heading.
- **Description Isolation:**
  `<meta name="description">` receives the full descriptive copy. The `<title>` receives only location and scope.
