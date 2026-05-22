/**
 * @module hooks/useClickOutside
 * @description Reusable hook that fires a callback when a click or touch
 * event lands outside the referenced element.
 */

import { useEffect } from "react";

/**
 * Invokes `handler` whenever a `mousedown` or `touchstart` event occurs
 * outside the element held by `ref`.
 *
 * Events are captured during the *capture* phase so the callback runs
 * before any children can stop propagation.
 *
 * @example
 * ```tsx
 * const panelRef = useRef<HTMLDivElement>(null);
 * useClickOutside(panelRef, () => setOpen(false), isOpen);
 * ```
 *
 * @param ref     - Ref pointing to the "inside" element.
 * @param handler - Callback to execute on outside click.
 * @param enabled - When `false`, no listeners are attached.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener, { capture: true });
    document.addEventListener("touchstart", listener, { capture: true });

    return () => {
      document.removeEventListener("mousedown", listener, { capture: true });
      document.removeEventListener("touchstart", listener, { capture: true });
    };
  }, [ref, handler, enabled]);
}
