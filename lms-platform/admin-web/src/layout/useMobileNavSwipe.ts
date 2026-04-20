import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";

const MOBILE_MAX = 900;
const EDGE_PX = 28;
const OPEN_DX = 52;
const CLOSE_DX = 56;
const OPEN_DOMINANCE = 1.15;

/**
 * Mobile-only: swipe right from the left screen edge to open the nav drawer;
 * when open, swipe left from the sidebar to close (matches common app patterns).
 */
export function useMobileNavSwipe(mobileNavOpen: boolean, setMobileNavOpen: Dispatch<SetStateAction<boolean>>): void {
  const openRef = useRef(mobileNavOpen);
  openRef.current = mobileNavOpen;

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);

    type Mode = "idle" | "opening" | "closing";
    let mode: Mode = "idle";
    let startX = 0;
    let startY = 0;
    let openMaxDx = 0;
    let openMaxDy = 0;
    let closeMinDx = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (!mq.matches || e.touches.length !== 1) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      if (openRef.current) {
        const target = e.target as Element | null;
        if (target?.closest?.(".crm-sidebar")) {
          mode = "closing";
          startX = x;
          closeMinDx = 0;
        }
        return;
      }

      if (x <= EDGE_PX) {
        mode = "opening";
        startX = x;
        startY = y;
        openMaxDx = 0;
        openMaxDy = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (mode === "idle" || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (mode === "opening") {
        openMaxDx = Math.max(openMaxDx, x - startX);
        openMaxDy = Math.max(openMaxDy, Math.abs(y - startY));
      } else if (mode === "closing") {
        closeMinDx = Math.min(closeMinDx, x - startX);
      }
    };

    const reset = () => {
      mode = "idle";
    };

    const onTouchEnd = () => {
      if (mode === "opening") {
        if (!openRef.current && openMaxDx >= OPEN_DX && openMaxDx > openMaxDy * OPEN_DOMINANCE) {
          setMobileNavOpen(true);
        }
      } else if (mode === "closing") {
        if (openRef.current && closeMinDx <= -CLOSE_DX) {
          setMobileNavOpen(false);
        }
      }
      reset();
    };

    const onTouchCancel = () => {
      reset();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [setMobileNavOpen]);
}
