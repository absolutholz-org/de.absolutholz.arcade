# @arcade/lib-user

Unified user identity, session management, and cloud persistence facade for the Arcade Web App monorepo. Enforces clean architectural boundaries separating client game code from low-level authentication providers and cloud SDKs in accordance with [ADR 008](../../docs/adr/architecture-decision-records.md#adr-008-state-management-and-backend-abstraction) and [ADR 012](../../docs/adr/architecture-decision-records.md#adr-012-local-storage-and-state-namespacing).

---

## 💡 Why This Package Exists

Across the Arcade ecosystem (`apps/hub`, `apps/sudoku`, `apps/minesweeper`, etc.), applications require user identification and state persistence:

- **Local Guest First:** Games must function completely offline and without requiring accounts, immediately providing a seamless guest experience.
- **Architectural Boundary:** Consuming applications (`apps/*`) must **never** directly import Firebase SDKs, manage credentials, or interact with raw storage keys.
- **Pluggable Cloud Sync:** When users opt in to cloud synchronization (e.g. Google Sign-In or anonymous Firebase accounts), data flows seamlessly through a unified interface facade (`IUserService`).

`@arcade/lib-user` abstracts all authentication mechanics, storage adapters, and session transitions behind a single factory function: `createUserService`.

---

## 📦 Features

- **Strict Decoupling:** Firebase Modular SDKs (`firebase/auth`, `firebase/firestore`) are entirely internal and never leaked in exported type definitions.
- **Local Persistence via `@arcade/lib-storage`:** Local guest profiles and session preferences use namespaced storage (`arcade::user::*`) adhering to ADR 012.
- **Unified Domain Contracts:** Consuming code interacts exclusively with high-level contracts: `UserProfile`, `UserSession`, `StorageMode`, and `IUserService`.
- **SSR & Node Safe:** Gracefully falls back to local guest mode when Firebase is unconfigured or during static pre-rendering.
- **Reactive Subscriptions:** Provides `subscribe(listener)` to notify consuming components of session changes in real-time.

---

## 🚀 Usage

### 1. Initializing the Service Facade

```ts
import { createUserService } from "@arcade/lib-user";

// Create an instance of the user service
const userService = createUserService();

// Restore session and attach listeners
const session = await userService.initialize();
console.log("Current user:", session.user?.displayName);
```

### 2. Subscribing to Session Transitions

```ts
import { createUserService, type UserSession } from "@arcade/lib-user";

const userService = createUserService();

const unsubscribe = userService.subscribe((session: UserSession) => {
	if (session.isAuthenticated) {
		console.log(`Signed in as: ${session.user?.displayName}`);
	} else {
		console.log("Operating as local guest:", session.user?.displayName);
	}
});

// Cleanup when unmounting
unsubscribe();
```

### 3. Signing In and Profile Management

```ts
// Initiate Google Sign-In
const user = await userService.signInWithGoogle();

// Update display name
await userService.updateProfile({ displayName: "SpeedCuber" });

// Sign out (reverts to local guest profile)
await userService.signOut();
```

---

## 🛡️ Architectural Boundaries

1. **Zero Firebase Leaks:** Consuming apps must never import `firebase/*`. All Firebase logic resides privately in `libraries/user/src/internal/`.
2. **Pure TypeScript Logic:** No UI components, JSX, or CSS.
3. **No Direct `localStorage` Access:** Local persistence strictly consumes `@arcade/lib-storage`.
