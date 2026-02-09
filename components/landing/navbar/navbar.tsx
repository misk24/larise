"use client";

import { navLinks } from "@/components/landing/shared";
import { Scale } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { useOverlay } from "@/hooks/use-overlay";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { loginButton } from "./constant";
import { MobileHeader } from "./mobile-navbar";
import { useScroll } from "./use-scroll";

export function Navbar() {
  const isScrolled = useScroll();
  const isOpen = useOverlay();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <Scale className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 md:px-8">
        <SmoothScrollLink href="/">
          <Logo />
        </SmoothScrollLink>

        <nav className="hidden md:inline-block">
          <ul className="flex items-center gap-12">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="text-sm hover:text-accent transition-colors"
              >
                <SmoothScrollLink href={link.href}>
                  {link.label}
                </SmoothScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          size="sm"
          className="hidden md:inline-flex px-6 rounded-full"
          asChild
        >
          <Link href={loginButton.href}>{loginButton.label}</Link>
        </Button>

        <Button
          variant="link"
          size="icon"
          onClick={isOpen.toggle}
          className="md:hidden"
          aria-expanded={isOpen.isOpen}
          aria-label="Toggle Menu"
        >
          <Menu className="size-4" />
        </Button>
      </Scale>

      <MobileHeader isOpen={isOpen.isOpen} onClose={isOpen.close} />
    </header>
  );
}
