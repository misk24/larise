"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface SmoothScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SmoothScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const { scrollToElement } = useSmoothScroll();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const isHome = pathname === "/";
      const isSectionLink = href.startsWith("#");
      const isHomeLink = href === "/";

      // Only intercept same-page navigation on the landing page.
      // On other routes, "/" must navigate home instead of scrolling the current page.
      if (isHome && isSectionLink && document.querySelector(href)) {
        e.preventDefault();
        scrollToElement(href);
      } else if (isHome && isHomeLink) {
        e.preventDefault();
        scrollToElement("html");
      }

      onClick?.(e);
    };

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn("transition-colors hover:text-accent", className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

SmoothScrollLink.displayName = "SmoothScrollLink";
