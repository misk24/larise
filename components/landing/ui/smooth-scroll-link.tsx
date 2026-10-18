"use client";

import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

interface SmoothScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const LandingScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  ({ href, children, onClick, ...props }, ref) => {
    const pathname = usePathname();
    const { scrollToElement } = useSmoothScroll();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      const isHome = pathname === "/";
      const isSectionLink = href.startsWith("#");

      if (isHome && isSectionLink && document.querySelector(href)) {
        event.preventDefault();
        scrollToElement(href);
      } else if (isHome && href === "/") {
        event.preventDefault();
        scrollToElement("html");
      }

      onClick?.(event);
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  },
);

LandingScrollLink.displayName = "LandingScrollLink";
