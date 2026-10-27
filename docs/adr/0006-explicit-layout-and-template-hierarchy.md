# ADR 0006: Explicit 3-Tier Layout and Template Hierarchy

## Status

Accepted

## Context

Previously in the workspace, layout components often coupled global document chrome (such as headers, footers, skip links, and head metadata) directly with content-level spatial constraints (such as baking `<PageContainer>` widths and paddings into layout roots).

This tight coupling introduced several architectural and visual challenges:
- **Blurred Boundaries:** Layouts attempted to solve both document-level landmark responsibilities and page-specific content framing simultaneously.
- **Inconsistent Line Lengths & Spacing:** Editorial content (such as rules and legal prose requiring narrow, readable line lengths) collided with denser visual screens (such as game lobbies, matrices, and showcases) because the layout imposed a rigid container width.
- **Layout Collisions & Mobile Overhead:** Components attempted to manage responsiveness both at the outermost layout shell and inside internal components, causing double margins or header/footer anchoring glitches.
- **Accessibility & Skip Link Target Ambiguity:** Inconsistent placement of `<main id="main-content">` relative to headers and footers created risks for landmark navigation and skip-to-content target compliance.

## Decision

We establish an explicit, three-tier architectural hierarchy separating document landmark scaffolding, structural container templates, and concrete route pages:

### Tier 1: Document Layouts (`libraries/ui/src/layouts/*`)
Pure document scaffolding that establishes the HTML shell, accessibility landmarks, global overlays, and skip navigation.
- **Components:** `BaseLayout`, `BaseLayoutWithSiteFooter`, `BaseLayoutWithSiteHeaderAndSiteFooter`, and the forthcoming `GameLayout`.
- **Invariants:**
  - Provides semantic landmarks (`<header>`, `<main id="main-content">`, `<footer>`).
  - Includes `<SkipLink href="#main-content">` targeting the primary content area with localized text.
  - Mounts global overlays (`<Toast />`, `<ConsentBanner />`).
  - **Zero Spatial Constraints:** The `{children}` slot must remain completely open and unconstrained. Tier 1 layouts must **NEVER** bake or enforce an internal `<PageContainer>`.

### Tier 2: Structural Templates (`libraries/ui/src/layouts/*Template/` or template modules)
Reusable structural wrappers that define spatial rhythm, container widths, and section slot arrangements for specific page archetypes.
- **Components:** `GameLandingTemplate`, `ArticleTemplate`, `ShowcaseTemplate`, etc.
- **Invariants:**
  - Consume `<PageContainer>` variants (`slim`, `standard`, `wide`, or edge-to-edge) to control readability and max-widths.
  - Organize content into zones (e.g. hero zones, actions, grid areas, secondary footers).
  - Contain no root document boilerplate (`<!doctype html>`, `<html>`, `<body>`, skip links).

### Tier 3: Concrete Pages (`apps/*/src/pages/*`)
Concrete Astro routes and React pages that assemble business components into a Tier 2 template, rendered inside an appropriate Tier 1 layout.

## Consequences

- **Separation of Concerns:** Clear demarcation between document-level landmark chrome and page-level spatial constraints.
- **Unconstrained Slot Flexibility:** Higher-tier templates and game canvas views freely dictate their own container widths, margins, and padding without fighting parent layout bounds.
- **A11y & Landmark Integrity:** Guarantees that `<main id="main-content">` is properly wrapped as an unencumbered skip-link target, with `<header>` as the top-level banner and `<footer>` as the document footer.
- **Consistent Storybook & Documentation:** Storybook stories under `LAYOUTS` visually demonstrate unconstrained slots, standardizing preview expectations across all apps.
