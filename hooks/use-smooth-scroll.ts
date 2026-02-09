"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollToElement = useCallback((targetId: string) => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

    // Kill any ongoing GSAP animations
    gsap.killTweensOf(window);

    const element = document.querySelector(targetId);
    if (!element) return;

    // Get the target position
    const targetPosition = (element as HTMLElement).offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1500); // Dynamic duration based on distance

    // Use GSAP for smooth scrolling
    gsap.to(window, {
      duration: duration / 1000,
      scrollTo: {
        y: targetPosition,
        autoKill: true,
      },
      ease: "power2.inOut",
      onComplete: () => {
        // Ensure ScrollTrigger is updated after scroll completes
        ScrollTrigger.refresh();
      },
      onUpdate: () => {
        // Refresh ScrollTrigger during scroll
        ScrollTrigger.refresh();
      },
    });
  }, []);

  return { scrollToElement };
}
