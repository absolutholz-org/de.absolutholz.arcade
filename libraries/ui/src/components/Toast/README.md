# Toast Notification System (`@arcade/lib-ui`)

The Toast Notification System is `@arcade/lib-ui`'s universal notification layer. It provides lightweight, transient, and accessible status messages without interrupting active gameplay or stealing keyboard focus.

---

## 1. Component Decision Matrix: When to Use What

Choosing the appropriate notification pattern is critical for usability, gameplay immersion, and WCAG accessibility compliance.

| Pattern | Component | Nature | Focus Contract | Typical Use Cases | Anti-Patterns |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Toast** | `<ToastContainer />`<br/>`toast.*` | **Transient & Non-blocking**<br/>Asynchronous feedback; automatically dismisses after 6–8s or on dismiss click. | **NEVER steals focus**.<br/>User remains focused on their active input, game board, or control. | • Achievement or medal unlocked<br/>• Game auto-save confirmation<br/>• Cloud sync completed<br/>• Cache/offline update available<br/>• Short undo action notice | • **Do NOT** use for critical errors that block progress.<br/>• **Do NOT** use for confirmations requiring decision.<br/>• **Do NOT** embed complex forms. |
| **Modal Dialog** | `<Dialog />` | **Blocking & Modal**<br/>Requires deliberate user action or confirmation before proceeding. | **Traps focus**.<br/>Moves focus to modal and traps it until closed or confirmed. | • Confirming game restart/forfeit<br/>• Confirming data deletion or reset<br/>• Consent tier selection<br/>• Player profile settings | • **Do NOT** use for passive confirmations.<br/>• **Do NOT** interrupt active puzzle gameplay with toasts disguised as modals. |
| **Inline Alert / Banner** | `<Banner />` | **Persistent & Contextual**<br/>Static or conditional message embedded directly in document flow. | **In document flow**.<br/>Preserves normal reading order and landmark hierarchy. | • Offline mode indicator toolbar<br/>• Top-of-page maintenance alert<br/>• Form validation error summary<br/>• Data loss warning banner | • **Do NOT** float over the interactive game canvas.<br/>• **Do NOT** auto-dismiss important static warnings. |

---

## 2. Architectural & Accessibility (a11y) Rules

1. **Persistent Live Region Host**
   - The `<ToastContainer />` host element must be mounted in the DOM **before** toasts are triggered.
   - It specifies `role="status"`, `aria-live="polite"`, and `aria-atomic="false"`.
   - Mounting the container in the root layout guarantees that assistive technologies (screen readers like NVDA, VoiceOver, JAWS) detect and announce new toasts smoothly without missing mutations.
   - When empty, the host container remains in the DOM with `pointer-events: none` so it never blocks clicks or touches.

2. **Zero Focus Stealing**
   - Transient toasts must **never** call `.focus()` or use `autofocus`.
   - Players typing into inputs or navigating puzzle grids with a keyboard or gamepad must never lose focus when a toast appears.

3. **Timer & Pause Contract**
   - **Default Duration:** 7000ms (7 seconds), satisfying the 6–8 second guideline for reading and cognitive accessibility.
   - **Pointer / Hover Pause:** When the user hovers over a toast (`pointerenter` / `mouseenter`), the auto-dismiss timer immediately pauses. It resumes only after the pointer leaves.
   - **Keyboard Focus Pause:** When a user moves keyboard focus into the toast (e.g., to the dismiss button or action link), the auto-dismiss timer pauses. It resumes only when focus moves outside the toast.
   - **Resumption Calculation:** Timers resume only for their remaining duration (`remainingTime = Math.max(0, remainingTime - elapsed)`).

4. **Accessible Dismiss Action**
   - Every toast renders an accessible dismiss button with `type="button"`, `aria-label="Dismiss notification"`, and standard `min-width: 24px; min-height: 24px;` touch targets (WCAG 2.2 AA).
   - Operable via click or standard keyboard navigation (`Enter` or `Space`).

5. **Sequential Queue Management**
   - Toasts render inside a structured flex list with spacing tokens (`gap`), ensuring multiple notifications never visually collide or overlap.
   - The internal queue controller enforces `maxVisibleToasts` (default: 3). If a rapid burst of notifications occurs, excess toasts wait in the queue and are automatically promoted as earlier ones dismiss.

6. **Reduced Motion & Theme Integration**
   - Transitions strictly obey `@media (prefers-reduced-motion: reduce)` by disabling transition delays and animations.
   - Fully utilizes design system tokens (`themeColor('surface')`, `themeColor('text-1')`, `radiusScale.lg`) and `light-dark()` Oklch color definitions across both light and dark themes.

---

## 3. Supported Status Variants

- **`'info'`**: Neutral operational feedback (e.g., settings updated). Default icon: `info`.
- **`'success'`**: Successful completion of an operation (e.g., cloud sync complete). Default icon: `check`.
- **`'warning'`**: Non-fatal system conditions (e.g., approaching storage quota). Default icon: `alert-circle`.
- **`'achievement'`**: Celebratory milestone or medal unlock. Default icon: `trophy`, styled with radiant golden amber accent.

---

## 4. Usage Guide

### Setup: Mount the Persistent Host Container

Place `<ToastContainer />` once in the root layout (e.g. `BaseLayout.astro` or main App wrapper):

```tsx
import { ToastContainer } from '@arcade/lib-ui';

export function App() {
  return (
    <>
      <main id="main-content">
        {/* Page content / Game canvas */}
      </main>
      <ToastContainer position="top-right" maxVisibleToasts={3} />
    </>
  );
}
```

### Triggering Notifications Programmatically

The `toast` controller can be called anywhere in application or game code:

```typescript
import { toast } from '@arcade/lib-ui';

// Simple message
toast.info('Settings saved.');

// Success notification
toast.success('Scores synchronized to your account.', {
  title: 'Cloud Sync',
});

// Warning notification
toast.warning('Network disconnected. Caching moves locally.', {
  title: 'Offline Mode',
});

// Achievement / Medal notification
toast.achievement('Beat Sudoku Hard mode in under 5 minutes!', {
  title: 'Medal Unlocked: Speed Demon',
});

// Custom duration or action
const toastId = toast.show({
  variant: 'info',
  title: 'Game Suspended',
  message: 'Your current board state was saved.',
  duration: 10000,
  action: {
    label: 'Resume Now',
    onClick: () => resumeGame(),
  },
  onDismiss: () => console.log('Toast closed'),
});

// Programmatic dismissal
toast.dismiss(toastId);
toast.dismissAll();
```
