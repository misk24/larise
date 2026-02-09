"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SmoothScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SmoothScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const { scrollToElement } = useSmoothScroll();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Handle anchor links and root path
      if (href.startsWith("#") || href === "/") {
        e.preventDefault();

        if (href === "/") {
          // Scroll to top for root path
          scrollToElement("html");
        } else {
          scrollToElement(href);
        }
      }

      // Call original onClick if provided
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
  }
);

SmoothScrollLink.displayName = "SmoothScrollLink";
