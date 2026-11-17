# Multiplayer Gameplay & State-Flow Specification

**Status:** Draft for Review  
**Related ADR:** [ADR-0011: Multiplayer Architecture](adr/0011-multiplayer-architecture.md)

This document defines the end-to-end player experience, state transitions, reconnection behavior, and notification strategy for asynchronous turn-based multiplayer games in Absolute Holz Arcade.

---

## 1. Core Design Goal

Players should be able to start a game, share a link, and play **completely asynchronously** over minutes, hours, or days—or play live if both happen to have the app open at the same time:

- **No simultaneous presence required:** Either player can lock their phone, close their browser tab, or switch apps between turns.
- **No account wall:** Anyone who receives a game link can enter a display name and play immediately.
- **Clear turn ownership & alerts:** Both players know when the room is ready, whose turn it is, and are notified when it is time to play.

---

## 2. End-to-End Player Journey

```
Player 1 (Host)                                 Player 2 (Guest)
---------------                                 ----------------
1. Opens Game Lobby -> Online
   Enters name -> clicks "Host a Session"
   - Room created in Firestore (phase: 'waiting')
   - URL updated to ?room=k7m2p9
   - Shares invite link via OS Share / Copy

   [ Waiting for Player 2 to join... ]
   (Host can lock phone or leave app)
                                                2. Opens shared link (?room=k7m2p9)
                                                   - Sees "Join Session" dialog
                                                   - Enters name -> clicks "Join Session"
                                                   - Room updates: phase = 'active',
                                                     currentTurnUid = host.uid

3. Notified: "Player 2 joined! Your turn." <------ (Both devices now in 'active' phase)
   - Opens room (or already watching live)
   - Makes Move #1
   - Room updates: currentTurnUid = guest.uid
   - Host locks phone / puts device away

                                                4. Notified: "It's your turn vs Player 1!"
                                                   - Opens app / room link
                                                   - Sees Move #1, makes Move #2
                                                   - Room updates: currentTurnUid = host.uid

5. Notified: "It's your turn vs Player 2!" <------
   ... turns alternate until Win / Draw ...

6. Game Over (phase: 'completed')
   - Both players see Victory / Defeat / Draw
   - Clicking "Play Again" sets rematchRequestedBy = myUid and prompts the opponent to accept
   - When the opponent accepts, the board resets and the starting player alternates
   - Either player can also click "Leave / Close Room" (phase: 'abandoned', notifying the other player)
```

---

## 3. Room States & Rules

### 3.1 Room Phases

| Phase | Trigger | Board Interaction | What Both Players See |
| :--- | :--- | :--- | :--- |
| `waiting` | Host creates room | **Locked** for Host until Guest joins | Host: *"Waiting for opponent to join"* + Share Link button.<br>Guest (before confirming): *"Join Session"* name prompt. |
| `active` | Guest confirms join | **Unlocked only** for `currentTurnUid` | Active player: *"Your turn (X)"*.<br>Waiting player: *"Waiting for [Name] (O)..."* |
| `completed` | Win or Draw | **Locked**; Victory/Defeat/Draw dialog | Final board + *"Play Again"* (requests rematch; prompts opponent to accept) / *"Leave Room"*. |
| `abandoned` | Player leaves/closes room or 14-day TTL expires | **Locked** | Remaining player sees *"[Name] left the match / Room closed"* + *"Back to Menu"*. |

### 3.2 Refresh, Reload, and "Wrong Link" Recovery

1. **URL Always Reflects Room:** As soon as the Host creates a room, the browser URL is updated via `history.replaceState` to include `?room=<CODE>`. Refreshing the page never creates a duplicate room.
2. **Role Determined by Identity, Not URL:** If the Host accidentally opens the plain invite link (`?room=k7m2p9`) on their own device, the app checks their Firebase `uid` against `room.host.uid` and restores them as the Host automatically.
3. **Browser vs. Installed PWA:** Because the session state lives in Firestore (not just one browser's `localStorage`), if a player opens a link in their regular browser, signs in/joins, or later opens their installed PWA, signed-in users see the match in their **Active Games** list—and anonymous users can paste the room code or bookmark the URL. *(Note: On Windows/Android, opening an external link in the browser vs. installed PWA uses separate `localStorage` origins/profiles only on iOS Safari; on desktop Chrome/Edge, `localStorage` and IndexedDB are shared between the browser and the installed PWA, though OS link-capturing determines which window opens.)*

---

## 4. Turn Notifications (Firebase Spark Free-Plan Strategy)

To keep hosting and backend costs strictly **$0 on the Firebase Spark (Free) plan**, we do not use paid Blaze-only services (such as Firebase Cloud Functions) to send server-triggered background Web Push notifications. Instead, we use a **three-layer free notification & discovery model**:

1. **In-Tab / Background-Tab Alerts (Browser `Notification` API + Title + Audio):**
    - While a player has the game tab or PWA open (even minimized or in another tab on desktop), Firestore's `onSnapshot` listener receives turn changes instantly.
    - If the tab is hidden (`document.visibilityState === 'hidden'`), the app flashes the browser tab title (`"Your turn! — Tic-Tac-Toe"`), plays an optional chime via `@arcade/lib-audio`, and—if the user granted browser notification permission—fires a local `new Notification(...)` alert.
2. **"My Active Games" List (Lobby & Hub):**
    - Active rooms for the player's `uid` are listed in the game Lobby (and/or Hub) showing opponent name, status (*"Your turn"*, *"Waiting for [Name]"*, *"Waiting for opponent to join"*, or *"Closed by [Name]"*), and a **Delete / Leave Room** action.
    - When a player deletes/leaves a room from the game or from **My Active Games**, the room transitions to `phase: 'abandoned'` (`closedBy: uid`) so the opponent is clearly notified when they next check the room before the room is cleaned up.
3. **One-Tap "Share Turn Reminder" Nudge:**
    - After making a move (or while waiting), a subtle *"Nudge opponent"* / *"Share turn link"* button lets the player send the room URL via their device's native Share sheet (WhatsApp, iMessage, etc.) if the opponent isn't actively watching.
4. **Automatic 14-Day Room Cleanup:**
    - Every room sets `expiresAt = updatedAt + 14 days` so abandoned or finished rooms expire automatically via Firestore TTL without manual maintenance.

> [!NOTE]
> **Future Upgrade Path:** If closed-app mobile Web Push is desired later, a free-tier edge worker (e.g., Cloudflare Workers + VAPID) or Firebase Blaze Cloud Function can be attached to `rooms/{roomId}` without changing the client room protocol.

---

## 5. Finalized Decisions & Deferred Follow-Ups

- **Firebase Tier:** Strictly **Spark (Free) plan** (Cloud Firestore + Anonymous Auth + Firestore 14-day TTL).
- **Rematch Flow:** Clicking **Play Again** sends a rematch request (`rematchRequestedBy`) and prompts the opponent to accept before resetting the board.
- **Room Lifecycle:** 14-day automatic TTL plus manual **Leave / Close Room** from in-game or **My Active Games**, notifying the remaining player when a room is closed.
- **Deferred Follow-Up:** Update legal/privacy documentation and consent disclosures in a dedicated step after the multiplayer implementation is in place.
