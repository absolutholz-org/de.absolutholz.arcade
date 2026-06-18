---
id: accessibility-engineering
name: Accessibility Engineering
description: Technical implementation blueprints and coding patterns to satisfy WCAG 2.2 AA and BITV 2.0 standards
targets: ["libraries/design-system/src/components/*"]
---

# Accessibility Engineering Skill

This skill defines the technical implementation blueprints and coding patterns required to satisfy WCAG 2.2 AA and BITV 2.0 standards.

## 1. Focus Management Blueprints

- Explicitly engineer interactive focus states using highly visible focus indicators.
- Complex overlay components (modals, dialogs, drawers) must implement strict keyboard focus traps, return focus to the triggering element upon closing, and support standard Escape key exits.

## 2. Semantic HTML & ARIA Mapping

- Use native semantic interactive elements wherever possible.
- When custom interactive roles are structurally required, map out valid, active ARIA attributes (e.g., aria-expanded, aria-controls, aria-describedby) to reflect live state transformations.
- Ensure all form fields feature programmatic labels (via htmlFor in React/JSX) so screen readers can calculate accurate accessible names.

## 3. Contrast & Sensory Constraints

- Enforce minimum color contrast ratios: 4.5:1 for standard text and 3:1 for large graphical elements or headers.
- Interface cues, state changes, and validation errors must never rely solely on sensory characteristics like color, shape, or sound alone to convey information.
