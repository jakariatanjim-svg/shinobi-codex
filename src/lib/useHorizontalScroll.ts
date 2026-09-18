/* Shinobi Codex v3.5 — global PC wheel support for horizontal rails.
 * Mouse users get vertical-wheel → horizontal-scroll inside any
 * .scroll-rail / [data-hrail] strip; touch / trackpad behaviour is untouched. */

import { useEffect } from "react";

export function useHorizontalScroll(): void {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const rail = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        ".scroll-rail, [data-hrail]",
      );
      if (!rail) return;

      const canScroll = rail.scrollWidth - rail.clientWidth > 8;
      if (!canScroll) return;

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;

      const atStart = rail.scrollLeft <= 0;
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
      // Let the page scroll naturally when the rail has reached either edge
      if ((atStart && delta < 0) || (atEnd && delta > 0)) return;

      event.preventDefault();
      rail.scrollLeft += delta;
    };

    // Non-passive so preventDefault() works for mouse wheels
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
}
