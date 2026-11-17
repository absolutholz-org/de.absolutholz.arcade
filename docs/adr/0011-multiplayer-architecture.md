# ADR-0011: Multiplayer Architecture and Engine for Turn-Based Arcade Games

**Status:** Accepted (Revised — Cloud-Backed Async Architecture)  
**Context:** Absolute Holz Arcade (`arcade.absolutholz.de`)  
**Scope:** `@arcade/lib-multiplayer`, `@arcade/lib-user`, `firestore.rules`, game applications under `apps/` (initial pilot: `apps/tictactoe`)  
**Related Spec:** [Multiplayer Gameplay & State-Flow Specification](../multiplayer-gameplay-spec.md)

---

## 1. Context & Revision Rationale

The original draft of ADR-0011 specified a serverless WebRTC DataChannel architecture using PeerJS (`0.peerjs.com`) with STUN/TURN ICE negotiation. Real-world testing across home Wi-Fi, mobile browsers, and desktop PWAs revealed fundamental incompatibilities with casual turn-based gameplay:

1. **Mobile Backgrounding & Sleep:** Switching apps to share an invite link or locking a phone suspends browser WebSockets and WebRTC connections, causing PeerJS handshakes to hang or drop.
2. **No True Asynchronous Play:** In a Host-Guest P2P topology, the Host tab *is* the server. If Player 1 puts their phone down, Player 2 cannot take their turn until Player 1 wakes their device and re-establishes a live WebRTC tunnel.
3. **Consumer Router / Firewall Fragility:** Home routers frequently drop NAT hairpinning (loopback) packets, and Windows Firewall blocks mDNS on public Wi-Fi profiles, making P2P unreliable without always-on TURN relays.

Therefore, remote multiplayer is **moved from PeerJS/WebRTC to Cloud-Backed Asynchronous State Synchronization** using the existing Firebase stack (`@arcade/lib-user`, Cloud Firestore, and Firebase Anonymous Auth).

---

## 2. Baseline Architectural Principles

1. **Clean Mode Separation (No Hybrid Local/Remote):**
    - Games are explicitly either **Local Multiplayer (Pass-and-Play)** or **Remote Multiplayer (Online)**.
    - Mixing local participants and remote peers in the same session is excluded to keep turn coordination and UI state simple.
2. **Zero-Network Local Mode:**
    - Local Pass-and-Play runs 100% in-memory and local storage with zero Firestore reads/writes and zero network calls. It works completely offline.
3. **Cloud-Backed Room State (Firestore):**
    - Each online match is stored as a document in `rooms/{roomId}` in Cloud Firestore.
    - Both players subscribe to the room document via `onSnapshot` when the app is open, and can close their browser/PWA at any time without losing the match or blocking the opponent.
    - Turn validation and state transitions run through deterministic game reducers and optimistic concurrency (Firestore transactions or versioned `moveCount` checks) enforced by `firestore.rules`.
4. **Frictionless Identity (Anyone with the Link):**
    - Creating or joining a room **does not require creating an account**.
    - Players enter a display name (pre-populated from `@arcade/lib-user` profile if signed in, or `"Guest"` / custom name).
    - Under the hood, Firebase Anonymous Auth (or an existing signed-in Firebase `uid`) provides a stable `playerUid` for Firestore security rules and reconnects, even if the user refreshes or switches tabs.
5. **Wait-for-Opponent Start Gate:**
    - After creating a room, Player 1 (Host) waits until Player 2 (Guest) joins the room before the first move is unlocked.
    - Once Player 2 joins, the room transitions from `waiting` to `active`, and both players are notified that the match is ready and it is Player 1's turn.
6. **Zero-Cost Firebase Spark Plan Constraint (Layered Alerts):**
    - The architecture must run **100% within the Firebase Spark (Free) plan**—no Blaze-only services (such as Firebase Cloud Functions).
    - Live turn updates arrive via Firestore `onSnapshot` listeners (with browser `Notification` API / tab-title / audio alerts when a tab is open).
    - When players are offline or have closed the app, turn discovery uses an in-app **Active Games** list plus an optional one-tap **"Share turn reminder"** link via the OS Share sheet.
    - *(True closed-app background Web Push can be added later via a free-tier edge worker or Blaze Cloud Function without changing the Firestore room schema.)*
7. **Human-Friendly Room Codes:**
    - Users see and share a concise 6-character code (e.g., `k7m2p9`) via `?room=k7m2p9`.
    - Role (`host` vs `guest`) is **never** trusted blindly from URL parameters alone; it is derived from matching the user's `uid` against `players.host.uid` / `players.guest.uid` in the room document.

---

## 3. High-Level Data Model (`rooms/{roomId}`)

```typescript
export type RoomPhase = 'waiting' | 'active' | 'completed' | 'abandoned';

export interface RoomParticipant {
	readonly uid: string;
	readonly name: string;
	readonly role: 'host' | 'guest';
	readonly mark: 'X' | 'O'; // or game-specific slot index
	readonly joinedAt: number;
	readonly lastSeenAt: number;
}

export interface CloudRoomDocument<TState> {
	readonly roomId: string;
	readonly gameId: string; // e.g. 'tictactoe'
	readonly phase: RoomPhase;
	readonly version: number; // monotonically incremented on every valid move/reset
	readonly currentTurnUid: string | null;
	readonly rematchRequestedBy: string | null; // uid of player requesting rematch
	readonly closedBy: string | null; // uid of player who left/closed the room
	readonly host: RoomParticipant;
	readonly guest: RoomParticipant | null;
	readonly gameState: TState;
	readonly createdAt: number;
	readonly updatedAt: number;
	readonly expiresAt: number; // Firestore TTL (+14 days)
}
```

### Concurrency & Security Rules Invariants

- **No Double-Join:** Once `guest` is non-null, a third user with a different `uid` cannot overwrite `guest` (they may either be shown a "Room is full" screen or an optional read-only spectator view).
- **Turn Enforcement:** A player can only update `gameState` when `phase === 'active'` and `request.auth.uid == resource.data.currentTurnUid` (plus `version == resource.data.version + 1`).
- **Role Recovery on Refresh:** If the Host opens the shared link (`?room=k7m2p9` without `&role=host`) on their own device, matching `uid === room.host.uid` automatically restores them as the Host.

---

## 4. Monorepo Boundaries & Migration Scope

- **`@arcade/lib-multiplayer`:**
    - Replaces `peerjs` hooks (`useHostSession`, `useGuestSession`) and `iceServers.ts` with a unified cloud room hook (e.g., `useCloudRoom<TState, TAction>`), room lifecycle helpers, and push subscription hooks.
    - Removes the `peerjs` dependency and PeerJS/STUN/TURN GDPR disclosures.
- **`@arcade/lib-user`:**
    - Exposes/ensures an active Firebase Auth `uid` (upgrading seamlessly via Anonymous Auth when a guest starts or joins an online game) and stores the user's active room list for quick resume.
- **`firestore.rules`:**
    - Authored exclusively via the `firestore-rules-author` specialist subagent when implementing the `rooms/{roomId}` rules.
- **Legal / Privacy Documentation (Deferred Follow-Up):**
    - Privacy policy and consent disclosures will be updated in a dedicated follow-up step to remove PeerJS/STUN/TURN references and document Firestore room storage & anonymous session IDs.
