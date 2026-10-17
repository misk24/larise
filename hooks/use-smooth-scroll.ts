"use client";

import { useCallback } from "react";

const DEFAULT_HEADER_OFFSET = 80;

export function useSmoothScroll() {
  const scrollToElement = useCallback((target: string) => {
    const isTopTarget = target === "html" || target === "body" || target === "/";
    const element = isTopTarget ? null : document.querySelector<HTMLElement>(target);

    // Do not hijack a link if its target does not exist.
    if (!isTopTarget && !element) return false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const top = element
      ? Math.max(
          0,
          element.getBoundingClientRect().top +
            window.scrollY -
            DEFAULT_HEADER_OFFSET,
        )
      : 0;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    return true;
  }, []);

  return { scrollToElement };
}
