"use client";

import { useCallback } from "react";

export const useSmoothScroll = () => {
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only apply smooth scroll to anchor links (starting with #) or home link
    if (href.startsWith("#") || href === "/") {
      e.preventDefault();
      
      if (href === "/") {
        // Scroll to top when clicking logo
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        // Smooth scroll to anchor
        const targetId = href.replace("#", "");
        const element = document.getElementById(targetId);
        
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    }
    // For other regular links, let Next.js handle navigation normally
  }, []);

  return handleSmoothScroll;
};
