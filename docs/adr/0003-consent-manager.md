# ADR 0003: Modular Privacy Consent Manager, Four-Tier Data Policy, and Backend Abstraction

## Status

Accepted

## Context

Our online arcade features user authentication, local game stats, and optional cloud synchronization via Firebase/Firestore. To comply with global privacy standards (including EU GDPR/ePrivacy and US regulations like CCPA) and maintain player trust, no personal data or telemetry can leave the client without explicit, informed, and affirmative user consent.

Additionally, to maintain architectural flexibility and prevent tight coupling to specific third-party vendors (like Firebase), all external services must be cleanly abstracted behind local application interfaces. AI coding agents and developers must inspect existing project guidelines and follow these established boundaries.

## Decision

We will implement a standalone, zero-dependency `ConsentManager` library coupled with a robust backend abstraction layer, supporting four distinct user data tiers.

### 1. The Four User Data Tiers

- **Tier 1 (Anonymous Local):** Unauthenticated player; all stats and progress live strictly in local browser storage.
- **Tier 2 (Logged-In Local-Only):** Authenticated player, but explicitly chooses not to sync, keeping all stats/achievements local.
- **Tier 3 (Logged-In, Cloud-Synced - Private):** Authenticated player opts into cloud sync for cross-device persistence, but data remains strictly private (not exposed to leaderboards or other players).
- **Tier 4 (Logged-In, Cloud-Synced - Public):** Authenticated player opts into cloud sync _and_ public visibility, allowing metrics/scores to be broadcast to global leaderboards or friends.

### 2. Strict Opt-In Privacy

- Cloud sync (Tiers 3 & 4) and public broadcasting (Tier 4) are **strictly opt-in (disabled by default)**.
- Essential local storage (Tier 1 core functionality) is active by default.

### 3. Backend Abstraction Layer

- Games, UI components, and state handlers must **never** call Firestore or external APIs directly.
- All data operations must go through local storage/sync wrappers that can be swapped out in the future without modifying core game code.

### 4. Event-Driven Reactivity & Persistence

- Consent changes are broadcast via custom window events (`consentUpdated`) so active services can react instantly.
- Choices are saved locally with a timestamp to prevent repetitive prompting.

## Consequences

### Positive

- **Future-Proof Architecture:** Abstracting Firebase/Firestore means we can swap backend providers easily.
- **Complete Privacy Flexibility:** Players have granular control over whether their data stays local, syncs privately, or goes public.
- **Strict Guardrails for Agents:** Eliminates guesswork for coding agents by explicitly defining data boundaries and requiring an upfront implementation plan.
