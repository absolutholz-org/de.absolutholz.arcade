# Hybrid Rendering Architecture & Execution Boundaries (BASE-02)

This project combines static pre-rendered content (Astro) with dynamic client-side content (React).

## 1. Static Pre-Rendered Pages (`.astro`)
- Execute exclusively during the static build/SSG step (Node.js).
- Global stylesheet (`@arcade/lib-ui/styles/global.css`) must be imported once at the root layout (`BaseLayout.astro`).
- Server-side text must be read directly from `@arcade/lib-i18n` resources without client hooks.
- Must never execute client-side state loops or assume browser globals exist (`window`, `localStorage`, `document`).

## 2. Isomorphic UI Islands (`libraries/ui` in `.astro` with `client:load` / `client:idle`)
- Evaluated on the server during SSG, then hydrated in the browser.
- **Strict SSR Safety:** Never use `useLayoutEffect` (enforce `useEffect`). Guard all `window`, `document`, and `localStorage` accesses (`typeof window !== 'undefined'`).
- Must consume `@arcade/lib-i18n` abstractions (`useI18n()`).

## 3. Client-Only Interactive Modules (Games & Canvas)
- Must use `client:only="react"` per `BASE-02`.
- Must never be evaluated on the server or use partial hydration directives.

## 4. Ambiguity Handling
- Follow this taxonomy automatically without asking on routine prompts.
- If a new feature's rendering tier is genuinely ambiguous (e.g. static Astro component vs. interactive React island), ask for clarification before implementing.
